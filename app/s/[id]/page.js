import Link from "next/link";
import { notFound } from "next/navigation";
import { getSet, getSets } from "@/lib/qa";
import QA from "@/components/QA";

export function generateStaticParams() {
  return getSets().map((s) => ({ id: s.id }));
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const s = getSet(id);
  if (!s) return { title: "Not found" };
  return { title: s.title, description: `${s.count} questions with answers — ${s.topic}` };
}

export default async function SetPage({ params }) {
  const { id } = await params;
  const sets = getSets();
  const i = sets.findIndex((s) => s.id === id);
  if (i === -1) notFound();

  const set = sets[i];
  const prev = sets[i - 1] || null;
  const next = sets[i + 1] || null;
  const written = set.questions.filter((q) => q.kind === "written").length;

  return (
    <main className="main">
      <div className="wrap">
        <header className="set-head">
          <h1>{set.title}</h1>
          <div className="meta">
            <span className="pill q">{set.count} questions</span>
            {written > 0 && <span className="pill">{written} written</span>}
            {set.topic && <span className="pill">{set.topic}</span>}
          </div>
          {set.source && <div className="src">source: {set.source}</div>}
          {set.datafile.map((d) => (
            <div className="src" key={d}>
              data: {d}
            </div>
          ))}
        </header>

        {set.setupHtml && (
          <div className="setup">
            <h3>Setup assumed by every answer below</h3>
            <div dangerouslySetInnerHTML={{ __html: set.setupHtml }} />
          </div>
        )}

        {set.questions.map((q) => (
          <QA key={q.num} q={q} />
        ))}

        <nav
          className="no-print"
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 12,
            marginTop: 34,
            fontSize: 13.5,
          }}
        >
          {prev ? <Link href={`/s/${prev.id}`}>← {prev.title}</Link> : <Link href="/">← All sets</Link>}
          {next ? <Link href={`/s/${next.id}`}>{next.title} →</Link> : <span />}
        </nav>
      </div>
    </main>
  );
}
