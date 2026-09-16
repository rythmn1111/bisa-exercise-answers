import fs from "node:fs";
import path from "node:path";
import { getSets, getStats } from "@/lib/qa";
import AutoPrint from "@/components/AutoPrint";

export const metadata = {
  title: "All questions and answers",
  robots: { index: false },
};

// Read fresh on every request: scripts/build-pdf.mjs renders this route twice,
// writing .pagemap.json in between, so the index can carry real page numbers.
export const dynamic = "force-dynamic";

const PAGEMAP = path.join(process.cwd(), ".pagemap.json");

function loadPagemap() {
  try {
    return JSON.parse(fs.readFileSync(PAGEMAP, "utf8"));
  } catch {
    return {};
  }
}

/** Invisible token that survives pdftotext, so pass 1 can find each item's page. */
function Marker({ id }) {
  return <span className="idx-marker">{`idxmark-${id}--`}</span>;
}

function pg(map, key) {
  const v = map[key];
  return typeof v === "number" ? v : null;
}

export default async function PrintAll({ searchParams }) {
  const params = (await searchParams) || {};
  const excluded = String(params.exclude || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const all = getSets();
  const sets = all.filter((s) => !excluded.includes(s.id));
  const stats = getStats();
  const map = loadPagemap();
  const printed = new Date().toISOString().slice(0, 10);

  const questions = sets.reduce((n, s) => n + s.count, 0);
  const codeN = sets.reduce((n, s) => n + s.questions.filter((q) => q.kind !== "written").length, 0);
  const haveNumbers = Object.keys(map).length > 0;

  // Group the back index the way a reader scans it: by set, in reading order.
  const groupsForIndex = [];
  for (const s of sets) {
    let g = groupsForIndex.find((x) => x.name === s.group);
    if (!g) {
      g = { name: s.group, sets: [] };
      groupsForIndex.push(g);
    }
    g.sets.push(s);
  }

  return (
    <main className="main print-root">
      <AutoPrint />
      <div className="wrap">
        {/* ---- title page ---- */}
        <section className="print-title">
          <div className="pt-kicker">Goa Institute of Management · BIFS 2026–27</div>
          <h1>
            Exercise Answers
            <br />
            <span>Python · pandas · Matplotlib</span>
          </h1>
          <p>
            Every question in the course exercise bank, with its answer. Each code answer was
            executed against the real data files and its output pasted underneath.
          </p>
          <p className="pt-stats">
            {questions} questions · {sets.length} exercise sets · {codeN} code answers
            {excluded.length > 0 && (
              <>
                <br />
                excluding: {excluded.join(", ")}
              </>
            )}
            <br />
            Compiled {printed}
          </p>
        </section>

        {/* ---- contents: set -> page ---- */}
        <section className="print-page-break">
          <h1 className="print-h1">Contents</h1>
          <p className="idx-note">
            Question-by-question index at the back{haveNumbers ? "" : " (page numbers pending)"}.
          </p>
          <table className="idx-table">
            <thead>
              <tr>
                <th>Exercise set</th>
                <th className="idx-n">Questions</th>
                <th className="idx-n">Page</th>
              </tr>
            </thead>
            <tbody>
              {groupsForIndex.map((g) => (
                <>
                  <tr className="idx-grouprow" key={`g-${g.name}`}>
                    <td colSpan={3}>{g.name}</td>
                  </tr>
                  {g.sets.map((s) => (
                    <tr key={s.id}>
                      <td>{s.title}</td>
                      <td className="idx-n">{s.count}</td>
                      <td className="idx-n">{pg(map, `set:${s.id}`) ?? "—"}</td>
                    </tr>
                  ))}
                </>
              ))}
            </tbody>
          </table>
        </section>

        {/* ---- every set ---- */}
        {sets.map((set) => (
          <section key={set.id} className="print-page-break">
            <Marker id={`set--${set.id}`} />
            <h1 className="print-h1">{set.title}</h1>
            <div className="print-setmeta">
              {set.count} questions{set.topic ? ` · ${set.topic}` : ""}
              <br />
              source: {set.source}
              {set.datafile.map((d) => (
                <span key={d}>
                  <br />
                  data: {d}
                </span>
              ))}
            </div>

            {set.setupHtml && (
              <div className="setup">
                <h3>Setup assumed by every answer below</h3>
                <div dangerouslySetInnerHTML={{ __html: set.setupHtml }} />
              </div>
            )}

            {set.questions.map((q) => (
              <div className="qa" key={q.num}>
                <div className="q-row">
                  <div className="q-num">
                    {q.num}
                    <Marker id={`q--${set.id}--${q.num}`} />
                  </div>
                  <div className="q-body" dangerouslySetInnerHTML={{ __html: q.questionHtml }} />
                </div>
                <div className="a-row">
                  <div className="a-tag">ANS</div>
                  <div className="a-body" dangerouslySetInnerHTML={{ __html: q.answerHtml }} />
                </div>
              </div>
            ))}
          </section>
        ))}

        {/* ---- back index: every question -> page ---- */}
        <section className="print-page-break">
          <h1 className="print-h1">Index of questions</h1>
          <p className="idx-note">
            Every question in reading order, with the page it is answered on. Find the wording you
            recognise, then turn to that page.
          </p>

          {groupsForIndex.map((g) => (
            <div className="idx-group" key={`ix-${g.name}`}>
              <h2 className="idx-grouphead">{g.name}</h2>
              {g.sets.map((s) => (
                <div className="idx-set" key={`ix-${s.id}`}>
                  <h3 className="idx-sethead">
                    {s.title}
                    <span className="idx-setpage">p. {pg(map, `set:${s.id}`) ?? "—"}</span>
                  </h3>
                  <table className="idx-table idx-qtable">
                    <tbody>
                      {s.questions.map((q) => (
                        <tr key={`${s.id}-${q.num}`}>
                          <td className="idx-q">{q.num}</td>
                          <td className="idx-text">{q.questionText.slice(0, 150)}</td>
                          <td className="idx-n">{pg(map, `q:${s.id}:${q.num}`) ?? "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))}
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}
