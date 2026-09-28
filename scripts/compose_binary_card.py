"""Compose the Binary Stars card: the full HST image of M51 from Figure 2 of
Shariat et al. (2026), padded to 16:9, with a zoom box on a star-forming knot
in a spiral arm and an inset of the rendered contact binary
(scripts/render_contact_binary.py).

Inputs (paths relative to where it is run):
  m51_fig2_raw.png          image embedded in figure2_hst_footprint_with_scale_bar.pdf
                            (extract with: pdfimages -png <pdf> m51_fig2_raw)
  ../render/final_1800.jpg  contact-binary render at 1800 px
Usage: python3 compose_binary_card.py out.jpg
"""
from PIL import Image, ImageDraw
import numpy as np
from scipy.ndimage import uniform_filter
import sys

W, H = 1800, 1012
gal = Image.open('m51_fig2_raw.png').convert('RGB')            # full image, 1450x1022
gw = int(gal.width * H / gal.height)
gal = gal.resize((gw, H), Image.LANCZOS)
canvas = Image.new('RGB', (W, H), (4, 4, 8))
gx = W - gw                                                    # galaxy flush right
# fade the mosaic's hard edges into the background
g = np.asarray(gal, float)
xr = np.clip(np.minimum((np.arange(gw) - 20) / 260, (gw - 30 - np.arange(gw)) / 90), 0, 1); yr = np.clip(np.minimum(np.arange(H) - 10, H - 10 - np.arange(H)) / 70, 0, 1)
mask = (np.minimum(xr[None, :], yr[:, None]) ** 1.5)[..., None]
bgc = np.array([4, 4, 8.0])
canvas.paste(Image.fromarray((g * mask + bgc * (1 - mask)).astype(np.uint8)), (gx, 0))

# zoom box: brightest star-forming (red-excess) knot on the outer arm,
# searched in a window left of the bulge and clear of the inset
a = np.asarray(canvas, float); pink = uniform_filter(a[..., 0] - a[..., 1], 25)
wx0, wx1, wy0, wy1 = gx + int(gw * 0.40), gx + int(gw * 0.47), int(H * 0.58), int(H * 0.76)
sub = pink[wy0:wy1, wx0:wx1]; y, x = np.unravel_index(np.argmax(sub), sub.shape)
kx, ky = wx0 + x, wy0 + y
bs = int(W * 0.022); bx, by = kx - bs // 2, ky - bs // 2
print('knot at', kx, ky)

# inset: zoom of the rendered contact binary, in the dark margin at upper left
rb = Image.open('../render/final_1800.jpg').convert('RGB')
cx, cy = int(rb.width * 0.52), int(rb.height * 0.5)
iw, ih = int(rb.width * 0.74), int(rb.width * 0.74 * 0.6)
inset = rb.crop((cx - iw // 2, cy - ih // 2, cx + iw // 2, cy + ih // 2))
IW = int(W * 0.31); IH = int(IW * ih / iw)
inset = inset.resize((IW, IH), Image.LANCZOS)
ix, iy = int(W * 0.035), int(H * 0.06)

d = ImageDraw.Draw(canvas); lw = max(2, W // 600); line = (255, 255, 255)
d.line([(bx, by), (ix + IW, iy)], fill=line, width=lw)
d.line([(bx, by + bs), (ix + IW, iy + IH)], fill=line, width=lw)
d.rectangle([bx, by, bx + bs, by + bs], outline=line, width=lw)
canvas.paste(inset, (ix, iy))
d.rectangle([ix, iy, ix + IW, iy + IH], outline=line, width=lw + 1)
canvas.save(sys.argv[1], quality=90)
print('saved', sys.argv[1])
