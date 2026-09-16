import fs from "node:fs";
import path from "node:path";
import yaml from "js-yaml";
import { Marked } from "marked";
import { markedHighlight } from "marked-highlight";
import hljs from "highlight.js";

const DATA_DIR = path.join(process.cwd(), "data");

function makeRenderer() {
  const instance = new Marked(
    markedHighlight({
      emptyLangClass: "hljs",
      langPrefix: "hljs language-",
      highlight(code, lang) {
        const language = hljs.getLanguage(lang) ? lang : "plaintext";
        try {
          return hljs.highlight(code, { language }).value;
        } catch {
          return hljs.highlight(code, { language: "plaintext" }).value;
        }
      },
    }),
    { gfm: true, breaks: false }
  );
  instance.use({
    renderer: {
      table({ header, rows }) {
        const head = header.map((c) => `<th>${this.parser.parseInline(c.tokens)}</th>`).join("");
        const body = rows
          .map((r) => `<tr>${r.map((c) => `<td>${this.parser.parseInline(c.tokens)}</td>`).join("")}</tr>`)
          .join("");
        return `<div class="tw"><table><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table></div>`;
      },
    },
  });
  return instance;
}

const md = makeRenderer();

function parseFrontmatter(raw) {
  const text = raw.replace(/^﻿/, "");
  const m = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(text);
  if (!m) return { data: {}, body: text };
  let data = {};
  try {
    data = yaml.load(m[1]) || {};
  } catch (e) {
    console.warn("[qa] bad frontmatter:", e.message);
  }
  return { data, body: m[2] };
}

/**
 * Split a set body into question blocks.
 *
 * Each block starts at a `### Q<n>` heading, then contains `**Q.**` (the question)
 * followed by `**A.**` (the answer). Headings inside fenced code are ignored.
 */
function parseQuestions(body) {
  const lines = body.split("\n");
  const blocks = [];
  let inFence = false;
  let current = null;

  for (const line of lines) {
    if (/^\s*(```|~~~)/.test(line)) inFence = !inFence;

    if (!inFence) {
      const h = /^###\s+(\S+)\s*(.*)$/.exec(line);
      if (h) {
        if (current) blocks.push(current);
        current = { num: h[1].replace(/[.:]$/, ""), label: (h[2] || "").trim(), lines: [] };
        continue;
      }
    }
    if (current) current.lines.push(line);
  }
  if (current) blocks.push(current);

  return blocks.map((b) => {
    const text = b.lines.join("\n");
    // Split on the **A.** marker that sits at the start of its own line.
    const split = /(^|\n)\s*\*\*A\.?\*\*\s*/.exec(text);
    let qRaw = text;
    let aRaw = "";
    if (split) {
      qRaw = text.slice(0, split.index);
      aRaw = text.slice(split.index + split[0].length);
    }
    qRaw = qRaw.replace(/^\s*\*\*Q\.?\*\*\s*/m, "").trim();
    aRaw = aRaw.trim();

    const hasCode = /```python/.test(aRaw);
    const proseOnly = aRaw.replace(/```[\s\S]*?```/g, "").trim();

    return {
      num: b.num,
      label: b.label,
      questionText: qRaw.replace(/[#*`>_]/g, "").replace(/\s+/g, " ").trim(),
      questionHtml: md.parse(qRaw),
      answerHtml: md.parse(aRaw),
      kind: hasCode ? (proseOnly.length > 60 ? "code+notes" : "code") : "written",
      empty: aRaw.length === 0,
    };
  });
}

let cache = null;

export function getSets() {
  if (cache && process.env.NODE_ENV === "production") return cache;
  if (!fs.existsSync(DATA_DIR)) return [];

  const sets = fs
    .readdirSync(DATA_DIR)
    .filter((f) => f.endsWith(".md") && !f.startsWith("_"))
    .flatMap((file) => {
      let raw;
      try {
        raw = fs.readFileSync(path.join(DATA_DIR, file), "utf8");
      } catch (e) {
        console.warn(`[qa] skipping ${file}: ${e.message}`);
        return [];
      }
      const { data, body } = parseFrontmatter(raw);
      const questions = parseQuestions(body);
      return [
        {
          id: data.id || file.replace(/\.md$/, ""),
          file,
          title: data.title || file,
          topic: data.topic || "",
          group: data.group || "Other",
          source: data.source || "",
          datafile: Array.isArray(data.datafile)
            ? data.datafile
            : data.datafile
              ? [data.datafile]
              : [],
          order: typeof data.order === "number" ? data.order : 9999,
          setupHtml: data.setup ? md.parse("```python\n" + String(data.setup).trim() + "\n```") : "",
          setupRaw: data.setup ? String(data.setup).trim() : "",
          questions,
          count: questions.length,
        },
      ];
    });

  sets.sort((a, b) => a.order - b.order || a.title.localeCompare(b.title));
  cache = sets;
  return sets;
}

export function getSet(id) {
  return getSets().find((s) => s.id === id) || null;
}

export function getGroups() {
  const groups = [];
  for (const s of getSets()) {
    let g = groups.find((x) => x.name === s.group);
    if (!g) {
      g = { name: s.group, sets: [] };
      groups.push(g);
    }
    g.sets.push(s);
  }
  return groups;
}

/** Flat list for the search box: one entry per question. */
export function getSearchIndex() {
  return getSets().flatMap((s) =>
    s.questions.map((q) => ({
      setId: s.id,
      setTitle: s.title,
      num: q.num,
      text: q.questionText.slice(0, 220),
      kind: q.kind,
    }))
  );
}

export function getStats() {
  const sets = getSets();
  const questions = sets.reduce((n, s) => n + s.count, 0);
  const code = sets.reduce(
    (n, s) => n + s.questions.filter((q) => q.kind !== "written").length,
    0
  );
  return {
    sets: sets.length,
    questions,
    code,
    written: questions - code,
    groups: getGroups().length,
  };
}
