import { getSets, getGroups, getStats } from "@/lib/qa";
import AutoPrint from "@/components/AutoPrint";

export const metadata = {
  title: "All questions and answers",
  robots: { index: false },
};

/**
 * Every set on one page, in order, with print CSS applied.
 *
 * Answers are rendered unconditionally here — this route never reads the
 * "Hide answers" setting, so the PDF always contains them.
 */
export default function PrintAll() {
  const sets = getSets();
  const groups = getGroups();
  const stats = getStats();
  const printed = new Date().toISOString().slice(0, 10);

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
            {stats.questions} questions · {stats.sets} exercise sets · {stats.code} code answers ·{" "}
            {stats.written} written answers
            <br />
            Compiled {printed}
          </p>
        </section>

        {/* ---- contents ---- */}
        <section className="print-page-break">
          <h1 className="print-h1">Contents</h1>
          {groups.map((g) => (
            <div key={g.name} className="print-toc-group">
              <h3>{g.name}</h3>
              <ul>
                {g.sets.map((s) => (
                  <li key={s.id}>
                    <strong>{s.title}</strong> — {s.count} question{s.count === 1 ? "" : "s"}
                    {s.topic ? `; ${s.topic}` : ""}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>

        {/* ---- every set ---- */}
        {sets.map((set) => (
          <section key={set.id} className="print-page-break">
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
                  <div className="q-num">{q.num}</div>
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
      </div>
    </main>
  );
}
