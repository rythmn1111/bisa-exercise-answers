import "./globals.css";
import "highlight.js/styles/atom-one-dark.css";
import Link from "next/link";
import { getGroups, getSearchIndex } from "@/lib/qa";
import Search from "@/components/Search";
import HideToggle from "@/components/HideToggle";
import PdfButton from "@/components/PdfButton";
import SideNav from "@/components/SideNav";

export const metadata = {
  title: {
    default: "BISA Q&A — every exercise question, answered",
    template: "%s · BISA Q&A",
  },
  description:
    "Every question in the course exercise bank with its answer — code where the question wants code, words where it wants words.",
};

export default function RootLayout({ children }) {
  const groups = getGroups().map((g) => ({
    name: g.name,
    sets: g.sets.map((s) => ({ id: s.id, title: s.title, count: s.count })),
  }));
  const index = getSearchIndex();

  return (
    <html lang="en">
      <body>
        <header className="top no-print">
          <Link href="/" className="brand">
            <span className="tag">Q&amp;A</span>
            <span>Exercise Answers</span>
            <span className="sub">Python · pandas · Matplotlib</span>
          </Link>
          <div className="spacer" />
          <Search index={index} />
          <HideToggle />
          <PdfButton />
        </header>
        <div className="shell">
          <SideNav groups={groups} />
          {children}
        </div>
      </body>
    </html>
  );
}
