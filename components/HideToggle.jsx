"use client";

import { useEffect, useState } from "react";

/**
 * Self-test mode: collapses every answer so the page is just the questions.
 * Individual answers can still be opened by clicking their placeholder.
 * The choice persists across navigation.
 */
export default function HideToggle() {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    setHidden(localStorage.getItem("qa-hide") === "1");
  }, []);

  useEffect(() => {
    document.documentElement.dataset.hideAnswers = hidden ? "1" : "0";
    localStorage.setItem("qa-hide", hidden ? "1" : "0");
    window.dispatchEvent(new CustomEvent("qa-hide-change", { detail: hidden }));
  }, [hidden]);

  return (
    <button
      className={`btn${hidden ? " on" : ""}`}
      onClick={() => setHidden((h) => !h)}
      title="Hide every answer and use the page as a self-test"
    >
      {hidden ? "Answers hidden" : "Hide answers"}
    </button>
  );
}
