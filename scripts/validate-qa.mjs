#!/usr/bin/env bun
/**
 * Structural checks for the Q&A data files.
 *
 * The important one is COVERAGE: this site's whole promise is that every
 * question in the exercise bank is present, so the expected count per set is
 * hard-coded below and a mismatch is an error, not a warning.
 *
 * Usage: bun run scripts/validate-qa.mjs [--strict]
 */
import fs from "node:fs";
import path from "node:path";
import yaml from "js-yaml";

const ROOT = path.resolve(import.meta.dir, "..");
const DATA = path.join(ROOT, "data");
const STRICT = process.argv.includes("--strict");

// Counted from the source PDFs.
const EXPECTED = {
  "pre-midterm": 10,
  "midterm-qp": 3,
  session13: 89,
  "basics-ex1": 11,
  "basics-ex2": 11,
  "basics-ex3": 10,
  "missing-ex1": 4,
  "missing-ex2": 6,
  "missing-ex3": 3,
  "sorting-ex1": 7,
  "sorting-ex2": 7,
  "sorting-ex3": 5,
  "pivot-ex1": 15,
  "pivot-ex2": 16,
  "pivot-ex3": 16,
  combine: 10,
  "freq-demo": 9,
  "freq-case1": 9,
  "freq-case2": 9,
  "freq-case3": 9,
  "mpl-ex1": 5,
  "mpl-ex2": 5,
  "mpl-ex3": 5,
  "mpl-ex4": 5,
  case1: 15,
  case2: 17,
  case3: 19,
};

const GROUPS = new Set([
  "Core Python",
  "Pandas exercises",
  "Concat merge join",
  "Frequency distribution",
  "Matplotlib",
  "Integrated exercises",
]);

let errors = 0;
let warnings = 0;
const err = (f, m) => {
  errors++;
  console.log(`  ERROR  ${f}: ${m}`);
};
const warn = (f, m) => {
  warnings++;
  console.log(`  warn   ${f}: ${m}`);
};

if (!fs.existsSync(DATA)) {
  console.log("No data/ directory.");
  process.exit(1);
}

const files = fs.readdirSync(DATA).filter((f) => f.endsWith(".md") && !f.startsWith("_")).sort();
if (!files.length) {
  console.log("No question sets in data/ yet.");
  process.exit(0);
}

const orders = new Map();
const ids = new Map();
let totalQ = 0;
let totalCode = 0;
let totalWritten = 0;

for (const file of files) {
  const raw = fs.readFileSync(path.join(DATA, file), "utf8");
  const m = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(raw.replace(/^﻿/, ""));
  if (!m) {
    err(file, "no frontmatter");
    continue;
  }

  let fm;
  try {
    fm = yaml.load(m[1]) || {};
  } catch (e) {
    err(file, `frontmatter is not valid YAML — ${e.message.split("\n")[0]}`);
    continue;
  }
  const body = m[2];
  const stem = file.replace(/\.md$/, "");

  for (const k of ["id", "title", "source", "topic", "group", "order"]) {
    if (fm[k] === undefined) err(file, `missing frontmatter "${k}"`);
  }
  if (fm.id && fm.id !== stem) err(file, `id "${fm.id}" does not match filename "${stem}"`);
  if (fm.group && !GROUPS.has(fm.group)) err(file, `unknown group "${fm.group}"`);
  if (fm.id && ids.has(fm.id)) err(file, `duplicate id (also ${ids.get(fm.id)})`);
  else if (fm.id) ids.set(fm.id, file);
  if (fm.order !== undefined) {
    if (orders.has(fm.order)) err(file, `duplicate order ${fm.order} (also ${orders.get(fm.order)})`);
    else orders.set(fm.order, file);
  }

  // ---- fences ----
  const fences = body.split("\n").filter((l) => /^\s*(```|~~~)/.test(l)).length;
  if (fences % 2 !== 0) err(file, `odd number of code fences (${fences}) — a block is unclosed`);

  // ---- question blocks ----
  const lines = body.split("\n");
  const blocks = [];
  let inFence = false;
  let cur = null;
  for (const line of lines) {
    if (/^\s*(```|~~~)/.test(line)) inFence = !inFence;
    if (!inFence) {
      const h = /^###\s+(\S+)\s*(.*)$/.exec(line);
      if (h) {
        if (cur) blocks.push(cur);
        cur = { num: h[1], lines: [] };
        continue;
      }
      if (/^##\s+/.test(line)) warn(file, `unexpected "## " heading — this site uses only "### Q<n>"`);
    }
    if (cur) cur.lines.push(line);
  }
  if (cur) blocks.push(cur);

  if (blocks.length === 0) {
    err(file, "no `### Q<n>` question blocks found");
    continue;
  }

  let codeN = 0;
  let writtenN = 0;
  for (const b of blocks) {
    const text = b.lines.join("\n");
    const hasQ = /(^|\n)\s*\*\*Q\.?\*\*/.test(text);
    const split = /(^|\n)\s*\*\*A\.?\*\*/.exec(text);
    if (!hasQ) err(file, `${b.num} has no **Q.** marker`);
    if (!split) {
      err(file, `${b.num} has no **A.** marker`);
      continue;
    }
    const answer = text.slice(split.index + split[0].length).trim();
    if (!answer) err(file, `${b.num} has an empty answer`);
    const question = text.slice(0, split.index).replace(/\*\*Q\.?\*\*/, "").trim();
    if (question.length < 12) warn(file, `${b.num} question text looks too short`);
    if (/```python/.test(answer)) codeN++;
    else writtenN++;
  }

  // ---- duplicate / missing numbering ----
  const nums = blocks.map((b) => b.num);
  const dupes = nums.filter((n, i) => nums.indexOf(n) !== i);
  if (dupes.length) err(file, `duplicate question ids: ${[...new Set(dupes)].join(", ")}`);

  const plain = nums.filter((n) => /^Q\d+$/.test(n)).map((n) => Number(n.slice(1)));
  if (plain.length === nums.length && plain.length > 1) {
    const sorted = [...plain].sort((a, b) => a - b);
    const gaps = [];
    for (let k = 1; k <= sorted[sorted.length - 1]; k++) if (!sorted.includes(k)) gaps.push(k);
    if (gaps.length) err(file, `missing question numbers: Q${gaps.join(", Q")}`);
  }

  // ---- coverage ----
  const want = EXPECTED[stem];
  if (want === undefined) {
    warn(file, `not in the expected-coverage table — add it to EXPECTED if this set is intentional`);
  } else if (blocks.length !== want) {
    err(file, `has ${blocks.length} questions, expected ${want}`);
  }

  totalQ += blocks.length;
  totalCode += codeN;
  totalWritten += writtenN;

  console.log(
    `  ok     ${file.padEnd(20)} ${String(blocks.length).padStart(3)} questions ` +
      `(${String(codeN).padStart(3)} code, ${String(writtenN).padStart(2)} written)`
  );
}

// ---- which sets are still missing ----
const present = new Set(files.map((f) => f.replace(/\.md$/, "")));
const missing = Object.keys(EXPECTED).filter((k) => !present.has(k));
if (missing.length) {
  console.log(`\n  ${missing.length} set(s) not written yet: ${missing.join(", ")}`);
}

const expectedTotal = Object.values(EXPECTED).reduce((a, b) => a + b, 0);
console.log(
  `\n${files.length}/${Object.keys(EXPECTED).length} sets · ${totalQ}/${expectedTotal} questions · ` +
    `${totalCode} code · ${totalWritten} written · ${errors} errors · ${warnings} warnings`
);
process.exit(errors > 0 || (STRICT && warnings > 0) ? 1 : 0);
