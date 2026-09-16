import Link from "next/link";
import { getGroups, getStats } from "@/lib/qa";

export default function Home() {
  const groups = getGroups();
  const stats = getStats();

  return (
    <main className="main">
      <div className="wrap">
        <header className="hero">
          <h1>Every exercise question, answered</h1>
          <p>
            The whole course exercise bank as a flat list: the question as it was set, and the
            answer. Code where the question wants code, words where it wants words. Every code
            answer was run against the real data files.
          </p>
          <div className="stats">
            <div className="stat">
              <span className="n">{stats.questions}</span>
              <span className="l">Questions</span>
            </div>
            <div className="stat">
              <span className="n">{stats.sets}</span>
              <span className="l">Exercise sets</span>
            </div>
            <div className="stat">
              <span className="n">{stats.code}</span>
              <span className="l">Code answers</span>
            </div>
            <div className="stat">
              <span className="n">{stats.written}</span>
              <span className="l">Written answers</span>
            </div>
          </div>
        </header>

        {groups.map((g) => (
          <section className="grp" key={g.name}>
            <h2>{g.name}</h2>
            <div className="cards">
              {g.sets.map((s) => (
                <Link key={s.id} href={`/s/${s.id}`} className="card">
                  <div className="t">{s.title.replace(/^[^—]*—\s*/, "")}</div>
                  {s.topic && <div className="p">{s.topic}</div>}
                  <div className="c">
                    {s.count} question{s.count === 1 ? "" : "s"}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ))}

        {groups.length === 0 && (
          <p style={{ color: "var(--fg-faint)" }}>
            No question sets in <code>data/</code> yet.
          </p>
        )}
      </div>
    </main>
  );
}
