#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
CV_DIR="$REPO_ROOT/cv"
PDF_OUTPUT="$REPO_ROOT/files/Shariat_Cheyanne_CV.pdf"

if [[ "$(uname -s)" == "Darwin" ]]; then
  export LC_ALL=en_US.UTF-8
  export LANG=en_US.UTF-8
fi

if ! command -v latexmk >/dev/null 2>&1; then
  echo "latexmk was not found. Install MacTeX or TeX Live before building the CV." >&2
  exit 1
fi

cd "$CV_DIR"
latexmk -pdf -interaction=nonstopmode -halt-on-error resume_faangpath.tex

mkdir -p "$(dirname "$PDF_OUTPUT")"
cp "$CV_DIR/resume_faangpath.pdf" "$PDF_OUTPUT"
echo "Updated $PDF_OUTPUT"
