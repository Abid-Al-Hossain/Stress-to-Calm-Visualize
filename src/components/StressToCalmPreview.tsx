"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useTransform, animate, AnimatePresence } from "framer-motion";
import { interpolate } from "flubber";

// ── Tier config ────────────────────────────────────────────────────────────────
const TIERS = [
  { min: 0,  max: 19,  label: "Minimal Stress",   shortLabel: "Minimal",  color: "#38bdf8", glow: "rgba(56,189,248,0.55)",  skinHue: "#fef3c7", bg: "#eef8ff" },
  { min: 20, max: 39,  label: "Mild Stress",      shortLabel: "Mild",     color: "#4ade80", glow: "rgba(74,222,128,0.55)",  skinHue: "#fde8a0", bg: "#eefcf4" },
  { min: 40, max: 59,  label: "Moderate Stress",  shortLabel: "Moderate", color: "#facc15", glow: "rgba(250,204,21,0.55)",  skinHue: "#fce89a", bg: "#fffbea" },
  { min: 60, max: 79,  label: "High Stress",      shortLabel: "High",     color: "#fb923c", glow: "rgba(251,146,60,0.55)",  skinHue: "#fdd0a0", bg: "#fff4ea" },
  { min: 80, max: 100, label: "Severe Stress",    shortLabel: "Severe",   color: "#f87171", glow: "rgba(248,113,113,0.55)", skinHue: "#ffc0b0", bg: "#fff1f2" },
];
function getTier(s: number) { return TIERS.find(t => s >= t.min && s <= t.max) ?? TIERS[0]; }

// ── Face SVG paths — same command count per element for smooth morphing ────────
// ViewBox: 0 0 200 240  |  Face center ≈ (100, 115)
// IMPORTANT: every element must have identical path command structure across states
const FACE = {
  // Face outline — 5 Cubic Bezier segments, identical structure
  outline: [
    // 0 — Low (very relaxed, soft round)
    "M 100,42 C 140,42 158,68 158,108 C 158,150 140,185 100,195 C 60,185 42,150 42,108 C 42,68 60,42 100,42 Z",
    // 1 — Mild
    "M 100,43 C 139,43 157,69 157,108 C 157,150 139,184 100,194 C 61,184 43,150 43,108 C 43,69 61,43 100,43 Z",
    // 2 — Moderate (slightly tighter jaw)
    "M 100,43 C 138,43 156,70 157,109 C 158,151 139,183 100,193 C 61,183 42,151 43,109 C 44,70 62,43 100,43 Z",
    // 3 — High (tense, slightly narrower top)
    "M 100,44 C 137,44 155,71 156,110 C 157,152 138,183 100,193 C 62,183 43,152 44,110 C 45,71 63,44 100,44 Z",
    // 4 — Severe (pulled, jaw tense)
    "M 100,44 C 136,44 154,72 155,111 C 156,153 137,184 100,194 C 63,184 44,153 45,111 C 46,72 64,44 100,44 Z",
  ],
  // Left eyebrow — Q command, same structure
  browL: [
    // 0 — Low: relaxed arch, slightly raised
    "M 62,90 Q 73,82 84,88",
    // 1 — Mild: neutral
    "M 62,89 Q 73,81 84,87",
    // 2 — Moderate: inner corner dips (concern)
    "M 62,87 Q 70,89 84,85",
    // 3 — High: stronger furrow
    "M 62,83 Q 68,91 84,82",
    // 4 — Severe: dramatic inner furrow, raised outer
    "M 62,80 Q 67,94 84,79",
  ],
  // Right eyebrow (mirrored)
  browR: [
    "M 116,88 Q 127,82 138,90",
    "M 116,87 Q 127,81 138,89",
    "M 116,85 Q 130,89 138,87",
    "M 116,82 Q 132,91 138,83",
    "M 116,79 Q 133,94 138,80",
  ],
  // Left eye outline (entire eye shape — top lid + bottom, same bezier count)
  eyeOutL: [
    // 0 — Low: slightly heavy-lidded (peaceful, dreamy)
    "M 63,106 C 68,100 78,100 83,106 C 78,114 68,114 63,106 Z",
    // 1 — Mild: natural open
    "M 63,104 C 68,97 78,97 83,104 C 78,113 68,113 63,104 Z",
    // 2 — Moderate: alert, wider
    "M 63,103 C 68,95 78,95 83,103 C 78,113 68,113 63,103 Z",
    // 3 — High: wider, slight squint upper
    "M 63,102 C 68,93 78,93 83,102 C 78,113 68,113 63,102 Z",
    // 4 — Severe: wide open, almost circular
    "M 63,101 C 68,90 78,90 83,101 C 78,114 68,114 63,101 Z",
  ],
  // Right eye outline
  eyeOutR: [
    "M 117,106 C 122,100 132,100 137,106 C 132,114 122,114 117,106 Z",
    "M 117,104 C 122,97 132,97 137,104 C 132,113 122,113 117,104 Z",
    "M 117,103 C 122,95 132,95 137,103 C 132,113 122,113 117,103 Z",
    "M 117,102 C 122,93 132,93 137,102 C 132,113 122,113 117,102 Z",
    "M 117,101 C 122,90 132,90 137,101 C 132,114 122,114 117,101 Z",
  ],
  // Upper eyelid overlay (for blink — starts matching eyeOut top, then closes to flat line)
  lidL: [
    "M 63,106 C 68,100 78,100 83,106 C 78,106 68,106 63,106 Z",
    "M 63,104 C 68,97 78,97 83,104 C 78,104 68,104 63,104 Z",
    "M 63,103 C 68,95 78,95 83,103 C 78,103 68,103 63,103 Z",
    "M 63,102 C 68,93 78,93 83,102 C 78,102 68,102 63,102 Z",
    "M 63,101 C 68,90 78,90 83,101 C 78,101 68,101 63,101 Z",
  ],
  lidR: [
    "M 117,106 C 122,100 132,100 137,106 C 132,106 122,106 117,106 Z",
    "M 117,104 C 122,97 132,97 137,104 C 132,104 122,104 117,104 Z",
    "M 117,103 C 122,95 132,95 137,103 C 132,103 122,103 117,103 Z",
    "M 117,102 C 122,93 132,93 137,102 C 132,102 122,102 117,102 Z",
    "M 117,101 C 122,90 132,90 137,101 C 132,101 122,101 117,101 Z",
  ],
  // Nose bridge (subtle, same structure)
  nose: [
    "M 100,115 C 96,122 95,128 97,133 C 99,135 101,135 103,133 C 105,128 104,122 100,115",
    "M 100,115 C 96,122 95,128 97,133 C 99,135 101,135 103,133 C 105,128 104,122 100,115",
    "M 100,115 C 96,122 95,129 97,134 C 99,136 101,136 103,134 C 105,129 104,122 100,115",
    "M 100,115 C 96,121 95,128 97,133 C 99,135 101,135 103,133 C 105,128 104,121 100,115",
    "M 100,115 C 96,121 95,127 97,132 C 99,134 101,134 103,132 C 105,127 104,121 100,115",
  ],
  // Mouth — Q cubic bezier, same command structure
  mouth: [
    // 0 — Low: big warm smile
    "M 72,155 Q 100,175 128,155",
    // 1 — Mild: gentle smile
    "M 75,154 Q 100,168 125,154",
    // 2 — Moderate: flat/very slight upturn
    "M 78,154 Q 100,158 122,154",
    // 3 — High: frown
    "M 77,156 Q 100,145 123,156",
    // 4 — Severe: deep frown, open tension
    "M 73,159 Q 100,142 127,159",
  ],
  // Lower lip (adds volume)
  lowerLip: [
    "M 72,155 Q 100,178 128,155 Q 100,183 72,155 Z",
    "M 75,154 Q 100,170 125,154 Q 100,177 75,154 Z",
    "M 78,154 Q 100,160 122,154 Q 100,165 78,154 Z",
    "M 77,156 Q 100,147 123,156 Q 100,152 77,156 Z",
    "M 73,159 Q 100,144 127,159 Q 100,149 73,159 Z",
  ],
  // Forehead worry lines
  wrinkle1: [
    "M 82,75 Q 90,73 98,75",  // 0: hidden (opacity 0)
    "M 82,75 Q 90,73 98,75",  // 1: hidden
    "M 82,75 Q 90,73 98,75",  // 2: faint (opacity 0.3)
    "M 81,74 Q 91,70 99,74",  // 3: visible
    "M 80,73 Q 92,68 100,73", // 4: strong
  ],
  wrinkle2: [
    "M 86,68 Q 93,66 100,68",
    "M 86,68 Q 93,66 100,68",
    "M 86,68 Q 93,66 100,68",
    "M 85,67 Q 93,64 101,67",
    "M 84,66 Q 93,62 102,66",
  ],
  // Cheek (just left — we'll mirror for right with transform)
  cheekL: [
    // 0 — Low: soft blush circle
    "M 55,126 C 55,118 67,118 67,126 C 67,134 55,134 55,126 Z",
    "M 55,126 C 55,118 67,118 67,126 C 67,134 55,134 55,126 Z",
    "M 55,126 C 55,119 67,119 67,126 C 67,133 55,133 55,126 Z",
    "M 55,126 C 55,120 67,120 67,126 C 67,132 55,132 55,126 Z",
    "M 55,126 C 55,120 67,120 67,126 C 67,132 55,132 55,126 Z",
  ],
};

// Feature values per state (0–4)
const FEATURE_VALUES = [
  // [state0, state1, state2, state3, state4]
  // pupil radius
  { pupilR:    [4,    4.5,   5,    5.5,    6   ] },
  { pupilCy:   [107,  105,   104,  103,    102  ] },
  { cheekOpacity: [0.35, 0.22, 0.08, 0,    0   ] },
  { wrinkle1Op:   [0,    0,    0.25, 0.55,  0.85] },
  { wrinkle2Op:   [0,    0,    0,    0.35,  0.65] },
  { auraRadius:   [90,   90,   92,   95,   100  ] },
];

function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }
function getVal(arr: number[], tier: number, frac: number) {
  const lo = Math.floor(tier); const hi = Math.min(4, lo + 1);
  return lerp(arr[lo], arr[hi], frac);
}

// Brainwave line
function generateWave(score: number, w: number, h: number, seed: number): string {
  const segs = 70; const chaos = score / 100;
  const amp = 3 + chaos * 24; const freq = 1 + chaos * 4.5;
  return Array.from({ length: segs + 1 }, (_, i) => {
    const x = (i / segs) * w;
    const t = (i / segs) * Math.PI * 2 * freq + seed;
    const noise = chaos > 0.35 ? Math.sin(t * 3.9 + seed * 1.5) * amp * 0.5 * chaos : 0;
    const y = h / 2 + Math.sin(t) * amp + noise;
    return `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
  }).join(" ");
}

// ── Morphing path hook via flubber ─────────────────────────────────────────────
function useMorphPath(paths: string[], tierFrac: number) {
  const progress = useMotionValue(tierFrac);
  const clampedCount = paths.length - 1;

  const mixers = useRef<((t: number) => string)[]>([]);
  useEffect(() => {
    mixers.current = paths.slice(0, -1).map((p, i) =>
      interpolate(p, paths[i + 1], { maxSegmentLength: 2 })
    );
  }, [paths]);

  const d = useTransform(progress, (v: number) => {
    const clamped = Math.max(0, Math.min(clampedCount, v));
    const lo = Math.floor(clamped); const frac = clamped - lo;
    if (frac === 0) return paths[lo];
    const mixer = mixers.current[lo];
    return mixer ? mixer(frac) : paths[lo];
  });

  useEffect(() => {
    animate(progress, tierFrac, { duration: 0.7, ease: [0.4, 0, 0.2, 1] });
  }, [tierFrac, progress]);

  return d;
}

// ── Animated integer counter ───────────────────────────────────────────────────
function AnimatedCount({ value }: { value: number }) {
  const [shown, setShown] = useState(value);
  const prev = useRef(value);
  useEffect(() => {
    const start = prev.current; const end = value;
    const dur = 600; const t0 = performance.now();
    const step = () => {
      const t = Math.min(1, (performance.now() - t0) / dur);
      const ease = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
      setShown(Math.round(start + (end - start) * ease));
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
    prev.current = value;
  }, [value]);
  return <>{shown}</>;
}

// ── Main component ─────────────────────────────────────────────────────────────
interface Props { externalScore?: number | null; }

export default function StressToCalmPreview({ externalScore = null }: Props) {
  const [stressLevel, setStressLevel] = useState(0);
  const [blinking, setBlinking] = useState(false);
  const [waveSeed, setWaveSeed] = useState(0);
  const [viewportWidth, setViewportWidth] = useState(1024);
  const waveRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const blinkRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (externalScore !== null) setStressLevel(externalScore);
  }, [externalScore]);

  useEffect(() => {
    const updateViewport = () => setViewportWidth(window.innerWidth);
    updateViewport();
    window.addEventListener("resize", updateViewport);
    return () => window.removeEventListener("resize", updateViewport);
  }, []);

  // Brainwave animation
  useEffect(() => {
    waveRef.current = setInterval(() => setWaveSeed(s => s + 0.09), 50);
    return () => { if (waveRef.current) clearInterval(waveRef.current); };
  }, []);

  // Blink scheduler (more often when stressed)
  useEffect(() => {
    const scheduleNext = () => {
      const interval = stressLevel > 74 ? 1500 + Math.random() * 1500 : 3000 + Math.random() * 3000;
      blinkRef.current = setTimeout(() => {
        setBlinking(true);
        setTimeout(() => { setBlinking(false); scheduleNext(); }, 140);
      }, interval);
    };
    scheduleNext();
    return () => { if (blinkRef.current) clearTimeout(blinkRef.current); };
  }, [stressLevel]);

  const tier = getTier(stressLevel);
  const tierIdx = TIERS.indexOf(tier);
  // fractional tier index for smooth interpolation
  const tierFrac = tierIdx === 4 ? 4 :
    ((stressLevel - tier.min) / (tier.max - tier.min)) + tierIdx;

  // Interpolated scalar values
  const cheekOp  = getVal([0.35, 0.22, 0.08, 0, 0],       tierIdx, tierFrac - tierIdx);
  const wrinkle1 = getVal([0, 0, 0.25, 0.55, 0.85],         tierIdx, tierFrac - tierIdx);
  const wrinkle2 = getVal([0, 0, 0,    0.35, 0.65],          tierIdx, tierFrac - tierIdx);
  const pupilR   = getVal([4, 4.5, 5, 5.5, 6],               tierIdx, tierFrac - tierIdx);
  const pupilCy  = getVal([107, 105, 104, 103, 102],          tierIdx, tierFrac - tierIdx);
  const auraR    = getVal([90, 90, 92, 95, 100],              tierIdx, tierFrac - tierIdx);

  const showSweat = stressLevel >= 75;
  const showTear  = stressLevel >= 90;

  // SVG morphing paths
  const faceD  = useMorphPath(FACE.outline,   tierFrac);
  const browLD = useMorphPath(FACE.browL,     tierFrac);
  const browRD = useMorphPath(FACE.browR,     tierFrac);
  const eyeLD  = useMorphPath(FACE.eyeOutL,   tierFrac);
  const eyeRD  = useMorphPath(FACE.eyeOutR,   tierFrac);
  const lidLD  = useMorphPath(FACE.lidL,      tierFrac);
  const lidRD  = useMorphPath(FACE.lidR,      tierFrac);
  const noseD  = useMorphPath(FACE.nose,      tierFrac);
  const mouthD = useMorphPath(FACE.mouth,     tierFrac);
  const lipD   = useMorphPath(FACE.lowerLip,  tierFrac);
  const wrnk1D = useMorphPath(FACE.wrinkle1,  tierFrac);
  const wrnk2D = useMorphPath(FACE.wrinkle2,  tierFrac);
  const cheekD = useMorphPath(FACE.cheekL,    tierFrac);

  const skinColor    = tier.skinHue;
  const skinShadow   = stressLevel > 70 ? "#e8a88a" : "#f5d5a8";
  const eyeWhite     = stressLevel > 74 ? "#fff5f5" : "white";
  const browColor    = stressLevel > 59 ? "#6b3a1f" : "#7a4528";
  const panelMuted = "#6a7f92";
  const panelFaint = "#90a4b8";
  const panelSurface = "rgba(255,255,255,0.62)";
  const panelSurfaceStrong = "rgba(255,255,255,0.76)";
  const panelBorder = "rgba(90,155,212,0.18)";
  const isMobile = viewportWidth < 640;
  const isCompact = viewportWidth < 480;
  const faceWidth = isCompact ? 146 : isMobile ? 162 : 184;

  return (
    <div style={{
      width: "100%", maxWidth: isMobile ? "100%" : "500px", margin: isMobile ? "0.75rem auto" : "1rem auto",
      borderRadius: "22px",
      background: `linear-gradient(160deg, ${tier.bg} 0%, rgba(255,255,255,0.94) 100%)`,
      border: "1px solid rgba(255,255,255,0.75)",
      boxShadow: `0 18px 48px rgba(90,155,212,0.18), 0 0 44px ${tier.glow.replace("0.55","0.12")}`,
      padding: isCompact ? "0.7rem 0.7rem 0.62rem" : isMobile ? "0.78rem 0.78rem 0.64rem" : "0.8rem 0.8rem 0.7rem",
      position: "relative", overflow: "hidden",
      transition: "background 0.8s, box-shadow 0.8s",
    }}>
      {/* Tech grid bg */}
      <div style={{ position:"absolute", inset:0, opacity:0.05, pointerEvents:"none",
        backgroundImage: `linear-gradient(${tier.color} 1px, transparent 1px), linear-gradient(90deg, ${tier.color} 1px, transparent 1px)`,
        backgroundSize:"30px 30px", transition:"background-image 0.8s" }} />

      {/* Header */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:isMobile ? "flex-start" : "center", flexWrap:isMobile ? "wrap" : "nowrap", marginBottom:"0.45rem", position:"relative", zIndex:2, gap:"0.5rem" }}>
        <div>
          <p style={{ fontSize:isCompact ? "0.58rem" : "0.68rem", fontFamily:"monospace", color:tier.color, letterSpacing:"0.16em", textTransform:"uppercase", opacity:0.85, marginBottom:"0.12rem" }}>
            Stress-to-Calm · Mental State
          </p>
          <p style={{ fontSize:isCompact ? "0.66rem" : "0.78rem", fontFamily:"monospace", color:panelMuted, letterSpacing:"0.05em" }}>
            {externalScore !== null ? "Assessment Result" : "Demo · drag the slider"}
          </p>
        </div>
        <motion.div key={tier.label}
          initial={{ opacity:0, scale:0.8 }} animate={{ opacity:1, scale:1 }}
          style={{ display:"flex", alignItems:"center", gap:"0.42rem", padding:isCompact ? "0.25rem 0.58rem" : "0.3rem 0.72rem",
            borderRadius:"99px", background:panelSurfaceStrong, border:`1px solid ${tier.color}44`, boxShadow:"0 8px 24px rgba(90,155,212,0.08)" }}>
          <span style={{ fontSize:isCompact ? "0.9rem" : "1rem" }}>{stressLevel <= 39 ? "😌" : stressLevel <= 59 ? "🙂" : stressLevel <= 74 ? "😐" : stressLevel <= 89 ? "😟" : "😰"}</span>
          <span style={{ fontSize:isCompact ? "0.66rem" : "0.76rem", fontWeight:700, color:tier.color, fontFamily:"monospace", textTransform:"uppercase", letterSpacing:"0.08em" }}>
            {tier.label}
          </span>
        </motion.div>
      </div>

      {/* ── FACE SVG ── */}
      <div style={{ position:"relative", zIndex:2, display:"flex", justifyContent:"center" }}>
        <svg viewBox="0 0 200 240" width={faceWidth} height={Math.round(faceWidth * 1.2)} style={{ display:"block", overflow:"visible", width:`min(${faceWidth}px, 100%)`, height:"auto", marginTop:isMobile ? "-0.22rem" : "-0.35rem", marginBottom:"-0.1rem" }}>
          <defs>
            {/* Skin gradient */}
            <radialGradient id="skinGrad" cx="42%" cy="38%" r="60%">
              <stop offset="0%"   stopColor={skinColor} />
              <stop offset="100%" stopColor={skinShadow} />
            </radialGradient>
            {/* Aura glow behind face */}
            <radialGradient id="auraGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%"   stopColor={tier.color} stopOpacity={stressLevel > 59 ? "0.18" : "0.12"} />
              <stop offset="100%" stopColor={tier.color} stopOpacity="0" />
            </radialGradient>
            {/* Eye gradient */}
            <radialGradient id="irisL" cx="45%" cy="40%" r="55%">
              <stop offset="0%"   stopColor={stressLevel > 74 ? "#6b2020" : stressLevel > 59 ? "#4a6b20" : "#1a4a8a"} />
              <stop offset="100%" stopColor={stressLevel > 74 ? "#3d1010" : stressLevel > 59 ? "#2a4010" : "#0a1a50"} />
            </radialGradient>
            <radialGradient id="irisR" cx="45%" cy="40%" r="55%">
              <stop offset="0%"   stopColor={stressLevel > 74 ? "#6b2020" : stressLevel > 59 ? "#4a6b20" : "#1a4a8a"} />
              <stop offset="100%" stopColor={stressLevel > 74 ? "#3d1010" : stressLevel > 59 ? "#2a4010" : "#0a1a50"} />
            </radialGradient>
            <filter id="faceGlow">
              <feGaussianBlur stdDeviation="4" result="blur"/>
              <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
            <filter id="softBlur">
              <feGaussianBlur stdDeviation="2" result="blur"/>
              <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
          </defs>

          {/* Aura behind face */}
          <motion.ellipse
            cx={100} cy={115}
            rx={auraR} ry={auraR * 1.1}
            fill="url(#auraGrad)"
            animate={{ rx: auraR, ry: auraR * 1.1 }}
            transition={{ duration: 0.8 }}
          />
          {/* Pulsing ring for high stress */}
          {stressLevel > 59 && (
            <motion.ellipse cx={100} cy={115} rx={auraR + 10} ry={(auraR + 10) * 1.1}
              fill="none" stroke={tier.color} strokeWidth={stressLevel > 74 ? 1.5 : 0.8}
              animate={{ opacity: [0.1, 0.4, 0.1], rx: [auraR+8, auraR+14, auraR+8] }}
              transition={{ duration: stressLevel > 74 ? 1.2 : 2, repeat: Infinity, ease:"easeInOut" }}
            />
          )}

          {/* ── FACE SKIN ── */}
          <motion.path d={faceD} fill="url(#skinGrad)" stroke={skinShadow} strokeWidth="0.5" />

          {/* Chin shadow */}
          <ellipse cx={100} cy={190} rx={22} ry={4} fill={skinShadow} opacity={0.35} />

          {/* Neck */}
          <rect x={88} y={194} width={24} height={18} rx={6} fill={skinShadow} opacity={0.7} />

          {/* ── CHEEKS (blush) ── */}
          <motion.path d={cheekD} fill={stressLevel < 60 ? "#f97316" : "#ef4444"} opacity={cheekOp} filter="url(#softBlur)" />
          {/* Right cheek (mirror) */}
          <motion.path d={cheekD}
            fill={stressLevel < 60 ? "#f97316" : "#ef4444"}
            opacity={cheekOp}
            filter="url(#softBlur)"
            transform="scale(-1,1) translate(-200,0)"
          />

          {/* ── EYEBROWS ── */}
          <motion.path d={browLD}
            fill="none" stroke={browColor}
            strokeWidth={stressLevel > 74 ? 3 : 2.5}
            strokeLinecap="round"
            animate={{ stroke: browColor }}
            transition={{ duration: 0.5 }}
          />
          <motion.path d={browRD}
            fill="none" stroke={browColor}
            strokeWidth={stressLevel > 74 ? 3 : 2.5}
            strokeLinecap="round"
            animate={{ stroke: browColor }}
            transition={{ duration: 0.5 }}
          />

          {/* ── EYES ── */}
          {/* Left eye */}
          <motion.path d={eyeLD} fill={eyeWhite} />
          {/* Left iris */}
          <motion.circle cx={73} cy={pupilCy} r={pupilR * 1.45}
            fill="url(#irisL)"
            animate={{ cy: pupilCy, r: pupilR * 1.45 }}
            transition={{ duration: 0.6, ease:"easeOut" }}
          />
          {/* Left pupil */}
          <motion.circle cx={73} cy={pupilCy} r={pupilR}
            fill="#0a0a0a"
            animate={{ cy: pupilCy, r: pupilR }}
            transition={{ duration: 0.6, ease:"easeOut" }}
          />
          {/* Left highlight */}
          <motion.circle cx={76} cy={pupilCy - 1.5} r={1.2} fill="white" opacity={0.9}
            animate={{ cy: pupilCy - 1.5 }} transition={{ duration: 0.6 }} />
          {/* Left lower eyelid */}
          <motion.path d={eyeLD} fill="none" stroke={skinShadow} strokeWidth="0.8" strokeLinecap="round" opacity={0.5} />
          {/* Left blink eyelid (face-colored overlay) */}
          <motion.path d={lidLD} fill={skinColor}
            animate={{ scaleY: blinking ? 1 : 0 }}
            style={{ originX: "73px", originY: `${pupilCy}px` }}
            transition={{ duration: 0.07 }}
          />

          {/* Right eye */}
          <motion.path d={eyeRD} fill={eyeWhite} />
          <motion.circle cx={127} cy={pupilCy} r={pupilR * 1.45}
            fill="url(#irisR)"
            animate={{ cy: pupilCy, r: pupilR * 1.45 }}
            transition={{ duration: 0.6, ease:"easeOut" }}
          />
          <motion.circle cx={127} cy={pupilCy} r={pupilR}
            fill="#0a0a0a"
            animate={{ cy: pupilCy, r: pupilR }}
            transition={{ duration: 0.6, ease:"easeOut" }}
          />
          <motion.circle cx={130} cy={pupilCy - 1.5} r={1.2} fill="white" opacity={0.9}
            animate={{ cy: pupilCy - 1.5 }} transition={{ duration: 0.6 }} />
          <motion.path d={eyeRD} fill="none" stroke={skinShadow} strokeWidth="0.8" strokeLinecap="round" opacity={0.5} />
          <motion.path d={lidRD} fill={skinColor}
            animate={{ scaleY: blinking ? 1 : 0 }}
            style={{ originX: "127px", originY: `${pupilCy}px` }}
            transition={{ duration: 0.07 }}
          />

          {/* ── NOSE ── */}
          <motion.path d={noseD} fill="none" stroke={skinShadow} strokeWidth="1.2" strokeLinecap="round" opacity={0.6} />
          {/* Nostrils */}
          <ellipse cx={95.5} cy={134} rx={2.2} ry={1.4} fill={skinShadow} opacity={0.5} />
          <ellipse cx={104.5} cy={134} rx={2.2} ry={1.4} fill={skinShadow} opacity={0.5} />

          {/* ── MOUTH ── */}
          {/* Lower lip fill — subtle volume */}
          <motion.path d={lipD} fill={skinShadow} opacity={0.55} />
          {/* Mouth line */}
          <motion.path d={mouthD} fill="none"
            stroke={stressLevel > 59 ? "#c0724a" : "#c88060"}
            strokeWidth="2.5" strokeLinecap="round"
            animate={{ stroke: stressLevel > 59 ? "#c0724a" : "#c88060" }}
            transition={{ duration: 0.5 }}
          />
          {/* Mouth corners — dimples at low stress */}
          {stressLevel < 60 && (
            <>
              <circle cx={72} cy={155} r={1.5} fill={skinShadow} opacity={0.6} />
              <circle cx={128} cy={155} r={1.5} fill={skinShadow} opacity={0.6} />
            </>
          )}

          {/* ── FOREHEAD WRINKLES ── */}
          <motion.path d={wrnk1D} fill="none" stroke={skinShadow} strokeWidth="1"
            strokeLinecap="round" opacity={wrinkle1} />
          <motion.path d={wrnk2D} fill="none" stroke={skinShadow} strokeWidth="0.8"
            strokeLinecap="round" opacity={wrinkle2} />

          {/* ── SWEAT DROP ── */}
          <AnimatePresence>
            {showSweat && (
              <motion.g key="sweat">
                <motion.path
                  d="M 130,72 C 128,76 126,80 128,83 C 130,86 134,86 136,83 C 138,80 136,76 130,72 Z"
                  fill="#93c5fd" opacity={0.85}
                  initial={{ y: 0, opacity: 0 }}
                  animate={{ y: [0, 18, 28], opacity: [0, 0.85, 0] }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 2.2, repeat: Infinity, repeatDelay: 1.5, ease: "easeIn" }}
                />
              </motion.g>
            )}
          </AnimatePresence>

          {/* ── TEARS (severe) ── */}
          <AnimatePresence>
            {showTear && (
              <>
                <motion.ellipse key="tearL" cx={65} cy={113} rx={2} ry={3}
                  fill="#bfdbfe" opacity={0.9}
                  initial={{ y: 0, opacity: 0 }}
                  animate={{ y: [0, 20, 48], opacity: [0, 0.9, 0] }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.6, repeat: Infinity, repeatDelay: 0.8, ease:"easeIn" }}
                />
                <motion.ellipse key="tearR" cx={135} cy={113} rx={2} ry={3}
                  fill="#bfdbfe" opacity={0.9}
                  initial={{ y: 0, opacity: 0 }}
                  animate={{ y: [0, 20, 48], opacity: [0, 0.9, 0] }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.6, repeat: Infinity, repeatDelay: 1.6, ease:"easeIn", delay: 0.7 }}
                />
              </>
            )}
          </AnimatePresence>

          {/* Subtle face sheen */}
          <motion.path d={faceD}
            fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5"
          />
        </svg>

        {/* Score badge over face */}
        <div style={{
          position:"absolute", bottom:"8px", left:"50%", transform:"translateX(-50%)",
          background:panelSurfaceStrong, backdropFilter:"blur(12px)",
          borderRadius:"99px", padding:isCompact ? "0.16rem 0.58rem" : "0.2rem 0.72rem",
          border:`1px solid ${tier.color}44`, display:"flex", alignItems:"center", gap:"0.4rem",
          boxShadow:"0 10px 24px rgba(90,155,212,0.12)",
        }}>
          <motion.span animate={{ color: tier.color, textShadow:`0 0 12px ${tier.color}` }}
            transition={{ duration:0.5 }}
            style={{ fontSize:isCompact ? "1rem" : "1.15rem", fontWeight:900, fontFamily:"monospace" }}>
            <AnimatedCount value={stressLevel} />
          </motion.span>
          <span style={{ fontSize:isCompact ? "0.68rem" : "0.78rem", fontFamily:"monospace", color:panelMuted, letterSpacing:"0.08em" }}>/100</span>
        </div>
      </div>

      {/* ── EEG BRAINWAVE STRIP ── */}
      <div style={{ marginTop:"0.05rem", background:panelSurface, borderRadius:"13px",
        border:`1px solid ${panelBorder}`, padding:"0.26rem 0.55rem",
        overflow:"hidden", position:"relative", zIndex:2 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"0.18rem" }}>
          <span style={{ fontSize:isCompact ? "0.56rem" : "0.64rem", fontFamily:"monospace", color:panelMuted, letterSpacing:"0.12em", textTransform:"uppercase" }}>
            EEG · Stress Oscillation
          </span>
          <motion.span animate={{ opacity:[1, 0.3, 1] }} transition={{ duration:1, repeat:Infinity }}
            style={{ fontSize:isCompact ? "0.56rem" : "0.64rem", fontFamily:"monospace", color:tier.color }}>
            ● LIVE
          </motion.span>
        </div>
        <svg width="100%" height="32" viewBox="0 0 540 46" preserveAspectRatio="none">
          <defs>
            <linearGradient id="eegGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%"   stopColor={tier.color} stopOpacity="0"/>
              <stop offset="12%"  stopColor={tier.color} stopOpacity="1"/>
              <stop offset="88%"  stopColor={tier.color} stopOpacity="1"/>
              <stop offset="100%" stopColor={tier.color} stopOpacity="0"/>
            </linearGradient>
          </defs>
          <path d={generateWave(stressLevel, 540, 46, waveSeed - 0.6)}
            fill="none" stroke={tier.color} strokeWidth="1" opacity="0.12" strokeLinecap="round" />
          <path d={generateWave(stressLevel, 540, 46, waveSeed)}
            fill="none" stroke="url(#eegGrad)" strokeWidth="1.8" strokeLinecap="round" />
          <line x1="0" y1="23" x2="540" y2="23" stroke="rgba(40,68,94,0.08)" strokeWidth="1" strokeDasharray="3 3"/>
        </svg>
      </div>

      {/* ── 5 TIER PILLS ── */}
      <div style={{ display:"flex", justifyContent:"space-between", marginTop:"0.32rem",
        gap:isCompact ? "0.08rem" : "0.18rem", position:"relative", zIndex:2, padding:isCompact ? "0.24rem 0.22rem" : "0.28rem 0.34rem",
        background:panelSurface, borderRadius:"13px",
        border:`1px solid ${panelBorder}`}}>
        {TIERS.map((t, i) => {
          const active = stressLevel >= t.min && stressLevel <= t.max;
          return (
            <div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:"0.18rem" }}>
              <motion.div animate={{
                background: active ? t.color : "transparent",
                boxShadow: active ? `0 0 10px ${t.glow}` : "none",
                scale: active ? 1.25 : 1,
              }} transition={{ duration:0.4 }} style={{
                width:7, height:7, borderRadius:"50%",
                border:`2px solid ${active ? t.color : "rgba(255,255,255,0.12)"}`,
                transition:"border-color 0.4s",
              }} />
              <span style={{
                fontSize:isCompact ? "0.42rem" : "0.5rem", fontFamily:"monospace", textTransform:"uppercase",
                color: active ? t.color : panelFaint,
                letterSpacing:"0.04em", textAlign:"center", fontWeight: active ? 700 : 400,
                transition:"color 0.4s",
              }}>{t.shortLabel}</span>
            </div>
          );
        })}
      </div>

      {/* ── SLIDER ── */}
      {externalScore === null && (
        <div style={{ marginTop:"0.42rem", position:"relative", zIndex:2 }}>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"0.24rem" }}>
            <span style={{ fontSize:isCompact ? "0.56rem" : "0.64rem", fontFamily:"monospace", color:panelMuted, letterSpacing:"0.1em" }}>CALM</span>
            <span style={{ fontSize:isCompact ? "0.56rem" : "0.64rem", fontFamily:"monospace", color:panelMuted, letterSpacing:"0.1em" }}>CRITICAL</span>
          </div>
          <input type="range" min="0" max="100" value={stressLevel}
            onChange={e => setStressLevel(Number(e.target.value))}
            style={{ width:"100%", height:"5px", borderRadius:"99px",
              appearance:"none", outline:"none", cursor:"pointer",
              background:`linear-gradient(to right, ${tier.color} ${stressLevel}%, rgba(40,68,94,0.08) ${stressLevel}%)`,
              accentColor: tier.color }} />
          <p style={{ textAlign:"center", fontSize:"0.64rem", fontFamily:"monospace",
            color:panelMuted, marginTop:"0.2rem", letterSpacing:"0.08em" }}>
            DRAG TO EXPLORE STRESS STATES
          </p>
        </div>
      )}

      {externalScore !== null && (
        <motion.p initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.9 }}
          style={{ textAlign:"center", fontSize:isCompact ? "0.54rem" : "0.62rem", fontFamily:"monospace",
            color:panelMuted, marginTop:"0.7rem", letterSpacing:"0.1em",
            position:"relative", zIndex:2 }}>
          ↑ Visualizer updated from your assessment · scroll down for your personalized solution
        </motion.p>
      )}
    </div>
  );
}
