#!/usr/bin/env python3
"""Rewrite the Publications section of the CV from _data/publications.json.

Usage (from the repository root):
    python3 scripts/cv_publications.py path/to/resume_faangpath.tex

Every entry uses one format:
    Authors (own name in bold), "Title", Journal abbreviation, vol. V, Art. no. P, arXiv:ID, YEAR.
Preprints use the note in _data/cv_publication_notes.yml (e.g. "PASP,
\\textit{submitted}") in place of the journal details.

The section is written between two marker comments. The first run replaces
the hand-written Publications section and adds the markers; later runs
replace only the text between them, so the rest of the CV is never touched.
Prints "changed" or "unchanged".
"""

import html
import json
import re
import sys
from pathlib import Path

REPO = Path(__file__).resolve().parents[1]
PUBS = REPO / "_data" / "publications.json"
NOTES = REPO / "_data" / "cv_publication_notes.yml"
BEGIN = "% >>> AUTO-GENERATED PUBLICATIONS: edit _data/cv_publication_notes.yml on the website repo, not this list"
END = "% <<< END AUTO-GENERATED PUBLICATIONS"


def read_notes():
    notes = {}
    for line in NOTES.read_text().splitlines():
        line = line.split(" #")[0].rstrip()
        if not line or line.lstrip().startswith("#") or ":" not in line:
            continue
        key, _, value = line.partition(":")
        notes[key.strip().strip("'\"")] = value.strip()
    return notes


def tex_escape(text):
    text = html.unescape(re.sub(r"<[^>]+>", "", text))
    text = text.replace("\\", "")
    for ch in "&%#_$":
        text = text.replace(ch, "\\" + ch)
    text = re.sub(r"[\u2500\u2013\u2012]", "--", text).replace("\u2014", "---")
    return text


def authors_tex(p):
    # non-breaking spaces keep each name (e.g. "Weisz, D.~R.") on one line
    names = [tex_escape(a).replace(", ", ",~").replace(". ", ".~") for a in p["authors"]]
    if p["self_index"] is not None:
        names[p["self_index"]] = "{\\bf Shariat,~C.}"   # one consistent form of my name
    if len(names) == 1:
        return names[0]
    if len(names) == 2:
        return f"{names[0]} and {names[1]}"
    return ", ".join(names[:-1]) + ", and " + names[-1]


def entry(p, notes):
    parts = [authors_tex(p), f"\u201c{tex_escape(p['title'])}\u201d"]
    if p["preprint"]:
        if p["arxiv"] in notes:
            parts.append(notes[p["arxiv"]])
    else:
        parts.append(tex_escape(p["journal"]))   # standard abbreviation (ApJ, PASP, A&A, ...)
        if p.get("volume"):
            parts.append(f"vol. {p['volume']}")
        if p.get("page"):
            parts.append(f"Art. no. {tex_escape(p['page'])}")
    if p.get("arxiv"):
        parts.append(f"\\href{{https://arxiv.org/abs/{p['arxiv']}}}{{arXiv:{p['arxiv']}}}")
    parts.append(str(p["year"]))
    return ", ".join(parts) + "."


def section(pubs, notes):
    n, n_first = len(pubs), sum(p["first_author"] for p in pubs)
    lines = [BEGIN,
             f"\\begin{{rSection}}{{Publications \\normalfont{{({n} total; {n_first} first-author)}}}}",
             "\\newcounter{pub}", f"\\setcounter{{pub}}{{{n}}}", "\\begin{enumerate}"]
    for i, p in enumerate(pubs):
        if i:
            lines.append("\\addtocounter{pub}{-1}")
        lines.append("\\item[\\arabic{pub}.] " + entry(p, notes))
    lines += ["\\end{enumerate}", "\\end{rSection}", END]
    return "\n".join(lines)


def main():
    tex_path = Path(sys.argv[1])
    tex = tex_path.read_text()
    new_block = section(json.loads(PUBS.read_text()), read_notes())
    if BEGIN in tex and END in tex:
        a, b = tex.index(BEGIN), tex.index(END) + len(END)
    else:
        a = tex.index("\\begin{rSection}{Publications")
        b = tex.index("\\end{rSection}", a) + len("\\end{rSection}")
    new_tex = tex[:a] + new_block + tex[b:]
    if new_tex == tex:
        print("unchanged")
        return
    tex_path.write_text(new_tex)
    print("changed")


if __name__ == "__main__":
    main()
