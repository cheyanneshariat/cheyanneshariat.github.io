#!/usr/bin/env bash
# Update the website CV from an Overleaf source download.
#
# In Overleaf: Menu > Download > Source (gives a .zip). Then run
#   bash scripts/update_cv_from_zip.sh ~/Downloads/Shariat_Cheyanne_CV.zip
# This copies the LaTeX source into cv/, commits, and pushes. The
# "Build CV PDF" GitHub Action then compiles files/Shariat_Cheyanne_CV.pdf.
set -euo pipefail

ZIP="${1:?usage: update_cv_from_zip.sh path/to/overleaf-source.zip}"
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

unzip -q "$ZIP" -d "$TMP"
if [[ ! -f "$TMP/resume_faangpath.tex" ]]; then
  echo "resume_faangpath.tex not found in $ZIP" >&2
  exit 1
fi

# Copy everything except the README that documents this directory.
rsync -a --exclude README.md "$TMP"/ "$REPO_ROOT/cv/"

cd "$REPO_ROOT"
if git diff --quiet -- cv && [[ -z "$(git ls-files --others --exclude-standard cv)" ]]; then
  echo "CV source is unchanged."
  exit 0
fi
git add cv
git commit -m "Update CV source from Overleaf"
git push
echo "Pushed. GitHub will rebuild files/Shariat_Cheyanne_CV.pdf in a few minutes."
