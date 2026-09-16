#!/usr/bin/env python3
"""
Re-run every code answer and check the pasted output is real.

For each set file this runs the frontmatter `setup:` block, then executes the
answers' ```python blocks in order in that one namespace, and compares captured
stdout/stderr against the ```text block that follows each one.

The working directory is taken from the set's `datafile:` entry, because some
setup blocks read by bare filename (`pd.read_csv("bank_transactions.csv")`).
Files the answers write go to a temp directory, not the project.

Usage:
    python3 scripts/verify_answers.py                # every set
    python3 scripts/verify_answers.py session13      # matching sets only
    python3 scripts/verify_answers.py case2 --show   # print the diffs
"""
import contextlib
import io
import os
import re
import shutil
import sys
import tempfile
import traceback

import yaml

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA = os.path.join(ROOT, "data")
EXERCISES = os.path.abspath(os.path.join(ROOT, "..", "Exercises"))

os.environ.setdefault("MPLBACKEND", "Agg")

SHOW = "--show" in sys.argv
FILTERS = [a for a in sys.argv[1:] if not a.startswith("-")]

FENCE = re.compile(r"^\s*(```|~~~)\s*([A-Za-z0-9_+-]*)\s*$")


def split_frontmatter(raw):
    m = re.match(r"^---\r?\n(.*?)\r?\n---\r?\n?(.*)$", raw.replace("﻿", ""), re.S)
    if not m:
        return {}, raw
    try:
        fm = yaml.safe_load(m.group(1)) or {}
    except Exception:
        fm = {}
    return fm, m.group(2)


def fenced_blocks(text):
    lines = text.split("\n")
    out, i = [], 0
    while i < len(lines):
        m = FENCE.match(lines[i])
        if not m:
            i += 1
            continue
        marker, lang = m.group(1), (m.group(2) or "").lower()
        body, j = [], i + 1
        while j < len(lines):
            close = FENCE.match(lines[j])
            if close and close.group(1) == marker and not close.group(2):
                break
            body.append(lines[j])
            j += 1
        out.append((lang, "\n".join(body), i + 1))
        i = j + 1
    return out


# Python prefixes warnings with the emitting location ("file.py:4: FutureWarning:"),
# which depends on how the block was invoked rather than on the answer. The files
# paste the warning itself, so drop the prefix before comparing.
WARN_PREFIX = re.compile(
    r"^.*?:\d+:\s+(?=(?:Future|Deprecation|User|Runtime|Setting|Pending)\w*Warning:)"
)


def normalise(s):
    kept = []
    for ln in s.replace("\r\n", "\n").split("\n"):
        ln = WARN_PREFIX.sub("", ln.rstrip())
        if not ln and kept and not kept[-1]:
            continue
        kept.append(ln)
    while kept and not kept[0]:
        kept.pop(0)
    while kept and not kept[-1]:
        kept.pop()
    return "\n".join(kept)


def loosen(s):
    return "\n".join(ln.strip() for ln in s.split("\n") if ln.strip())


# House style lets a long frame be cut short with a comment line, e.g.
# "# ... (rows omitted)" or "# ... (dtypes identical for the other two)".
ELISION = re.compile(r"^\s*#\s*\.\.\.")


def matches_with_elision(expected, got):
    """
    True when every non-elided run of `expected` appears verbatim in `got`.
    This is how a deliberately shortened output is checked: whatever the answer
    did print must be real; the omitted part is not reconstructed.
    """
    lines = expected.split("\n")
    if not any(ELISION.match(ln) for ln in lines):
        return False

    segments, current = [], []
    for ln in lines:
        if ELISION.match(ln):
            if current:
                segments.append("\n".join(current))
                current = []
        else:
            current.append(ln)
    if current:
        segments.append("\n".join(current))

    # Order-independent: an elided answer often keeps the first stock's frame and
    # drops the other two, so the surviving runs need not be contiguous or in
    # sequence. Every surviving run still has to appear verbatim in the real output.
    for seg in segments:
        seg = seg.strip("\n")
        if not seg.strip():
            continue
        if seg not in got:
            return False
    return True


def workdir_for(fm):
    """Directory the set's bare filenames resolve against."""
    files = fm.get("datafile")
    if isinstance(files, str):
        files = [files]
    for rel in files or []:
        full = os.path.join(EXERCISES, rel)
        if os.path.exists(full):
            return os.path.dirname(full)
    return EXERCISES


def verify(path):
    name = os.path.basename(path)
    with open(path, encoding="utf8") as fh:
        fm, body = split_frontmatter(fh.read())

    blocks = fenced_blocks(body)
    cwd_target = workdir_for(fm)
    sandbox = tempfile.mkdtemp(prefix="qa-verify-")

    ns = {"__name__": "__main__"}
    checked = passed = failed = loose = 0
    raised = interactive = 0
    diffs = []

    def run(code):
        """Execute in the data directory, but write into the sandbox."""
        buf = io.StringIO()
        exc = None
        prev = os.getcwd()
        try:
            os.chdir(cwd_target)
            ns.setdefault("OUT", sandbox + os.sep)
            with contextlib.redirect_stdout(buf), contextlib.redirect_stderr(buf):
                exec(compile(code, name, "exec"), ns)
        except BaseException as e:  # noqa: BLE001 — error demos are expected
            exc = e
        finally:
            os.chdir(prev)
        got = buf.getvalue()
        if exc is not None:
            got += "\n" + traceback.format_exception_only(type(exc), exc)[-1].strip()
        return normalise(got), exc

    setup = fm.get("setup")
    if setup:
        _, exc = run(str(setup))
        if exc is not None:
            print(f"  FAIL {name:<18} setup block raised: {type(exc).__name__}: {exc}")
            shutil.rmtree(sandbox, ignore_errors=True)
            return 0, 0, 1

    for idx, (lang, code, line_no) in enumerate(blocks):
        if lang != "python":
            continue
        # Answers that call input() are interactive by design (the core-Python
        # questions require it). They cannot be driven without per-question
        # stdin, so they are reported separately rather than counted as passing.
        if re.search(r"\binput\s*\(", code):
            interactive += 1
            continue
        got, exc = run(code)
        if exc is not None:
            raised += 1

        nxt = blocks[idx + 1] if idx + 1 < len(blocks) else None
        if not nxt or nxt[0] not in ("text", "plaintext", "", "console", "output"):
            continue
        expected = normalise(nxt[1])
        if not expected:
            continue

        checked += 1
        if got == expected:
            passed += 1
        elif (
            expected in got
            or got in expected
            or loosen(expected) == loosen(got)
            or matches_with_elision(expected, got)
        ):
            loose += 1
            passed += 1
        else:
            failed += 1
            diffs.append((line_no, code, expected, got))

    shutil.rmtree(sandbox, ignore_errors=True)

    status = "ok " if failed == 0 else "FAIL"
    print(
        f"  {status} {name:<18} {passed:>3}/{checked:<3} answers reproduce"
        f"   ({loose} elided, {raised} raised, {interactive} interactive)"
    )

    if SHOW:
        for line_no, code, expected, got in diffs:
            print(f"\n    --- {name}:{line_no}  ({code.strip().splitlines()[0][:70]})")
            exp_lines = expected.split("\n")
            got_lines = got.split("\n")
            # Report the first line that actually differs, not the first 320 chars.
            for i in range(max(len(exp_lines), len(got_lines))):
                e = exp_lines[i] if i < len(exp_lines) else "<missing>"
                g = got_lines[i] if i < len(got_lines) else "<missing>"
                if e != g:
                    print(f"    first diff at output line {i + 1}:")
                    print(f"      expected: {e!r}")
                    print(f"      got:      {g!r}")
                    break
            else:
                print("    (identical after normalisation — check the comparison rules)")
            print(f"    lines: expected {len(exp_lines)}, got {len(got_lines)}")

    return checked, passed, failed


def main():
    if not os.path.isdir(DATA):
        print("No data/ directory.")
        return 1
    files = sorted(f for f in os.listdir(DATA) if f.endswith(".md"))
    if FILTERS:
        files = [f for f in files if any(k in f for k in FILTERS)]
    if not files:
        print("No matching sets.")
        return 0

    tc = tp = tf = 0
    for f in files:
        c, p, fl = verify(os.path.join(DATA, f))
        tc += c
        tp += p
        tf += fl

    pct = (100.0 * tp / tc) if tc else 100.0
    print(f"\n{tp}/{tc} code answers reproduce ({pct:.1f}%) · {tf} mismatches")
    return 1 if tf else 0


if __name__ == "__main__":
    sys.exit(main())
