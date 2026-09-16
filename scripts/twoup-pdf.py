#!/usr/bin/env python3
"""
Impose a PDF 2-up: two source pages side by side on one landscape sheet,
separated by a printed divider line down the middle.

    python3 scripts/twoup-pdf.py
    python3 scripts/twoup-pdf.py --in BISA-Exercise-Answers-trimmed.pdf
    python3 scripts/twoup-pdf.py --gutter 14 --margin 10 --no-divider
    python3 scripts/twoup-pdf.py --sheet a3          # bigger paper, larger text

197 A4 portrait pages become 99 A4 landscape sheets. An odd final page is
paired with a blank half.

Requires pypdf and reportlab:
    python3 -m pip install --user pypdf reportlab
"""
import argparse
import io
import os
import sys

try:
    from pypdf import PdfReader, PdfWriter, Transformation
    from pypdf.generic import RectangleObject
except ImportError:
    sys.exit("pypdf is required:  python3 -m pip install --user pypdf")

# Landscape sheet sizes in points (1 pt = 1/72 inch).
SHEETS = {
    "a4": (841.89, 595.28),
    "a3": (1190.55, 841.89),
    "letter": (792.0, 612.0),
    "legal": (1008.0, 612.0),
}

DEFAULT_IN = "BISA-Exercise-Answers-trimmed.pdf"


def divider_overlay(width, height, margin, line_width, dash):
    """A one-page PDF containing just the centre divider, to stamp on each sheet."""
    from reportlab.pdfgen import canvas

    buf = io.BytesIO()
    c = canvas.Canvas(buf, pagesize=(width, height))
    c.setStrokeGray(0.55)
    c.setLineWidth(line_width)
    if dash:
        c.setDash(3, 3)
    x = width / 2
    c.line(x, margin, x, height - margin)
    c.showPage()
    c.save()
    buf.seek(0)
    return PdfReader(buf).pages[0]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--in", dest="src", default=DEFAULT_IN)
    ap.add_argument("--out", dest="dst", default=None)
    ap.add_argument("--sheet", default="a4", choices=sorted(SHEETS), help="output paper (landscape)")
    ap.add_argument("--margin", type=float, default=8.0, help="outer margin in pt")
    ap.add_argument("--gutter", type=float, default=10.0, help="space either side of the divider, pt")
    ap.add_argument("--line-width", type=float, default=0.6)
    ap.add_argument("--dash", action="store_true", help="dashed divider instead of solid")
    ap.add_argument("--no-divider", action="store_true")
    args = ap.parse_args()

    root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    src = args.src if os.path.isabs(args.src) else os.path.join(root, args.src)
    if not os.path.exists(src):
        sys.exit(f"not found: {src}")

    sheet_w, sheet_h = SHEETS[args.sheet]
    dst = args.dst or os.path.join(root, os.path.basename(src).replace(".pdf", "-2up.pdf"))
    if not os.path.isabs(dst):
        dst = os.path.join(root, dst)

    reader = PdfReader(src)
    total = len(reader.pages)

    # Each source page gets half the sheet, minus the outer margin and gutter.
    slot_w = sheet_w / 2 - args.margin - args.gutter / 2
    slot_h = sheet_h - 2 * args.margin

    writer = PdfWriter()
    overlay = None
    if not args.no_divider:
        overlay = divider_overlay(sheet_w, sheet_h, args.margin, args.line_width, args.dash)

    scales = []
    for i in range(0, total, 2):
        sheet = writer.add_blank_page(width=sheet_w, height=sheet_h)

        for half, idx in enumerate((i, i + 1)):
            if idx >= total:
                break
            page = reader.pages[idx]
            pw = float(page.mediabox.width)
            ph = float(page.mediabox.height)

            scale = min(slot_w / pw, slot_h / ph)
            scales.append(scale)

            # Centre the scaled page inside its half of the sheet.
            slot_x = args.margin if half == 0 else sheet_w / 2 + args.gutter / 2
            tx = slot_x + (slot_w - pw * scale) / 2
            ty = args.margin + (slot_h - ph * scale) / 2

            op = Transformation().scale(scale).translate(tx, ty)
            sheet.merge_transformed_page(page, op)

        if overlay is not None:
            sheet.merge_page(overlay)

        sheet.mediabox = RectangleObject((0, 0, sheet_w, sheet_h))

    writer.compress_identical_objects()
    with open(dst, "wb") as fh:
        writer.write(fh)

    s = scales[0] if scales else 1.0
    print(f"{os.path.basename(src)}: {total} pages")
    print(f"wrote {dst}")
    print(
        f"  {len(writer.pages)} sheets, {args.sheet.upper()} landscape "
        f"({sheet_w / 72 * 25.4:.0f} x {sheet_h / 72 * 25.4:.0f} mm), "
        f"{os.path.getsize(dst) / 1048576:.1f} MB"
    )
    print(f"  each page scaled to {s * 100:.1f}%  —  8 pt source text prints at ~{8 * s:.1f} pt")
    if total % 2:
        print("  final sheet has one page; the right half is blank")


if __name__ == "__main__":
    main()
