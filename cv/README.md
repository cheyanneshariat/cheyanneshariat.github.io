# CV Source

This directory contains the LaTeX source for the public CV PDF linked from the website:

`files/Shariat_Cheyanne_CV.pdf`

To rebuild the PDF locally from the repository root:

```bash
bash scripts/build_cv.sh
```

That command compiles `cv/resume_faangpath.tex` and copies the generated PDF to the tracked website file. Commit the source changes and `files/Shariat_Cheyanne_CV.pdf` together when updating locally.

The GitHub Actions workflow in `.github/workflows/build-cv.yml` runs the same build when files in `cv/` change. If the generated PDF differs, the workflow commits the updated website PDF back to the branch.

If you keep editing in Overleaf, export or sync the Overleaf source and replace the files in this directory before committing.
