"""M51 footprint figure (Shariat et al. 2026, Fig. 2) with a zoom box on one
eclipsing binary and its phase-folded ACS light curve as an inset.

Runs the code cells of the original notebook read-only (SAVE_FIGURES=False),
so nothing in the notebook's output directory is written or changed.
"""
import json, re, sys, importlib.util
from pathlib import Path
import matplotlib
matplotlib.use("Agg")

NB = Path("/Volumes/Crucial X9/M51_data/project_state_notebooks/m51_hst_rgb_eb_footprints_editable.ipynb")
LCMOD = Path("/Volumes/Crucial X9/M51_data/paper/M51-EBs/analysis/paper_figure_updates_2026-06-14/make_eb_selection_figures.py")
SRC = Path("/Volumes/Crucial X9/M51_data/paper/M51-EBs/analysis/data_release_2026-07-10/products/m51_source_catalog.parquet")
OUT = Path(sys.argv[1]); SID = int(sys.argv[2]) if len(sys.argv) > 2 else 104004

ns = {}
cells = json.loads(NB.read_text())["cells"]
for i in (1, 3, 6, 8, 10, 13):
    code = "".join(cells[i]["source"])
    code = "\n".join(l for l in code.splitlines() if not l.lstrip().startswith(("%", "!")))
    exec(compile(code, f"cell{i}", "exec"), ns)
    if i == 3:
        ns["SAVE_FIGURES"] = False

import numpy as np, pandas as pd, matplotlib.pyplot as plt
from astropy.coordinates import SkyCoord
import astropy.units as u
from matplotlib.patches import Rectangle, ConnectionPatch

# source position -> rotated landscape pixels (same transform as the EB markers)
cat = pd.read_parquet(SRC, columns=["m51_source_id", "ra_acs_deg", "dec_acs_deg"])
row = cat[cat.m51_source_id == SID].iloc[0]
c = SkyCoord(row.ra_acs_deg * u.deg, row.dec_acs_deg * u.deg)
x0, y0 = ns["ref_wcs"].world_to_pixel(c)
ex, ey = ns["rotate_clockwise_pixels"](np.atleast_1d(x0), np.atleast_1d(y0), ns["ref_shape"])
ex, ey = float(ex[0]), float(ey[0])
print(f"ID {SID}: RA={row.ra_acs_deg:.6f} Dec={row.dec_acs_deg:.6f} -> landscape pixel ({ex:.1f}, {ey:.1f})")

# light curve, folded exactly as in the paper's selection-examples figure
spec = importlib.util.spec_from_file_location("ebsel", LCMOD); m = importlib.util.module_from_spec(spec); spec.loader.exec_module(m)
gold = pd.read_csv(m.CURRENT_GOLD_TABLE).drop_duplicates("m51_source_id").set_index("m51_source_id")
period = float(gold.loc[SID, "period_day"])
lc = m.read_lightcurves(); lc = m.phase_fold_one(lc[lc.m51_source_id.eq(SID)].copy(), period)

fig = ns["plot_footprints"](legend=True)
ax = fig.axes[0]
xmin, xmax, ymin, ymax = ns["ACTIVE_CROP"]
half = 45                                          # box half-size, pixels (0.05"/pix -> ~4.5")
ax.add_patch(Rectangle((ex - half, ey - half), 2 * half, 2 * half, fill=False, ec="white", lw=2.2, zorder=8))

# inset in the dark region below the legend
iax = fig.add_axes([0.085, 0.53, 0.29, 0.25])
iax.set_facecolor((0, 0, 0, 0.82))
for filt, col in (("F606W", "0.85"), ("F814W", "#5aa9ff")):
    sub = lc[lc["filter"].astype(str).str.upper().eq(filt)]
    ph = sub["phase"].to_numpy(float); mg = sub["mag_plot"].to_numpy(float); er = sub["magerr_plot"].to_numpy(float)
    iax.errorbar(np.r_[ph, ph + 1], np.r_[mg, mg], yerr=np.r_[er, er], fmt="o", ms=3.6, lw=0, elinewidth=0.7,
                 color=col, ecolor=col, alpha=0.85, label=filt, rasterized=True)
vals = lc["mag_plot"].to_numpy(float); lo, hi = np.nanpercentile(vals, [2, 98]); pad = max(0.12, 0.15 * (hi - lo))
iax.set_ylim(hi + 2.6 * pad, lo - pad); iax.set_xlim(0, 2); iax.set_xticks([0, 0.5, 1, 1.5])
iax.set_xlabel("phase", color="white", fontsize=22); iax.set_ylabel("mag", color="white", fontsize=22)
iax.set_title(rf"ID {SID}; $P = {period:.2f}$ d", color="white", fontsize=22, pad=6)
iax.tick_params(colors="white", labelsize=16, direction="in", top=True, right=True)
for s in iax.spines.values(): s.set_color("white"); s.set_linewidth(1.6)
leg = iax.legend(loc="lower right", ncol=2, fontsize=15, frameon=False, handletextpad=0.1, columnspacing=0.8, markerscale=1.3, borderaxespad=0.3)
for t in leg.get_texts(): t.set_color("white")

for (xa, ya), (xb, yb) in (((1, 1), (ex - half, ey + half)), ((1, 0), (ex - half, ey - half))):
    fig.add_artist(ConnectionPatch(xyA=(xa, ya), coordsA=iax.transAxes, xyB=(xb, yb), coordsB=ax.transData,
                                   color="white", lw=1.6, alpha=0.9, zorder=9))
fig.savefig(OUT, dpi=150, pad_inches=0)
print("saved", OUT)
