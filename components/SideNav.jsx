"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SideNav({ groups }) {
  const pathname = usePathname();

  return (
    <nav className="side no-print" aria-label="Question sets">
      <Link href="/" className={pathname === "/" ? "active" : ""}>
        <span>All sets</span>
      </Link>
      <Link href="/print" className={pathname === "/print" ? "active" : ""}>
        <span>Everything on one page</span>
      </Link>
      {groups.map((g) => (
        <div key={g.name}>
          <div className="side-group">{g.name}</div>
          {g.sets.map((s) => {
            const href = `/s/${s.id}`;
            return (
              <Link key={s.id} href={href} className={pathname === href ? "active" : ""}>
                <span>{s.title.replace(/^[^—]*—\s*/, "")}</span>
                <span className="n">{s.count}</span>
              </Link>
            );
          })}
        </div>
      ))}
    </nav>
  );
}
