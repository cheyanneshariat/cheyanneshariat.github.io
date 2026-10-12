#!/usr/bin/env python3
"""Insert the lines in _data/cv_additions.yml into the CV (idempotent).

Usage: python3 scripts/cv_additions.py path/to/resume_faangpath.tex
For `after` lines that are followed by a \\vspace line (section openers), the
new line goes after the \\vspace. Prints "changed" or "unchanged".
"""
import sys
from pathlib import Path

REPO = Path(__file__).resolve().parents[1]


def read_entries():
    entries, cur = [], None
    for raw in (REPO / "_data" / "cv_additions.yml").read_text().splitlines():
        s = raw.strip()
        if not s or s.startswith("#"):
            continue
        if s.startswith("- "):
            cur = {}; entries.append(cur); s = s[2:]
        key, _, val = s.partition(":")
        val = val.strip()
        if len(val) >= 2 and val[0] == val[-1] == "'":
            val = val[1:-1].replace("''", "'")
        cur[key.strip()] = val
    return entries


def main():
    path = Path(sys.argv[1]); lines = path.read_text().split("\n"); changed = False
    for e in read_entries():
        if any(e["text"].strip() == l.strip() for l in lines):
            continue
        idx = next((i for i, l in enumerate(lines) if e["after"] in l), None)
        if idx is None:
            sys.exit(f"anchor not found: {e['after']}")
        if idx + 1 < len(lines) and lines[idx + 1].strip().startswith("\\vspace"):
            idx += 1
        lines.insert(idx + 1, e["text"]); changed = True
        print(f"  inserted: {e['text']}", file=sys.stderr)
    if changed:
        path.write_text("\n".join(lines))
    print("changed" if changed else "unchanged")


if __name__ == "__main__":
    main()
