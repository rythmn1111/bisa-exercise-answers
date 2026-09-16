"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

function Highlight({ text, tokens }) {
  if (!tokens.length) return <>{text}</>;
  const esc = tokens
    .filter((t) => t.length > 1)
    .map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .sort((a, b) => b.length - a.length);
  if (!esc.length) return <>{text}</>;
  const parts = text.split(new RegExp(`(${esc.join("|")})`, "ig"));
  const low = tokens.map((t) => t.toLowerCase());
  return (
    <>
      {parts.map((p, i) =>
        low.includes(p.toLowerCase()) ? <mark key={i}>{p}</mark> : <span key={i}>{p}</span>
      )}
    </>
  );
}

export default function Search({ index }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [sel, setSel] = useState(0);
  const boxRef = useRef(null);
  const inputRef = useRef(null);
  const router = useRouter();

  const tokens = useMemo(
    () =>
      query
        .toLowerCase()
        .split(/[^a-z0-9_.]+/)
        .filter((t) => t.length > 1 || /\d/.test(t)),
    [query]
  );

  const hits = useMemo(() => {
    if (!tokens.length) return [];
    return index
      .map((e) => {
        const text = e.text.toLowerCase();
        const set = e.setTitle.toLowerCase();
        let score = 0;
        for (const t of tokens) {
          if (text.includes(t)) score += text.startsWith(t) ? 6 : 4;
          else if (set.includes(t)) score += 1;
          else return { e, score: 0 };
        }
        return { e, score };
      })
      .filter((r) => r.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 16)
      .map((r) => r.e);
  }, [index, tokens]);

  useEffect(() => setSel(0), [query]);

  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        inputRef.current?.focus();
        inputRef.current?.select();
        setOpen(true);
      }
      if (e.key === "Escape") {
        setOpen(false);
        inputRef.current?.blur();
      }
    };
    const onClick = (e) => {
      if (boxRef.current && !boxRef.current.contains(e.target)) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, []);

  function go(e) {
    setOpen(false);
    setQuery("");
    router.push(`/s/${e.setId}#${e.num}`);
  }

  return (
    <div className="sw" ref={boxRef}>
      <input
        ref={inputRef}
        className="si"
        placeholder="Search every question…  ⌘K"
        value={query}
        onChange={(ev) => {
          setQuery(ev.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={(ev) => {
          if (!hits.length) return;
          if (ev.key === "ArrowDown") {
            ev.preventDefault();
            setSel((s) => (s + 1) % hits.length);
          } else if (ev.key === "ArrowUp") {
            ev.preventDefault();
            setSel((s) => (s - 1 + hits.length) % hits.length);
          } else if (ev.key === "Enter") {
            ev.preventDefault();
            go(hits[sel]);
          }
        }}
        aria-label="Search questions"
      />
      {open && query.trim() && (
        <div className="sr">
          {hits.length === 0 ? (
            <div className="sempty">No question matches those words.</div>
          ) : (
            hits.map((e, i) => (
              <a
                key={`${e.setId}-${e.num}-${i}`}
                href={`/s/${e.setId}#${e.num}`}
                className={`sh${i === sel ? " sel" : ""}`}
                onMouseEnter={() => setSel(i)}
                onClick={(ev) => {
                  ev.preventDefault();
                  go(e);
                }}
              >
                <div className="k">{e.num}</div>
                <div className="t">
                  <Highlight text={e.text} tokens={tokens} />
                </div>
                <div className="s">{e.setTitle}</div>
              </a>
            ))
          )}
        </div>
      )}
    </div>
  );
}
