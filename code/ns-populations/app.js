const SVG_WIDTH = 1380;
const SVG_HEIGHT = 820;
const MARGIN = { top: 34, right: 48, bottom: 132, left: 138 };
const PLOT = {
  x0: MARGIN.left,
  y0: MARGIN.top,
  width: SVG_WIDTH - MARGIN.left - MARGIN.right,
  height: SVG_HEIGHT - MARGIN.top - MARGIN.bottom,
  xmin: 9,
  xmax: 5e8,
  ymin: 2e-8,
  ymax: 7e-2,
};

const DEFAULT_POPULATIONS = [
  {
    id: "magnetars",
    label: "magnetars",
    display: "magnetars",
    use: "N_tau",
    hue: 225,
    sat: 74,
    light: 56,
    N: [30, 100, 1000],
    tau: [1e4, 3e4, 1e5],
    rate: [3e-4, 3e-3, 5e-2],
    offset: [1.55, 0.62, "start"],
    cap: [5e-4, 5e-2],
  },
  {
    id: "ordinary_radio_pulsars",
    label: "ordinary radio pulsars",
    display: "radio PSRs",
    use: "tau_rate",
    hue: 0,
    sat: 55,
    light: 42,
    N: [1e5, 1e6, 2e6],
    tau: [1e7, 4e7, 1e8],
    rate: [3e-3, 1.6e-2, 2.5e-2],
    offset: [0.70, 1.85, "start"],
    cap: [5e-3, 5e-2],
  },
  {
    id: "be_xrbs",
    label: "Be XRBs / Be+NS",
    display: "Be XRBs",
    use: "N_tau",
    hue: 24,
    sat: 100,
    light: 45,
    N: [3e2, 1e4, 5e4],
    tau: [1e7, 3e7, 1e8],
    rate: [5e-5, 3e-4, 2e-3],
    offset: [0.72, 6.00, "start"],
  },
  {
    id: "sghmxbs",
    label: "sgHMXBs",
    display: "sgHMXBs",
    use: "N_tau",
    hue: 24,
    sat: 95,
    light: 41,
    N: [50, 100, 250],
    tau: [1e4, 1e5, 1e6],
    rate: [5e-5, 1e-3, 2.5e-2],
    offset: [1.62, 0.72, "start"],
  },
  {
    id: "syxbs",
    label: "SyXBs",
    display: "SyXBs",
    use: "N_tau",
    hue: 345,
    sat: 78,
    light: 50,
    N: [30, 300, 1000],
    tau: [3e6, 1e7, 3e7],
    rate: [3e-6, 3e-5, 3e-4],
    offset: [0.72, 0.34, "start"],
  },
  {
    id: "lmxbs",
    label: "LMXBs",
    display: "LMXBs",
    use: "N_tau",
    hue: 278,
    sat: 78,
    light: 47,
    N: [3e2, 1000, 4e4],
    tau: [5e8, 1e9, 5e9],
    rate: [6e-8, 1e-6, 8e-5],
    offset: [0.58, 0.22, "start"],
  },
  {
    id: "spiders",
    label: "spider pulsars",
    display: "spiders",
    use: "N_tau",
    hue: 162,
    sat: 90,
    light: 34,
    N: [3e2, 2000, 6000],
    tau: [1e8, 1e9, 1e9],
    rate: [3e-7, 2e-6, 1e-5],
    offset: [0.95, 4.50, "start"],
  },
  {
    id: "psr_wd",
    label: "recycled pulsar+WD",
    display: "PSR+WD",
    use: "N_tau",
    hue: 237,
    sat: 92,
    light: 68,
    N: [1.5e4, 3e4, 5e4],
    tau: [1e9, 5e9, 1e10],
    rate: [1.5e-6, 8e-6, 5e-5],
    offset: [2.35, 1.65, "start"],
  },
  {
    id: "dns",
    label: "Galactic DNSs",
    display: "DNSs",
    use: "N_tau",
    hue: 201,
    sat: 100,
    light: 35,
    N: [3e3, 2.5e4, 1e5],
    tau: [3e8, 6.25e8, 5e9],
    rate: [6e-7, 4e-5, 3e-4],
    offset: [1.25, 1.28, "start"],
  },
  {
    id: "gaia_ns",
    label: "Gaia detached NS--MS",
    display: "Gaia NSs",
    use: "N_tau",
    hue: 0,
    sat: 86,
    light: 53,
    N: [1e4, 3e4, 1e5],
    tau: [1e9, 7e9, 1e10],
    rate: [1e-6, 5e-6, 2e-5],
    offset: [0.84, 0.34, "start"],
    highlight: true,
  },
  {
    id: "dormant_ns",
    label: "dormant isolated NSs",
    display: "dormant NSs",
    use: "tau_rate",
    hue: 217,
    sat: 42,
    light: 12,
    N: [3e7, 1e8, 3e8],
    tau: [1e9, 5e9, 1.4e10],
    rate: [3e-3, 1.6e-2, 2.5e-2],
    offset: [0.82, 0.20, "end"],
    cap: [1e-3, 5e-2],
  },
];

const VARIABLE_META = {
  N: { label: "N", unit: "in Galaxy" },
  tau: { label: "tau", unit: "yr" },
  rate: { label: "rate", unit: "yr^-1" },
};
const PAIR_VARIABLES = {
  N_tau: ["N", "tau"],
  N_rate: ["N", "rate"],
  tau_rate: ["tau", "rate"],
};
const DEFAULT_LIFETIME_LABELS = {
  "1e4": { tau: 1e4, x: 22, y: 2.1e-2, power: 4, prefix: "τ = ", suffix: " yr", anchor: "start" },
  "1e6": { tau: 1e6, x: 3.4e3, y: 1.3e-2, power: 6, prefix: "", anchor: "start" },
  "1e8": { tau: 1e8, x: 1.8e5, y: 1.5e-3, power: 8, prefix: "", anchor: "start" },
  "1e10": { tau: 1e10, x: 1.8e6, y: 7.0e-4, power: 10, prefix: "", anchor: "middle" },
};

const state = {
  populations: structuredClone(DEFAULT_POPULATIONS),
  selectedId: "gaia_ns",
  showLabels: true,
  shownCollapsed: false,
  lifetimeLabels: structuredClone(DEFAULT_LIFETIME_LABELS),
};

const populationSelect = document.getElementById("population-select");
const hueSlider = document.getElementById("hue-slider");
const hueOutput = document.getElementById("hue-output");
const swatch = document.getElementById("color-swatch");
const rangeGrid = document.getElementById("range-grid");
const shownToggle = document.getElementById("shown-toggle");
const visibilityPanel = document.getElementById("visibility-panel");
const visibilityGrid = document.getElementById("visibility-grid");
const selectedSummary = document.getElementById("selected-summary");
const derivedSummary = document.getElementById("derived-summary");
const plotHost = document.getElementById("plot-host");

function log10(value) {
  return Math.log(value) / Math.LN10;
}

function pow10(value) {
  return 10 ** value;
}

function clamp(value, lo, hi) {
  return Math.min(hi, Math.max(lo, value));
}

function logClamp(value, lo, hi) {
  return pow10(clamp(log10(value), log10(lo), log10(hi)));
}

function fmt(value, digits = 2) {
  if (!Number.isFinite(value) || value <= 0) return "--";
  const exponent = Math.floor(log10(value));
  if (Math.abs(exponent) >= 3 || value < 0.01) {
    const [mantissa, exponentText] = Number(value).toExponential(Math.max(0, digits - 1)).split("e");
    const mantissaText = mantissa.replace(/\.0+$/, "").replace(/(\.\d*?)0+$/, "$1");
    return `${mantissaText}e${Number(exponentText)}`;
  }
  if (value >= 100) return value.toPrecision(3).replace(/\.0+$/, "");
  if (value >= 1) return value.toFixed(2).replace(/\.0+$/, "").replace(/(\.\d*?)0+$/, "$1");
  return value.toPrecision(2);
}

function hsl(pop, alpha = 1) {
  return `hsla(${pop.hue}, ${pop.sat}%, ${pop.light}%, ${alpha})`;
}

function svgTextAnchor(anchor) {
  if (anchor === "end" || anchor === "middle" || anchor === "start") return anchor;
  return "start";
}

function svg(tag, attrs = {}, children = []) {
  const el = document.createElementNS("http://www.w3.org/2000/svg", tag);
  for (const [key, value] of Object.entries(attrs)) {
    if (value === undefined || value === null) continue;
    el.setAttribute(key, value);
  }
  for (const child of children) {
    if (typeof child === "string") el.appendChild(document.createTextNode(child));
    else if (child) el.appendChild(child);
  }
  return el;
}

function svgEmbeddedStyle() {
  return `
    .axis-label, .tick-label, .lifetime-label, .population-label {
      font-family: Georgia, serif;
    }
    .axis-label {
      fill: #0f0b07;
      font-size: 38px;
    }
    .tick-label {
      fill: #0f0b07;
      font-size: 27px;
    }
    .lifetime-label {
      fill: #626262;
      font-size: 28px;
    }
    .lifetime-label, .population-label {
      paint-order: stroke;
      stroke: rgba(255, 255, 255, 0.9);
      stroke-width: 6px;
      stroke-linejoin: round;
      font-family: Georgia, serif;
    }
  `;
}

function xScale(value) {
  const lx = (log10(value) - log10(PLOT.xmin)) / (log10(PLOT.xmax) - log10(PLOT.xmin));
  return PLOT.x0 + lx * PLOT.width;
}

function yScale(value) {
  const ly = (log10(value) - log10(PLOT.ymin)) / (log10(PLOT.ymax) - log10(PLOT.ymin));
  return PLOT.y0 + PLOT.height - ly * PLOT.height;
}

function xInvert(pixel) {
  const frac = clamp((pixel - PLOT.x0) / PLOT.width, 0, 1);
  return pow10(log10(PLOT.xmin) + frac * (log10(PLOT.xmax) - log10(PLOT.xmin)));
}

function yInvert(pixel) {
  const frac = clamp((PLOT.y0 + PLOT.height - pixel) / PLOT.height, 0, 1);
  return pow10(log10(PLOT.ymin) + frac * (log10(PLOT.ymax) - log10(PLOT.ymin)));
}

function clientToSvg(svgEl, event) {
  const point = svgEl.createSVGPoint();
  point.x = event.clientX;
  point.y = event.clientY;
  return point.matrixTransform(svgEl.getScreenCTM().inverse());
}

function selectedPopulation() {
  return state.populations.find((pop) => pop.id === state.selectedId) ?? state.populations[0];
}

function isVisible(pop) {
  return pop.visible !== false;
}

function activeVariables(pop) {
  return PAIR_VARIABLES[pop.use];
}

function deriveTriplets(pop) {
  const out = {
    N: [...pop.N],
    tau: [...pop.tau],
    rate: [...pop.rate],
  };
  if (pop.use === "N_tau") {
    out.rate = [out.N[0] / out.tau[2], out.N[1] / out.tau[1], out.N[2] / out.tau[0]];
  } else if (pop.use === "N_rate") {
    out.tau = [out.N[0] / out.rate[2], out.N[1] / out.rate[1], out.N[2] / out.rate[0]];
  } else if (pop.use === "tau_rate") {
    out.N = [out.rate[0] * out.tau[0], out.rate[1] * out.tau[1], out.rate[2] * out.tau[2]];
  }
  return out;
}

function rowFromPopulation(pop) {
  const d = deriveTriplets(pop);
  return {
    ...pop,
    nlo: d.N[0],
    n: d.N[1],
    nhi: d.N[2],
    tlo: d.tau[0],
    t: d.tau[1],
    thi: d.tau[2],
    rlo: d.rate[0],
    r: d.rate[1],
    rhi: d.rate[2],
    derived: d,
  };
}

function uncertaintyBars(pop) {
  const d = deriveTriplets(pop);
  const N = d.N;
  const tau = d.tau;
  const rate = d.rate;

  if (pop.use === "N_tau") {
    return [
      {
        label: "N range",
        points: [[N[0], N[0] / tau[1]], [N[2], N[2] / tau[1]]],
      },
      {
        label: "tau range",
        points: [[N[1], N[1] / tau[2]], [N[1], N[1] / tau[0]]],
      },
    ];
  }

  if (pop.use === "N_rate") {
    return [
      {
        label: "N range",
        points: [[N[0], rate[1]], [N[2], rate[1]]],
      },
      {
        label: "rate range",
        points: [[N[1], rate[0]], [N[1], rate[2]]],
      },
    ];
  }

  return [
    {
      label: "rate range",
      points: [[rate[0] * tau[1], rate[0]], [rate[2] * tau[1], rate[2]]],
    },
    {
      label: "tau range",
      points: [[rate[1] * tau[0], rate[1]], [rate[1] * tau[2], rate[1]]],
    },
  ];
}

function clipBarToRateCap(pop, p0, p1) {
  if (!pop.cap) return [p0, p1];
  const [capLo, capHi] = pop.cap;
  const [x0, y0] = p0;
  const [x1, y1] = p1;
  const lx0 = log10(x0);
  const ly0 = log10(y0);
  const lx1 = log10(x1);
  const ly1 = log10(y1);
  const grid = Array.from({ length: 301 }, (_, i) => i / 300);
  const good = grid.filter((t) => {
    const y = pow10(ly0 + (ly1 - ly0) * t);
    return y >= capLo && y <= capHi;
  });
  if (!good.length) return [p0, p1];
  const a = good[0];
  const b = good[good.length - 1];
  return [
    [pow10(lx0 + (lx1 - lx0) * a), pow10(ly0 + (ly1 - ly0) * a)],
    [pow10(lx0 + (lx1 - lx0) * b), pow10(ly0 + (ly1 - ly0) * b)],
  ];
}

function linePathForTau(tau) {
  const xs = [PLOT.xmin, PLOT.xmax];
  const pts = [];
  const candidates = [PLOT.xmin, PLOT.xmax, PLOT.ymin * tau, PLOT.ymax * tau]
    .filter((x) => x >= PLOT.xmin && x <= PLOT.xmax)
    .sort((a, b) => a - b);
  for (const x of candidates) {
    const y = x / tau;
    if (y >= PLOT.ymin && y <= PLOT.ymax) pts.push([x, y]);
  }
  const unique = pts.filter((p, idx) => idx === 0 || Math.abs(log10(p[0]) - log10(pts[idx - 1][0])) > 1e-6);
  if (unique.length < 2) return "";
  return `M${xScale(unique[0][0])},${yScale(unique[0][1])} L${xScale(unique.at(-1)[0])},${yScale(unique.at(-1)[1])}`;
}

function tenPowerLabel(attrs, power, prefix = "", suffix = "") {
  const text = svg("text", attrs);
  if (prefix) text.appendChild(document.createTextNode(prefix));
  text.appendChild(document.createTextNode("10"));
  text.appendChild(svg("tspan", {
    "baseline-shift": "super",
    "font-size": "62%",
  }, [String(power)]));
  if (suffix) text.appendChild(document.createTextNode(suffix));
  return text;
}

function textHitGeometry(x, y, text, fontSize, anchor = "start") {
  const width = Math.max(70, text.length * fontSize * 0.62);
  const height = fontSize * 1.35;
  const mode = svgTextAnchor(anchor);
  const left = mode === "end" ? x - width : mode === "middle" ? x - width / 2 : x;
  return { x: left - 12, y: y - height + 8, width: width + 24, height: height + 18 };
}

function addLabelHitbox(group, attrs, x, y, text, fontSize, anchor, extraClass) {
  const box = textHitGeometry(x, y, text, fontSize, anchor);
  group.appendChild(svg("rect", {
    ...attrs,
    ...box,
    fill: "transparent",
    "pointer-events": "all",
    class: extraClass,
  }));
}

function drawAxes(root) {
  const axis = svg("g", { class: "axes" });
  const { x0, y0, width, height } = PLOT;
  axis.appendChild(svg("rect", { x: x0, y: y0, width, height, fill: "none", stroke: "#0f0b07", "stroke-width": 2.2 }));

  const xPowers = [1, 2, 3, 4, 5, 6, 7, 8];
  for (const p of xPowers) {
    const x = xScale(10 ** p);
    axis.appendChild(svg("line", { x1: x, y1: y0 + height, x2: x, y2: y0 + height - 14, stroke: "#0f0b07", "stroke-width": 2.2 }));
    axis.appendChild(svg("line", { x1: x, y1: y0, x2: x, y2: y0 + 14, stroke: "#0f0b07", "stroke-width": 2.2 }));
    axis.appendChild(tenPowerLabel({ x, y: y0 + height + 48, "text-anchor": "middle", class: "tick-label" }, p));
    for (let m = 2; m < 10; m += 1) {
      const val = m * 10 ** p;
      if (val <= PLOT.xmin || val >= PLOT.xmax) continue;
      const xm = xScale(val);
      axis.appendChild(svg("line", { x1: xm, y1: y0 + height, x2: xm, y2: y0 + height - 7, stroke: "#0f0b07", "stroke-width": 1.35 }));
      axis.appendChild(svg("line", { x1: xm, y1: y0, x2: xm, y2: y0 + 7, stroke: "#0f0b07", "stroke-width": 1.35 }));
    }
  }

  const yPowers = [-7, -6, -5, -4, -3, -2];
  for (const p of yPowers) {
    const y = yScale(10 ** p);
    axis.appendChild(svg("line", { x1: x0, y1: y, x2: x0 + 14, y2: y, stroke: "#0f0b07", "stroke-width": 2.2 }));
    axis.appendChild(svg("line", { x1: x0 + width, y1: y, x2: x0 + width - 14, y2: y, stroke: "#0f0b07", "stroke-width": 2.2 }));
    axis.appendChild(tenPowerLabel({ x: x0 - 25, y: y + 9, "text-anchor": "end", class: "tick-label" }, p));
    for (let m = 2; m < 10; m += 1) {
      const val = m * 10 ** p;
      if (val <= PLOT.ymin || val >= PLOT.ymax) continue;
      const ym = yScale(val);
      axis.appendChild(svg("line", { x1: x0, y1: ym, x2: x0 + 7, y2: ym, stroke: "#0f0b07", "stroke-width": 1.35 }));
      axis.appendChild(svg("line", { x1: x0 + width, y1: ym, x2: x0 + width - 7, y2: ym, stroke: "#0f0b07", "stroke-width": 1.35 }));
    }
  }

  axis.appendChild(svg("text", { x: x0 + width / 2, y: SVG_HEIGHT - 35, "text-anchor": "middle", class: "axis-label" }, ["N in Galaxy"]));
  const yAxisLabel = svg("text", { x: 42, y: y0 + height / 2, "text-anchor": "middle", class: "axis-label", transform: `rotate(-90 42 ${y0 + height / 2})` });
  yAxisLabel.appendChild(document.createTextNode("birth rate (yr"));
  yAxisLabel.appendChild(svg("tspan", { "baseline-shift": "super", "font-size": "62%" }, ["-1"]));
  yAxisLabel.appendChild(document.createTextNode(")"));
  axis.appendChild(yAxisLabel);
  root.appendChild(axis);
}

function drawLifetimeLines(root) {
  const lines = svg("g", { class: "lifetime-lines" });
  for (const tau of [1e4, 1e6, 1e8, 1e10]) {
    const d = linePathForTau(tau);
    if (d) lines.appendChild(svg("path", { d, fill: "none", stroke: "#c8c8c8", "stroke-width": 3.2, "stroke-dasharray": "9 9", opacity: 0.85 }));
  }
  root.appendChild(lines);
}

function drawPopulation(root, pop) {
  if (!isVisible(pop)) return;
  const row = rowFromPopulation(pop);
  if (!(row.n > 0 && row.r > 0)) return;
  const group = svg("g", { class: "population-layer", "data-population": pop.id });
  const color = hsl(pop, 1);
  const isGaia = pop.highlight;

  uncertaintyBars(pop).forEach((bar, index) => {
    const [[x0Data, y0Data], [x1Data, y1Data]] = clipBarToRateCap(pop, bar.points[0], bar.points[1]);
    const opacity = index === 0 ? (isGaia ? 0.94 : 0.72) : (isGaia ? 0.70 : 0.42);
    const width = isGaia ? 7.0 : 5.0;
    const x0 = xScale(x0Data);
    const y0 = yScale(y0Data);
    const x1 = xScale(x1Data);
    const y1 = yScale(y1Data);
    group.appendChild(svg("line", {
      x1: x0,
      y1: y0,
      x2: x1,
      y2: y1,
      stroke: color,
      "stroke-width": width,
      "stroke-linecap": "round",
      opacity,
      "clip-path": "url(#plot-clip)",
      class: `range-bar range-bar-${index + 1}`,
      "data-range": bar.label,
    }));
    for (const [cx, cy] of [[x0, y0], [x1, y1]]) {
      group.appendChild(svg("circle", {
        cx,
        cy,
        r: isGaia ? 5.2 : 4.4,
        fill: color,
        opacity,
        stroke: "none",
        "clip-path": "url(#plot-clip)",
        class: `range-cap range-cap-${index + 1}`,
      }));
    }
  });

  const x = xScale(row.n);
  const y = yScale(row.r);
  group.appendChild(svg("circle", {
    cx: x,
    cy: y,
    r: isGaia ? 17 : 14,
    fill: color,
    stroke: isGaia ? "#0f0b07" : "white",
    "stroke-width": isGaia ? 4 : 3,
    "clip-path": "url(#plot-clip)",
    class: "point-marker",
  }));

  root.appendChild(group);
}

function drawPopulationLabels(layer) {
  for (const pop of state.populations) {
    if (!isVisible(pop)) continue;
    const row = rowFromPopulation(pop);
    if (!(row.n > 0 && row.r > 0)) continue;
    const [dx, dy, anchor] = pop.offset;
    const lx = logClamp(row.n * dx, PLOT.xmin * 1.22, PLOT.xmax / 1.38);
    const ly = logClamp(row.r * dy, PLOT.ymin * 2.2, PLOT.ymax / 1.65);
    const labelX = xScale(lx);
    const labelY = yScale(ly);
    const isGaia = pop.highlight;
    const fontSize = isGaia ? 41 : 31;
    const anchorMode = svgTextAnchor(anchor);
    const hitAttrs = {
      "data-label-kind": "population",
      "data-population": pop.id,
    };
    addLabelHitbox(layer, hitAttrs, labelX, labelY, pop.display, fontSize, anchorMode, "population-label-hit draggable-label-hit");
    layer.appendChild(svg("text", {
      x: labelX,
      y: labelY,
      fill: hsl(pop, 1),
      "data-label-kind": "population",
      "data-population": pop.id,
      "font-size": fontSize,
      "font-weight": isGaia ? 700 : 500,
      "text-anchor": anchorMode,
      class: "population-label draggable-label",
    }, [pop.display]));
  }
}

function drawLifetimeLabels(layer) {
  for (const [key, item] of Object.entries(state.lifetimeLabels)) {
    const x = xScale(logClamp(item.x, PLOT.xmin * 1.05, PLOT.xmax / 1.05));
    const y = yScale(logClamp(item.y, PLOT.ymin * 1.8, PLOT.ymax / 1.35));
    const anchor = svgTextAnchor(item.anchor);
    const labelText = `${item.prefix ?? ""}10${item.power}${item.suffix ?? ""}`;
    const fontSize = 28;
    const hitAttrs = {
      "data-label-kind": "lifetime",
      "data-lifetime": key,
    };
    addLabelHitbox(layer, hitAttrs, x, y, labelText, fontSize, anchor, "lifetime-label-hit draggable-label-hit");
    layer.appendChild(tenPowerLabel({
      x,
      y,
      class: "lifetime-label draggable-label",
      "text-anchor": anchor,
      "data-label-kind": "lifetime",
      "data-lifetime": key,
    }, item.power, item.prefix, item.suffix));
  }
}

function drawForegroundLabels(root) {
  if (!state.showLabels) return;
  const layer = svg("g", { class: "foreground-labels" });
  drawLifetimeLabels(layer);
  drawPopulationLabels(layer);
  root.appendChild(layer);
}

function attachLabelDrag(root) {
  let active = null;

  function updateHitboxForLabel(label, hit, text, fontSize, anchor) {
    if (!label || !hit) return;
    const x = Number(label.getAttribute("x"));
    const y = Number(label.getAttribute("y"));
    const box = textHitGeometry(x, y, text, fontSize, anchor);
    hit.setAttribute("x", box.x);
    hit.setAttribute("y", box.y);
    hit.setAttribute("width", box.width);
    hit.setAttribute("height", box.height);
  }

  function finishDrag() {
    if (!active) return;
    root.querySelectorAll(".draggable-label.dragging").forEach((label) => label.classList.remove("dragging"));
    window.removeEventListener("pointermove", moveDrag);
    window.removeEventListener("pointerup", finishDrag);
    window.removeEventListener("pointercancel", finishDrag);
    active = null;
  }

  function moveDrag(event) {
    if (!active) return;
    const point = clientToSvg(root, event);
    const x = clamp(point.x - active.dx, PLOT.x0 + 10, PLOT.x0 + PLOT.width - 10);
    const y = clamp(point.y - active.dy, PLOT.y0 + 10, PLOT.y0 + PLOT.height - 10);

    if (active.kind === "population") {
      const pop = state.populations.find((item) => item.id === active.id);
      if (!pop) return;
      const row = rowFromPopulation(pop);
      const labelN = xInvert(x);
      const labelRate = yInvert(y);
      pop.offset = [labelN / row.n, labelRate / row.r, pop.offset[2]];

      const label = root.querySelector(`.population-label[data-population="${pop.id}"]`);
      const hit = root.querySelector(`.population-label-hit[data-population="${pop.id}"]`);
      if (label) {
        label.setAttribute("x", xScale(labelN));
        label.setAttribute("y", yScale(labelRate));
      }
      updateHitboxForLabel(label, hit, pop.display, active.fontSize, active.anchor);
    } else if (active.kind === "lifetime") {
      const item = state.lifetimeLabels[active.id];
      if (!item) return;
      item.x = xInvert(x);
      item.y = yInvert(y);
      const label = root.querySelector(`.lifetime-label[data-lifetime="${active.id}"]`);
      const hit = root.querySelector(`.lifetime-label-hit[data-lifetime="${active.id}"]`);
      if (label) {
        label.setAttribute("x", xScale(item.x));
        label.setAttribute("y", yScale(item.y));
      }
      updateHitboxForLabel(label, hit, active.text, active.fontSize, active.anchor);
    }
    event.preventDefault();
  }

  root.addEventListener("pointerdown", (event) => {
    const target = event.target.closest?.(".draggable-label, .draggable-label-hit");
    if (!target) return;
    const kind = target.dataset.labelKind;
    const id = kind === "population" ? target.dataset.population : target.dataset.lifetime;
    if (!id) return;

    const label = root.querySelector(`.${kind === "population" ? "population-label" : "lifetime-label"}[data-${kind === "population" ? "population" : "lifetime"}="${id}"]`);
    if (!label) return;
    const point = clientToSvg(root, event);
    const labelX = Number(label.getAttribute("x"));
    const labelY = Number(label.getAttribute("y"));
    const fontSize = Number(label.getAttribute("font-size")) || (kind === "population" ? 31 : 28);
    const text = kind === "population"
      ? state.populations.find((item) => item.id === id)?.display
      : `${state.lifetimeLabels[id]?.prefix ?? ""}10${state.lifetimeLabels[id]?.power ?? ""}${state.lifetimeLabels[id]?.suffix ?? ""}`;
    active = {
      kind,
      id,
      pointerId: event.pointerId,
      dx: point.x - labelX,
      dy: point.y - labelY,
      fontSize,
      anchor: label.getAttribute("text-anchor") || "start",
      text: text || "",
    };
    if (kind === "population") {
      state.selectedId = id;
      renderControls();
    }
    label.classList.add("dragging");
    window.addEventListener("pointermove", moveDrag);
    window.addEventListener("pointerup", finishDrag);
    window.addEventListener("pointercancel", finishDrag);
    event.preventDefault();
  });
}

function renderPlot() {
  const root = svg("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: `0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`,
    role: "img",
    "aria-label": "Interactive plot of Galactic neutron-star population number versus birth rate",
  });
  const defs = svg("defs");
  defs.appendChild(svg("clipPath", { id: "plot-clip" }, [
    svg("rect", { x: PLOT.x0, y: PLOT.y0, width: PLOT.width, height: PLOT.height }),
  ]));
  root.appendChild(defs);
  root.appendChild(svg("style", {}, [svgEmbeddedStyle()]));
  root.appendChild(svg("rect", { x: 0, y: 0, width: SVG_WIDTH, height: SVG_HEIGHT, fill: "white" }));
  drawLifetimeLines(root);
  for (const pop of state.populations) drawPopulation(root, pop);
  drawAxes(root);
  drawForegroundLabels(root);
  attachLabelDrag(root);
  plotHost.replaceChildren(root);
}

function populateSelect() {
  populationSelect.replaceChildren(...state.populations.map((pop) => {
    const option = document.createElement("option");
    option.value = pop.id;
    option.textContent = pop.display;
    return option;
  }));
}

function renderControls() {
  const pop = selectedPopulation();
  const row = rowFromPopulation(pop);
  populationSelect.value = pop.id;
  hueSlider.value = String(pop.hue);
  hueOutput.value = `${pop.hue}°`;
  swatch.style.background = hsl(pop);
  hueSlider.style.setProperty("--accent", hsl(pop));
  document.querySelectorAll("input[name='input-pair']").forEach((radio) => {
    radio.checked = radio.value === pop.use;
  });
  renderVisibilityControls();

  const active = new Set(activeVariables(pop));
  const d = deriveTriplets(pop);
  const rows = ["N", "tau", "rate"].map((key) => {
    const activeClass = active.has(key) ? "active" : "inactive";
    const meta = VARIABLE_META[key];
    const values = d[key];
    const rowEl = document.createElement("div");
    rowEl.className = `range-row ${activeClass}`;
    const title = document.createElement("div");
    title.className = "range-row-title";
    title.innerHTML = `<span>${meta.label}</span><span>${active.has(key) ? "input" : "derived"}</span>`;
    rowEl.appendChild(title);
    const grid = document.createElement("div");
    grid.className = "value-grid";
    ["low", "mid", "high"].forEach((name, idx) => {
      const wrap = document.createElement("div");
      wrap.className = "value-field";
      const label = document.createElement("label");
      label.textContent = name;
      const input = document.createElement("input");
      input.className = "value-input";
      input.inputMode = "decimal";
      input.dataset.variable = key;
      input.dataset.index = String(idx);
      input.value = fmt(values[idx], 3);
      input.disabled = !active.has(key);
      input.addEventListener("change", handleValueChange);
      wrap.append(label, input);
      grid.appendChild(wrap);
    });
    rowEl.appendChild(grid);
    return rowEl;
  });
  rangeGrid.replaceChildren(...rows);

  selectedSummary.textContent = `${pop.display}${isVisible(pop) ? "" : " (hidden)"}`;
  const activeText = activeVariables(pop).map((v) => VARIABLE_META[v].label).join(" + ");
  let derivedKey = ["N", "tau", "rate"].find((v) => !active.has(v));
  derivedSummary.textContent = `${activeText} inputs; derived ${VARIABLE_META[derivedKey].label} = ${fmt(row[derivedKey === "N" ? "n" : derivedKey === "tau" ? "t" : "r"], 2)} ${VARIABLE_META[derivedKey].unit}`;
}

function renderVisibilityControls() {
  shownToggle.setAttribute("aria-expanded", String(!state.shownCollapsed));
  visibilityPanel.classList.toggle("collapsed", state.shownCollapsed);
  visibilityPanel.hidden = state.shownCollapsed;
  visibilityGrid.replaceChildren(...state.populations.map((pop) => {
    const label = document.createElement("label");
    label.className = "visibility-pill";
    label.style.setProperty("--pop-color", hsl(pop, 1));
    const input = document.createElement("input");
    input.type = "checkbox";
    input.checked = isVisible(pop);
    input.dataset.population = pop.id;
    input.addEventListener("change", handleVisibilityChange);
    const dot = document.createElement("span");
    dot.className = "visibility-dot";
    const text = document.createElement("span");
    text.textContent = pop.display;
    label.append(input, dot, text);
    return label;
  }));
}

function normalizeTriplet(values) {
  const parsed = values.map((v) => Math.max(Number(v), Number.MIN_VALUE));
  parsed.sort((a, b) => a - b);
  if (parsed[1] <= parsed[0]) parsed[1] = parsed[0] * 1.01;
  if (parsed[2] <= parsed[1]) parsed[2] = parsed[1] * 1.01;
  return parsed;
}

function handleValueChange(event) {
  const pop = selectedPopulation();
  const key = event.target.dataset.variable;
  const idx = Number(event.target.dataset.index);
  const current = [...pop[key]];
  const value = Number(event.target.value.replace(/×10\^?/g, "e"));
  if (!Number.isFinite(value) || value <= 0) {
    renderControls();
    return;
  }
  current[idx] = value;
  pop[key] = normalizeTriplet(current);
  renderControls();
  renderPlot();
}

function applyPairChange(value) {
  const pop = selectedPopulation();
  pop.use = value;
  renderControls();
  renderPlot();
}

function resetPopulation() {
  const idx = state.populations.findIndex((pop) => pop.id === state.selectedId);
  if (idx < 0) return;
  state.populations[idx] = structuredClone(DEFAULT_POPULATIONS.find((pop) => pop.id === state.selectedId));
  renderControls();
  renderPlot();
}

function resetAll() {
  state.populations = structuredClone(DEFAULT_POPULATIONS);
  state.lifetimeLabels = structuredClone(DEFAULT_LIFETIME_LABELS);
  state.selectedId = "gaia_ns";
  state.shownCollapsed = false;
  populateSelect();
  renderControls();
  renderPlot();
}

function serializeState() {
  const compact = state.populations.map((pop) => ({
    id: pop.id,
    visible: isVisible(pop),
    use: pop.use,
    hue: pop.hue,
    light: pop.light,
    N: pop.N,
    tau: pop.tau,
    rate: pop.rate,
    offset: pop.offset,
  }));
  return btoa(unescape(encodeURIComponent(JSON.stringify({
    populations: compact,
    lifetimeLabels: state.lifetimeLabels,
  }))));
}

function hydrateFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const encoded = params.get("state");
  if (!encoded) return;
  try {
    const incoming = JSON.parse(decodeURIComponent(escape(atob(encoded))));
    const incomingPopulations = Array.isArray(incoming) ? incoming : incoming.populations;
    for (const update of incomingPopulations ?? []) {
      const target = state.populations.find((pop) => pop.id === update.id);
      if (!target) continue;
      for (const key of ["visible", "use", "hue", "light", "N", "tau", "rate", "offset"]) {
        if (update[key] !== undefined) target[key] = update[key];
      }
    }
    if (!Array.isArray(incoming) && incoming.lifetimeLabels) {
      for (const [key, update] of Object.entries(incoming.lifetimeLabels)) {
        if (!state.lifetimeLabels[key]) continue;
        state.lifetimeLabels[key] = { ...state.lifetimeLabels[key], ...update };
      }
    }
  } catch (err) {
    console.warn("Could not read URL state", err);
  }
}

function handleVisibilityChange(event) {
  const pop = state.populations.find((item) => item.id === event.target.dataset.population);
  if (!pop) return;
  pop.visible = event.target.checked;
  renderControls();
  renderPlot();
}

function setAllVisibility(value) {
  for (const pop of state.populations) pop.visible = value;
  renderControls();
  renderPlot();
}

function toggleShownSection() {
  state.shownCollapsed = !state.shownCollapsed;
  renderVisibilityControls();
}

async function copyUrlState() {
  const url = new URL(window.location.href);
  url.searchParams.set("state", serializeState());
  await navigator.clipboard.writeText(url.toString());
  const button = document.getElementById("copy-link");
  const old = button.textContent;
  button.textContent = "Copied";
  setTimeout(() => { button.textContent = old; }, 1200);
}

function downloadSvg() {
  const svgEl = plotHost.querySelector("svg");
  if (!svgEl) return;
  const clone = svgEl.cloneNode(true);
  clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  const data = `<?xml version="1.0" encoding="UTF-8"?>\n${new XMLSerializer().serializeToString(clone)}`;
  const blob = new Blob([data], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "ns_populations_interactive.svg";
  link.click();
  URL.revokeObjectURL(url);
}

function currentSvgBlobUrl() {
  const svgEl = plotHost.querySelector("svg");
  if (!svgEl) return null;
  const data = new XMLSerializer().serializeToString(svgEl);
  const svgBlob = new Blob([data], { type: "image/svg+xml;charset=utf-8" });
  return URL.createObjectURL(svgBlob);
}

function renderSvgToCanvas(scale = 2) {
  const url = currentSvgBlobUrl();
  if (!url) return Promise.reject(new Error("No SVG is available to export."));
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => {
      URL.revokeObjectURL(url);
      const canvas = document.createElement("canvas");
      canvas.width = SVG_WIDTH * scale;
      canvas.height = SVG_HEIGHT * scale;
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
      resolve(canvas);
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Could not render the SVG export."));
    };
    image.src = url;
  });
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

async function downloadPng() {
  try {
    const canvas = await renderSvgToCanvas(2);
    canvas.toBlob((blob) => {
      if (blob) downloadBlob(blob, "ns_populations_interactive.png");
    }, "image/png");
  } catch (err) {
    console.error(err);
  }
}

function bytesFromString(text) {
  return new TextEncoder().encode(text);
}

function concatBytes(chunks) {
  const length = chunks.reduce((total, chunk) => total + chunk.length, 0);
  const out = new Uint8Array(length);
  let offset = 0;
  for (const chunk of chunks) {
    out.set(chunk, offset);
    offset += chunk.length;
  }
  return out;
}

function makePdfFromJpeg(jpegBytes, imageWidth, imageHeight) {
  const pageWidth = 11 * 72;
  const pageHeight = pageWidth * (SVG_HEIGHT / SVG_WIDTH);
  const chunks = [];
  const offsets = [0];
  let cursor = 0;

  function push(data) {
    const bytes = typeof data === "string" ? bytesFromString(data) : data;
    chunks.push(bytes);
    cursor += bytes.length;
  }

  function object(number, body) {
    offsets[number] = cursor;
    push(`${number} 0 obj\n${body}\nendobj\n`);
  }

  push("%PDF-1.4\n");
  object(1, "<< /Type /Catalog /Pages 2 0 R >>");
  object(2, "<< /Type /Pages /Kids [3 0 R] /Count 1 >>");
  object(
    3,
    `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageWidth.toFixed(2)} ${pageHeight.toFixed(2)}] /Resources << /XObject << /Im1 4 0 R >> >> /Contents 5 0 R >>`,
  );

  offsets[4] = cursor;
  push(`4 0 obj\n<< /Type /XObject /Subtype /Image /Width ${imageWidth} /Height ${imageHeight} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpegBytes.length} >>\nstream\n`);
  push(jpegBytes);
  push("\nendstream\nendobj\n");

  const content = `q\n${pageWidth.toFixed(2)} 0 0 ${pageHeight.toFixed(2)} 0 0 cm\n/Im1 Do\nQ\n`;
  object(5, `<< /Length ${content.length} >>\nstream\n${content}endstream`);

  const xrefOffset = cursor;
  push("xref\n0 6\n0000000000 65535 f \n");
  for (let i = 1; i <= 5; i += 1) {
    push(`${String(offsets[i]).padStart(10, "0")} 00000 n \n`);
  }
  push(`trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`);
  return concatBytes(chunks);
}

async function downloadPdf() {
  try {
    const canvas = await renderSvgToCanvas(3);
    const jpegBlob = await new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.96));
    if (!jpegBlob) return;
    const jpegBytes = new Uint8Array(await jpegBlob.arrayBuffer());
    const pdfBytes = makePdfFromJpeg(jpegBytes, canvas.width, canvas.height);
    downloadBlob(new Blob([pdfBytes], { type: "application/pdf" }), "ns_populations_interactive.pdf");
  } catch (err) {
    console.error(err);
  }
}

function bindEvents() {
  populationSelect.addEventListener("change", (event) => {
    state.selectedId = event.target.value;
    renderControls();
  });
  hueSlider.addEventListener("input", (event) => {
    const pop = selectedPopulation();
    pop.hue = Number(event.target.value);
    renderControls();
    renderPlot();
  });
  document.querySelectorAll("input[name='input-pair']").forEach((radio) => {
    radio.addEventListener("change", (event) => applyPairChange(event.target.value));
  });
  document.getElementById("reset-population").addEventListener("click", resetPopulation);
  document.getElementById("reset-all").addEventListener("click", resetAll);
  shownToggle.addEventListener("click", toggleShownSection);
  document.getElementById("show-all").addEventListener("click", () => setAllVisibility(true));
  document.getElementById("hide-all").addEventListener("click", () => setAllVisibility(false));
  document.getElementById("copy-link").addEventListener("click", copyUrlState);
  document.getElementById("download-svg").addEventListener("click", downloadSvg);
  document.getElementById("download-png").addEventListener("click", downloadPng);
  document.getElementById("download-pdf").addEventListener("click", downloadPdf);
  document.getElementById("label-toggle").addEventListener("change", (event) => {
    state.showLabels = event.target.checked;
    renderPlot();
  });
}

hydrateFromUrl();
populateSelect();
bindEvents();
renderControls();
renderPlot();
