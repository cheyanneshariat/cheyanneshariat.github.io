#!/usr/bin/env python3
"""Refresh _data/publications.json from SciX (formerly NASA ADS).

Usage (from the repository root):
    ADS_API_TOKEN=... python3 scripts/update_publications.py
or keep the token in ~/.ads/dev_key and run without the variable.

The query, name variants, and manual exclusions live in
_data/publications_config.yml so they can be edited without touching code.
Only the Python standard library is used.
"""

import json
import os
import re
import sys
import time
import unicodedata
import urllib.parse
import urllib.error
import urllib.request
from pathlib import Path

REPO = Path(__file__).resolve().parents[1]
CONFIG = REPO / "_data" / "publications_config.yml"
OUTPUT = REPO / "_data" / "publications.json"
# SciX and ADS share one backend and one API token; ADS is the fallback.
API_URLS = [
    "https://api.scixplorer.org/v1/search/query",
    "https://api.adsabs.harvard.edu/v1/search/query",
]
FIELDS = [
    "bibcode", "title", "author", "author_count", "year", "pubdate",
    "pub", "bibstem", "volume", "page", "doi", "identifier", "doctype",
    "property",
]


def read_simple_yaml(path):
    """Read the small config file (scalars and lists of scalars only)."""
    data, key = {}, None
    for raw in path.read_text().splitlines():
        line = raw.split(" #")[0].rstrip()
        if not line.strip() or line.lstrip().startswith("#"):
            continue
        if line.startswith((" ", "-")) and line.lstrip().startswith("- "):
            data[key].append(line.lstrip()[2:].strip().strip("'\""))
        else:
            key, _, value = line.partition(":")
            key, value = key.strip(), value.strip().strip("'\"")
            data[key] = value if value else []
    return data


def get_token():
    token = os.environ.get("ADS_API_TOKEN", "").strip()
    keyfile = Path.home() / ".ads" / "dev_key"
    if not token and keyfile.exists():
        token = keyfile.read_text().strip()
    if not token:
        sys.exit("No ADS token: set ADS_API_TOKEN or create ~/.ads/dev_key")
    return token


def query(q, token, waits=(0, 30, 90, 240)):
    """Search SciX (ADS as fallback). Rate limits (429) and server errors (5xx)
    are retried after the waits above, in seconds; a rejected token stops."""
    params = urllib.parse.urlencode({
        "q": q, "fl": ",".join(FIELDS), "rows": 500,
        "sort": "date desc, bibcode desc",
    })
    last = None
    for wait in waits:
        if wait:
            print(f"  waiting {wait} s before retrying ({last})")
            time.sleep(wait)
        for url in API_URLS:
            req = urllib.request.Request(
                f"{url}?{params}", headers={"Authorization": f"Bearer {token}"})
            try:
                with urllib.request.urlopen(req, timeout=60) as resp:
                    return json.load(resp)["response"]["docs"]
            except urllib.error.HTTPError as err:
                if err.code in (401, 403):
                    sys.exit(f"{url} rejected the API token (HTTP {err.code})")
                last = f"{url}: HTTP {err.code}"
            except urllib.error.URLError as err:
                last = f"{url}: {err.reason}"
            print(f"  {last}")
    sys.exit(f"SciX and ADS unavailable after retries ({last})")


def initials(name):
    """'Shariat, Cheyanne' -> 'Shariat, C.'; 'Weisz, Daniel R.' -> 'Weisz, D. R.'"""
    last, _, first = name.partition(",")
    parts = [p for p in re.split(r"[\s.]+", first.strip()) if p]
    inits = " ".join(
        "-".join(s[0] + "." for s in p.split("-") if s) for p in parts)
    return f"{last.strip()}, {inits}".strip().rstrip(",")


def arxiv_id(doc):
    for ident in doc.get("identifier", []):
        m = re.match(r"arXiv:(\S+)", ident)
        if m:
            return m.group(1)
    return None


def publisher_doi(doc):
    for doi in doc.get("doi", []):
        if not doi.startswith("10.48550/"):
            return doi
    return None


def title_overlap(t1, t2):
    """Fraction of shared words between two titles (Jaccard, accents removed)."""
    norm = lambda t: set(re.findall(r"[a-z0-9]+", unicodedata.normalize("NFKD", t).encode("ascii", "ignore").decode().lower()))
    w1, w2 = norm(t1), norm(t2)
    return len(w1 & w2) / max(1, len(w1 | w2))


def is_self(author, variants):
    return any(author.lower().startswith(v.lower()) for v in variants)


def build(docs, cfg):
    variants = cfg["name_variants"]
    keep_types = set(cfg["doctypes"])
    exclude = set(cfg.get("exclude_bibcodes", []))
    docs = [d for d in docs
            if d["doctype"] in keep_types and d["bibcode"] not in exclude]

    # SciX/ADS usually merges a preprint into its published record. When it has
    # not, drop the preprint only if a published article (a) has no arXiv ID of
    # its own, (b) shares year, first author and author count, and (c) has a
    # clearly similar title; then borrow the preprint's arXiv ID.
    articles = [d for d in docs if d["doctype"] != "eprint"]
    kept = []
    for d in docs:
        if d["doctype"] == "eprint":
            twin = next((a for a in articles
                         if not arxiv_id(a) and not a.get("_arxiv")
                         and a["year"] == d["year"]
                         and a["author"][0] == d["author"][0]
                         and a.get("author_count") == d.get("author_count")
                         and title_overlap(a["title"][0], d["title"][0]) >= 0.4),
                        None)
            if twin:
                twin["_arxiv"] = arxiv_id(d)
                print(f"  merged preprint {d['bibcode']} into {twin['bibcode']}")
                continue
        kept.append(d)

    pubs = []
    for d in kept:
        authors = d.get("author", [])
        self_idx = next((i for i, a in enumerate(authors)
                         if is_self(a, variants)), None)
        pubs.append({
            "bibcode": d["bibcode"],
            "title": d["title"][0],
            "authors": [initials(a) for a in authors],
            "author_count": d.get("author_count", len(authors)),
            "self_index": self_idx,
            "first_author": self_idx == 0,
            "year": d["year"],
            "journal": "arXiv" if d["doctype"] == "eprint"
                       else (d.get("bibstem") or [d.get("pub", "")])[0],
            "volume": d.get("volume"),
            "page": (d.get("page") or [None])[0],
            "preprint": d["doctype"] == "eprint",
            "refereed": "REFEREED" in d.get("property", []),
            "scix": f"https://scixplorer.org/abs/{d['bibcode']}/abstract",
            "arxiv": arxiv_id(d) or d.get("_arxiv"),
            "doi": publisher_doi(d),
        })
    return pubs


def keep_listed(pubs, cfg):
    """Never silently drop a paper that is already listed. SciX's author search
    can lag a few days behind a record (a paper that is on SciX may not appear
    in the search yet), so a previously listed paper that is missing from this
    result is kept, unless it is in exclude_bibcodes in the config."""
    if not OUTPUT.exists():
        return pubs
    exclude = set(cfg.get("exclude_bibcodes", []))
    have_b = {p["bibcode"] for p in pubs}
    have_a = {p["arxiv"] for p in pubs if p.get("arxiv")}
    for i, old in enumerate(json.loads(OUTPUT.read_text())):
        if old["bibcode"] in have_b or old["bibcode"] in exclude:
            continue
        if old.get("arxiv") and old["arxiv"] in have_a:
            continue   # now listed under its published record
        print(f"  kept {old['bibcode']} ({old['title'][:50]}): not returned by "
              "the SciX search yet")
        pubs.insert(min(i, len(pubs)), old)
    return pubs


def main():
    cfg = read_simple_yaml(CONFIG)
    docs = query(cfg["query"], get_token())
    print(f"SciX returned {len(docs)} records")
    pubs = build(docs, cfg)
    pubs = keep_listed(pubs, cfg)
    n_first = sum(p["first_author"] for p in pubs)
    OUTPUT.write_text(json.dumps(pubs, indent=2, ensure_ascii=False) + "\n")
    print(f"Wrote {len(pubs)} publications ({n_first} first-author) to "
          f"{OUTPUT.relative_to(REPO)}")


if __name__ == "__main__":
    main()
