"use client";

import { useEffect } from "react";

/** Opens the print dialog when /print?autoprint=1 is visited. */
export default function AutoPrint() {
  useEffect(() => {
    if (!new URLSearchParams(window.location.search).has("autoprint")) return;
    const id = setTimeout(() => window.print(), 900);
    return () => clearTimeout(id);
  }, []);

  return null;
}
