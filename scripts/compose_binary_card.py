"""Compose the Binary Stars card: M51 with a zoom box on a spiral arm and an
inset of the rendered contact binary (scripts/render_contact_binary.py).

Inputs (paths are relative to where it is run):
  s1img-002.jpg     M51 photo, extracted from slide 1 of M51_EBs_MPIA.pdf
  ../render/final_1800.jpg   contact-binary render at 1800 px
Usage: python3 compose_binary_card.py 0.47 0.70 out.jpg   (box x, y as frame fractions)
"""
from PIL import Image, ImageDraw
import sys
W, H = 1800, 1012
bg = Image.open('s1img-002.jpg').convert('RGB')          # 2000x1400
# 16:9 crop of the galaxy, shifted so the spiral sits right of centre
cw = bg.width; ch = int(cw * 9 / 16); top = int((bg.height - ch) * 0.45)
bg = bg.crop((0, top, cw, top + ch)).resize((W, H), Image.LANCZOS)

# small box on a spiral arm
bx, by, bs = int(W * float(sys.argv[1])), int(H * float(sys.argv[2])), int(W * 0.022)
# inset: zoom of the rendered contact binary
rb = Image.open('../render/final_1800.jpg').convert('RGB')   # 1800x1012
cx, cy = int(rb.width * 0.52), int(rb.height * 0.5)
iw, ih = int(rb.width * 0.74), int(rb.width * 0.74 * 0.6)
inset = rb.crop((cx - iw // 2, cy - ih // 2, cx + iw // 2, cy + ih // 2))
IW = int(W * 0.31); IH = int(IW * ih / iw)
inset = inset.resize((IW, IH), Image.LANCZOS)
ix, iy = int(W * 0.035), H - IH - int(H * 0.06)

d = ImageDraw.Draw(bg)
lw = max(2, W // 600)
line = (255, 255, 255)
# connector lines from the box to the inset's right-hand corners
d.line([(bx, by), (ix + IW, iy)], fill=line, width=lw)
d.line([(bx, by + bs), (ix + IW, iy + IH)], fill=line, width=lw)
d.rectangle([bx, by, bx + bs, by + bs], outline=line, width=lw)
bg.paste(inset, (ix, iy))
d.rectangle([ix, iy, ix + IW, iy + IH], outline=line, width=lw + 1)
bg.save(sys.argv[3], quality=90)
print('saved', sys.argv[3])
