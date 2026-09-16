#!/usr/bin/env python3
"""
Drop a page range from a generated PDF.

    python3 scripts/trim-pdf.py --drop 32-72
    python3 scripts/trim-pdf.py --drop 32-73,101 --in x.pdf --out y.pdf

Note: this is a post-processing cut, so the printed page footers
("Page 73 of 238") still reflect the original pagination. If you want the
numbering to come out right, exclude the content at render time instead:

    bun run pdf --exclude session13

Requires pypdf (pip install --user pypdf). Unlike pdfunite, pypdf keeps the
shared font and resource objects, so the file does not balloon.
"""
import argparse
import os
import sys

try:
    from pypdf import PdfReader, PdfWriter
except ImportError:
    sys.exit("pypdf is required:  python3 -m pip install --user pypdf")

DEFAULT = "BISA-Exercise-Answers.pdf"


def parse_ranges(spec):
    """'32-72,101' -> a set of 1-based page numbers."""
    pages = set()
    for part in spec.split(","):
        part = part.strip()
        if not part:
            continue
        if "-" in part:
            a, b = part.split("-", 1)
            lo, hi = int(a), int(b)
            if lo > hi:
                lo, hi = hi, lo
            pages.update(range(lo, hi + 1))
        else:
            pages.add(int(part))
    return pages


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--drop", required=True, help="pages to remove, e.g. 32-72 or 32-73,101")
    ap.add_argument("--in", dest="src", default=DEFAULT)
    ap.add_argument("--out", dest="dst", default=None)
    args = ap.parse_args()

    root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    src = args.src if os.path.isabs(args.src) else os.path.join(root, args.src)
    if not os.path.exists(src):
        sys.exit(f"not found: {src}\nGenerate it first with `bun run pdf`.")

    drop = parse_ranges(args.drop)
    reader = PdfReader(src)
    total = len(reader.pages)

    out_of_range = sorted(p for p in drop if p < 1 or p > total)
    if out_of_range:
        sys.exit(f"{src} has {total} pages; cannot drop {out_of_range}")

    dst = args.dst or os.path.join(
        root, os.path.basename(src).replace(".pdf", f"-minus-{args.drop.replace(',', '_')}.pdf")
    )
    if not os.path.isabs(dst):
        dst = os.path.join(root, dst)

    writer = PdfWriter()
    for i, page in enumerate(reader.pages, start=1):
        if i not in drop:
            writer.add_page(page)

    # Keep the file small: pypdf reuses the shared resources rather than
    # re-embedding fonts per page the way pdfunite does.
    writer.compress_identical_objects()
    with open(dst, "wb") as fh:
        writer.write(fh)

    kept = total - len(drop)
    print(f"{os.path.basename(src)}: {total} pages")
    print(f"dropped {len(drop)} ({args.drop})")
    print(f"wrote {dst}  —  {kept} pages, {os.path.getsize(dst) / 1048576:.1f} MB")


if __name__ == "__main__":
    main()
