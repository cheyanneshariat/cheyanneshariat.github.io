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
