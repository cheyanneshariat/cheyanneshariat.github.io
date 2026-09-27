"""Render the Neutron Stars icon for the Code page: a pulsar with dipole
field loops and two beams. Usage: python3 scripts/render_pulsar_icon.py out.png"""
import sys
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

N = 768
y, x = np.mgrid[0:N, 0:N]
u, v = (x - N / 2) / (N / 2), (N / 2 - y) / (N / 2)          # [-1, 1], v up
tilt = np.radians(28)                                        # magnetic axis tilt from vertical
ua = u * np.cos(tilt) - v * np.sin(tilt)                     # coordinates along/across the axis
va = u * np.sin(tilt) + v * np.cos(tilt)
r = np.hypot(u, v)

img = np.zeros((N, N, 3))
img += (np.array([0.05, 0.07, 0.15]) * np.clip(1 - 0.7 * r, 0, 1)[..., None]
        + np.array([0.012, 0.016, 0.035]))                   # dark blue background

# two beams along the magnetic axis: narrow cones fading with distance
ang = np.abs(np.arctan2(np.abs(ua), np.abs(va) + 1e-9))
cone = np.exp(-(ang / np.radians(9)) ** 2) * np.clip(np.abs(va) / 0.12, 0, 1) * np.exp(-np.abs(va) * 0.9)
img += cone[..., None] * np.array([0.55, 0.75, 1.0]) * 1.1

# dipole field loops r = L sin^2(theta) in the magnetic frame
field = Image.new("L", (N, N), 0); d = ImageDraw.Draw(field)
th = np.linspace(0.02, np.pi - 0.02, 400)
for L in (0.34, 0.55, 0.8):
    for side in (1, -1):
        rr = L * np.sin(th) ** 2
        ua_ = side * rr * np.sin(th); va_ = rr * np.cos(th)
        uu = ua_ * np.cos(tilt) + va_ * np.sin(tilt); vv = -ua_ * np.sin(tilt) + va_ * np.cos(tilt)
        pts = [(N / 2 + a * N / 2, N / 2 - b * N / 2) for a, b in zip(uu, vv)]
        d.line(pts, fill=150, width=max(2, N // 190))
f = np.asarray(field.filter(ImageFilter.GaussianBlur(N / 500)), float) / 255
img += f[..., None] * np.array([0.35, 0.55, 0.85]) * 0.55

# the neutron star: small hot sphere with a glow
rs = 0.085
core = np.clip(1 - (r / rs) ** 2, 0, 1) ** 0.35
glow = np.exp(-(r / 0.16) ** 2) * 0.9 + np.exp(-(r / 0.45) ** 2) * 0.25
img += glow[..., None] * np.array([0.45, 0.62, 1.0])
img = img * (1 - core[..., None]) + core[..., None] * np.array([0.93, 0.97, 1.0])

# a few background stars
rng = np.random.default_rng(4)
for sx, sy, b in zip(rng.integers(0, N, 40), rng.integers(0, N, 40), rng.power(4, 40)):
    img[max(sy - 1, 0):sy + 2, max(sx - 1, 0):sx + 2] += 0.5 * b

img = 1 - np.exp(-1.7 * img)
im = Image.fromarray((np.clip(img, 0, 1) * 255).astype(np.uint8)).resize((128, 128), Image.LANCZOS)
mask = Image.new("L", (128, 128), 0); ImageDraw.Draw(mask).rounded_rectangle([0, 0, 127, 127], 34, fill=255)
out = Image.new("RGBA", (128, 128)); out.paste(im, (0, 0), mask); out.save(sys.argv[1])
print("saved", sys.argv[1])
