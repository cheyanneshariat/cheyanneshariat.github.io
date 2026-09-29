# CV Source

LaTeX source for the public CV PDF linked from the website
(`files/Shariat_Cheyanne_CV.pdf`). The master copy lives in Overleaf; this
directory mirrors it.

**Automatic (Overleaf Git access):** add an Overleaf Git token as the
`OVERLEAF_GIT_TOKEN` repository secret. `.github/workflows/build-cv.yml` then
pulls the Overleaf project daily, rebuilds the PDF when the source changed,
and commits both.

**Manual (any Overleaf plan):** in Overleaf use Menu > Download > Source, then

```bash
bash scripts/update_cv_from_zip.sh ~/Downloads/<project>.zip
```

The push triggers the same workflow, which rebuilds the PDF.

To build locally: `bash scripts/build_cv.sh`.

## Publications list

The Publications section of the CV is written automatically, between the
`% >>> AUTO-GENERATED PUBLICATIONS` marker comments in Overleaf. Every Monday
`.github/workflows/update-publications.yml` queries SciX, regenerates that
section with `scripts/cv_publications.py`, checks that the CV compiles, and
pushes it to Overleaf. Edit everything else in the CV as usual.

To add a note to a preprint (target journal, submitted/accepted), edit
`_data/cv_publication_notes.yml` in this repository. Hand edits inside the
marked section in Overleaf are overwritten by the next run.
