"""Render a contact binary from the Roche potential (orthographic ray march).
Usage: python3 scripts/render_contact_binary.py out.jpg 1800
(the home-page card is this render at 1800 px, resized to 900 px)

Units: separation a = 1, total mass = 1, corotating frame, center of mass at
the origin. Surface = equipotential Phi = Phi0 with a chosen fill-out between
the L1 and L2 potentials. Shading = linear limb darkening x gravity darkening
(T ~ g^beta); color from a blackbody-like temperature map.
"""
import numpy as np
from PIL import Image, ImageFilter
import sys

q = 0.5                      # M2/M1
fill = 0.35                  # fill-out factor between L1 (0) and L2 (1)
incl = np.radians(72)        # inclination
phase = 0.2                 # orbital phase (0.25 = quadrature)
W, H = int(sys.argv[2]) if len(sys.argv) > 2 else 1600, 0
H = int(W * 9 / 16)
out = sys.argv[1]

mu2 = q / (1 + q); mu1 = 1 - mu2
x1, x2 = -mu2, mu1           # star positions on the x axis

R_MAX = 1.25   # only look for the surface near the binary

def inside_env(x, y, z):
    return (phi(x, y, z) < phi0) & (x**2 + y**2 + z**2 < R_MAX**2)

def phi(x, y, z):
    r1 = np.sqrt((x - x1)**2 + y**2 + z**2) + 1e-9
    r2 = np.sqrt((x - x2)**2 + y**2 + z**2) + 1e-9
    return -mu1 / r1 - mu2 / r2 - 0.5 * (x**2 + y**2)

def grad(x, y, z, h=1e-4):
    return np.stack([(phi(x+h,y,z)-phi(x-h,y,z)), (phi(x,y+h,z)-phi(x,y-h,z)), (phi(x,y,z+h)-phi(x,y,z-h))], -1) / (2*h)

# Lagrange points on the x axis: roots of dphi/dx by bisection
def dphidx(x, h=1e-7):
    return (phi(x + h, 0.0, 0.0) - phi(x - h, 0.0, 0.0)) / (2 * h)
def root(a, b):
    fa = dphidx(a)
    for _ in range(200):
        m = 0.5 * (a + b); fm = dphidx(m)
        if np.sign(fm) == np.sign(fa): a, fa = m, fm
        else: b = m
    return 0.5 * (a + b)
L1 = root(x1 + 1e-3, x2 - 1e-3)
L2 = root(x2 + 1e-3, 2.0)
phi_L1, phi_L2 = phi(L1, 0, 0), phi(L2, 0, 0)
phi0 = phi_L1 + fill * (phi_L2 - phi_L1)
print(f"L1={L1:.3f} phi_L1={phi_L1:.4f} L2={L2:.3f} phi_L2={phi_L2:.4f} phi0={phi0:.4f}")

# camera: looking along direction d toward the origin
th = 2 * np.pi * phase
d = np.array([np.sin(incl) * np.cos(th), np.sin(incl) * np.sin(th), np.cos(incl)])
d = -d / np.linalg.norm(d)                     # ray direction (toward the system)
up0 = np.array([0, 0, 1.0]); right = np.cross(d, up0); right /= np.linalg.norm(right); up = np.cross(right, d)
scale = 3.2 / W                                # world units per pixel (frame ~3.2 wide)
cx, cy = 0.52, 0.5                            # system centre in the frame (fraction)
u = (np.arange(W) - cx * W) * scale; v = (cy * H - np.arange(H)) * scale
U, V = np.meshgrid(u, v)
origin = (U[..., None] * right + V[..., None] * up) - 3.0 * d   # start rays in front
tmax, nstep = 6.0, 700
hit_t = np.full(U.shape, np.nan)
prev_out = np.ones(U.shape, bool)
for k, t in enumerate(np.linspace(0, tmax, nstep)):
    p = origin + t * d
    inside = inside_env(p[..., 0], p[..., 1], p[..., 2])
    newhit = inside & np.isnan(hit_t)
    hit_t[newhit] = t
hit = ~np.isnan(hit_t)
# bisection refinement
lo = np.where(hit, hit_t - tmax / nstep, 0); hi = np.where(hit, hit_t, 0)
for _ in range(30):
    mid = 0.5 * (lo + hi); p = origin + mid[..., None] * d
    ins = inside_env(p[..., 0], p[..., 1], p[..., 2])
    hi = np.where(ins, mid, hi); lo = np.where(ins, lo, mid)
P = origin + hi[..., None] * d
G = grad(P[..., 0], P[..., 1], P[..., 2])
g = np.linalg.norm(G, axis=-1); n = G / (g[..., None] + 1e-12)       # outward normal (phi increases outward)
mu = np.clip(-(n @ d), 0, 1)
gmax = np.nanmax(np.where(hit, g, np.nan))
T = 1.0 * (g / gmax) ** 0.25                                          # radiative envelope, beta = 0.25
limb = 1 - 0.72 * (1 - mu) - 0.1 * (1 - mu)**2       # quadratic limb darkening
# granulation: smooth random texture fixed to the surface (function of P)
rng0 = np.random.default_rng(3)
def texture(nw, k, seed):
    r = np.random.default_rng(seed); kv = r.normal(size=(nw, 3)) * k; ph = r.uniform(0, 2*np.pi, nw)
    return sum(np.sin(P @ kv[i] + ph[i]) for i in range(nw)) / np.sqrt(nw)
gran = 1 + 0.045 * texture(40, 30.0, 3) + 0.03 * texture(20, 10.0, 5)
E = np.where(hit, limb * T**4 * gran, 0)       # emitted intensity
E = E / np.nanmax(E)

# emission colour ramp: deep blue at the dim limb -> blue -> white-hot core
stops = np.array([0.0, 0.35, 0.7, 1.0])
cols = np.array([[0.10, 0.18, 0.55], [0.30, 0.52, 1.00], [0.70, 0.85, 1.00], [1.00, 1.00, 1.00]])
col = np.stack([np.interp(E, stops, cols[:, c]) for c in range(3)], -1) * (0.35 + 0.75 * E[..., None])
I = E

# glow
lum = Image.fromarray((np.clip(I / I.max(), 0, 1) * 255).astype(np.uint8))
glow = np.zeros((H, W))
for r, w in [(W * 0.006, 0.6), (W * 0.03, 0.55), (W * 0.1, 0.5), (W * 0.22, 0.25)]:
    glow += w * np.asarray(lum.filter(ImageFilter.GaussianBlur(r)), float) / 255
glowc = glow[..., None] * np.array([0.30, 0.48, 1.0])

# starfield
rng = np.random.default_rng(7)
bg = np.zeros((H, W, 3)) + np.array([0.012, 0.014, 0.03])
ns = int(W * H / 2600)
sx, sy = rng.integers(0, W, ns), rng.integers(0, H, ns)
sb = rng.power(6, ns)[::-1] ** 3 * 0.9
tint = rng.choice([[1, .95, .9], [.85, .9, 1], [1, 1, 1], [1, .85, .7]], ns)
stars = np.zeros((H, W, 3)); stars[sy, sx] = sb[:, None] * tint
st_img = Image.fromarray((np.clip(stars, 0, 1) * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(W / 1600))
stars = np.asarray(st_img, float) / 255 * 2.2

img = bg + stars + glowc
img = np.where(hit[..., None], col + 0.10 * glowc, img)
img = 1 - np.exp(-2.0 * img)                   # soft tone map
Image.fromarray((np.clip(img, 0, 1) * 255).astype(np.uint8)).save(out, quality=90)
print("saved", out, W, H)
