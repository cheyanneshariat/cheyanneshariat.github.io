# NS Populations UI

Static interactive version of the demographics paper NS-population figure.
It has no build step and can be copied directly into a GitHub Pages site.

Local preview:

```bash
cd /Users/bijan1339/Desktop/Caltech/neutron_stars/papers/gaia_ns_demographics/interactive/ns-population-context-ui
python3 -m http.server 8765
```

Then open `http://127.0.0.1:8765`.

The default rows mirror the paper table: two quantities are treated as inputs for each population and the third is derived from `N = R tau`. The plot draws one range segment for each input quantity, with the point marking the mid value. Population labels and lifetime labels can be dragged directly on the figure before exporting SVG, PNG, or PDF files.
