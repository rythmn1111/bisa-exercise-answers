"use client";

import { useEffect, useState } from "react";

/**
 * One question and its answer. That is the whole site.
 * Respects the global "Hide answers" toggle, and can be revealed per-question.
 */
export default function QA({ q }) {
  const [globalHidden, setGlobalHidden] = useState(false);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    setGlobalHidden(document.documentElement.dataset.hideAnswers === "1");
    const onChange = (e) => {
      setGlobalHidden(e.detail);
      setRevealed(false);
    };
    window.addEventListener("qa-hide-change", onChange);
    return () => window.removeEventListener("qa-hide-change", onChange);
  }, []);

  const show = !globalHidden || revealed;

  return (
    <section className="qa" id={q.num}>
      <div className="q-row">
        <div className="q-num">{q.num}</div>
        <div className="q-body" dangerouslySetInnerHTML={{ __html: q.questionHtml }} />
      </div>

      {show ? (
        <div className="a-row">
          <div className="a-tag">{q.kind === "written" ? "ANS" : "ANS"}</div>
          <div className="a-body" dangerouslySetInnerHTML={{ __html: q.answerHtml }} />
        </div>
      ) : (
        <div
          className="hidden-answer no-print"
          role="button"
          tabIndex={0}
          onClick={() => setRevealed(true)}
          onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setRevealed(true)}
        >
          Answer hidden — click to show
        </div>
      )}
    </section>
  );
}
