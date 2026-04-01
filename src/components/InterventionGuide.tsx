"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";

// ── Intervention tiers from stress_intervention_guide.txt ───────────────────

interface Tier {
  range: string;
  label: string;
  color: string;
  glowColor: string;
  bgGrad: string;
  sound: string;
  soundExample: string;
  visual: string;
  visualExample: string;
  breathingPattern: string;
  breathingRhythm: string;
  advice: string[];
}

const TIERS: Tier[] = [
  {
    range: "0–19",
    label: "Minimal Stress",
    color: "#38bdf8",
    glowColor: "rgba(56,189,248,0.35)",
    bgGrad: "linear-gradient(135deg, rgba(56,189,248,0.12), rgba(20,184,166,0.08))",
    sound: "Light nature sounds",
    soundExample: "Morning forest ambience – birds, wind, soft water",
    visual: "Soft, bright, stable visuals",
    visualExample: "Blue sky, slow clouds, calm landscapes",
    breathingPattern: "Slow natural breathing",
    breathingRhythm: "Inhale 4s · Exhale 4s",
    advice: ["You're safe. This feeling will pass.", "Stay present and relaxed."],
  },
  {
    range: "20–39",
    label: "Mild Stress",
    color: "#4ade80",
    glowColor: "rgba(74,222,128,0.35)",
    bgGrad: "linear-gradient(135deg, rgba(74,222,128,0.12), rgba(56,189,248,0.08))",
    sound: "Gentle rhythmic sounds",
    soundExample: "Ocean waves, light rain, soft instrumental",
    visual: "Smooth flowing visuals",
    visualExample: "Water waves, slow particles, soft blue/green tones",
    breathingPattern: "Controlled breathing",
    breathingRhythm: "Inhale 4s · Exhale 5s",
    advice: ["Slow down your breathing.", "Focus on one thing at a time."],
  },
  {
    range: "40–59",
    label: "Moderate Stress",
    color: "#facc15",
    glowColor: "rgba(250,204,21,0.35)",
    bgGrad: "linear-gradient(135deg, rgba(250,204,21,0.12), rgba(74,222,128,0.06))",
    sound: "Guided breathing audio, low ambient tones",
    soundExample: "Soft guided meditation, low-frequency hum",
    visual: "Focused visuals",
    visualExample: "Expanding / contracting circle synced to breath",
    breathingPattern: "Guided breathing",
    breathingRhythm: "Inhale 4s · Hold 2s · Exhale 6s",
    advice: ["You are not in danger.", "This feeling is temporary."],
  },
  {
    range: "60–79",
    label: "High Stress",
    color: "#fb923c",
    glowColor: "rgba(251,146,60,0.35)",
    bgGrad: "linear-gradient(135deg, rgba(251,146,60,0.12), rgba(250,204,21,0.06))",
    sound: "Deep grounding sounds",
    soundExample: "Low bass hum, heartbeat, brown noise",
    visual: "Minimal visuals",
    visualExample: "Dark background with slow pulsing light",
    breathingPattern: "Slow deep breathing",
    breathingRhythm: "Inhale 4s · Exhale 7s",
    advice: ["Focus only on your breathing.", "You are safe right now."],
  },
  {
    range: "80–100",
    label: "Severe Stress",
    color: "#f87171",
    glowColor: "rgba(248,113,113,0.35)",
    bgGrad: "linear-gradient(135deg, rgba(248,113,113,0.15), rgba(251,146,60,0.06))",
    sound: "Very simple repetitive sounds",
    soundExample: "Slow heartbeat, soft voice guidance",
    visual: "Very minimal visuals",
    visualExample: "Single dim pulsing light, dark background",
    breathingPattern: "Very slow breathing",
    breathingRhythm: "Inhale 4s · Exhale 8s",
    advice: ["Stay here. Breathe slowly.", "You are not alone.", "This will pass."],
  },
];

function getTier(score: number): Tier {
  if (score <= 19) return TIERS[0];
  if (score <= 39) return TIERS[1];
  if (score <= 59) return TIERS[2];
  if (score <= 79) return TIERS[3];
  return TIERS[4];
}

// ── Animated Breathing Circle ─────────────────────────────────────────────────

function BreathingCircle({ tier }: { tier: Tier }) {
  const [phase, setPhase] = useState<"inhale" | "hold" | "exhale">("inhale");
  const [seconds, setSeconds] = useState(4);

  // Parse rhythm: "Inhale 4s · Hold 2s · Exhale 6s" or "Inhale 4s · Exhale 5s"
  const parts = tier.breathingRhythm.split("·").map((s) => s.trim());
  const inhaleTime = parseInt(parts[0]?.match(/\d+/)?.[0] ?? "4");
  const holdTime = parts[1]?.toLowerCase().includes("hold")
    ? parseInt(parts[1]?.match(/\d+/)?.[0] ?? "0")
    : 0;
  const exhaleTime = parseInt(parts[parts.length - 1]?.match(/\d+/)?.[0] ?? "4");

  useEffect(() => {
    let timer: NodeJS.Timeout;
    const tick = (ph: "inhale" | "hold" | "exhale", remaining: number) => {
      setPhase(ph);
      setSeconds(remaining);
      if (remaining > 1) {
        timer = setTimeout(() => tick(ph, remaining - 1), 1000);
      } else {
        // Advance phase
        if (ph === "inhale") {
          if (holdTime > 0) {
            timer = setTimeout(() => tick("hold", holdTime), 1000);
          } else {
            timer = setTimeout(() => tick("exhale", exhaleTime), 1000);
          }
        } else if (ph === "hold") {
          timer = setTimeout(() => tick("exhale", exhaleTime), 1000);
        } else {
          timer = setTimeout(() => tick("inhale", inhaleTime), 1000);
        }
      }
    };
    tick("inhale", inhaleTime);
    return () => clearTimeout(timer);
  }, [tier]);

  const scale =
    phase === "inhale" ? [1, 1.35] : phase === "hold" ? [1.35, 1.35] : [1.35, 1];
  const duration =
    phase === "inhale" ? inhaleTime : phase === "hold" ? holdTime : exhaleTime;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
      <motion.div
        animate={{ scale }}
        transition={{ duration, ease: "easeInOut" }}
        style={{
          width: "100px",
          height: "100px",
          borderRadius: "50%",
          background: `radial-gradient(circle, ${tier.color}44 0%, ${tier.color}11 100%)`,
          border: `2px solid ${tier.color}66`,
          boxShadow: `0 0 30px ${tier.glowColor}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span style={{ color: tier.color, fontWeight: 700, fontSize: "1.4rem", fontFamily: "monospace" }}>
          {seconds}
        </span>
      </motion.div>
      <span style={{ color: tier.color, fontSize: "0.85rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", fontFamily: "monospace" }}>
        {phase}
      </span>
    </div>
  );
}

// ── InfoCard helper ───────────────────────────────────────────────────────────

function InfoCard({ icon, title, main, sub, color }: { icon: string; title: string; main: string; sub: string; color: string }) {
  return (
    <div style={{
      background: "rgba(255,255,255,0.04)",
      border: `1px solid ${color}22`,
      borderRadius: "14px",
      padding: "1.25rem",
    }}>
      <div style={{ fontSize: "1.4rem", marginBottom: "0.5rem" }}>{icon}</div>
      <p style={{ fontSize: "0.7rem", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.4rem" }}>{title}</p>
      <p style={{ color: "#e2e8f0", fontWeight: 600, fontSize: "0.9rem", marginBottom: "0.25rem" }}>{main}</p>
      <p style={{ color: "#64748b", fontSize: "0.8rem", lineHeight: 1.5 }}>{sub}</p>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

interface InterventionGuideProps {
  score: number;
  onClose: () => void;
  onRetake: () => void;
}

export default function InterventionGuide({ score, onClose, onRetake }: InterventionGuideProps) {
  const tier = getTier(score);

  return (
    <motion.div
      id="intervention-guide-modal"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
        background: "rgba(15, 23, 42, 0.8)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
      }}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 30 }}
        transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
        style={{
          width: "100%",
          maxWidth: "680px",
          background: "rgba(15, 23, 42, 0.97)",
          border: `1px solid ${tier.color}33`,
          borderRadius: "24px",
          padding: "2.5rem",
          boxShadow: `0 0 80px ${tier.glowColor}, 0 40px 80px rgba(0,0,0,0.5)`,
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "2rem" }}>
          <div>
            <p style={{ fontSize: "0.7rem", fontFamily: "monospace", color: tier.color, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "0.4rem" }}>
              Stress Score · {score} / 100
            </p>
            <h2 style={{ color: "#f1f5f9", fontSize: "1.6rem", fontWeight: 800, margin: 0 }}>
              {tier.label}
            </h2>
            <p style={{ color: "#64748b", fontSize: "0.85rem", marginTop: "0.25rem" }}>
              Range: {tier.range}
            </p>
          </div>
          <button
            id="intervention-close-btn"
            onClick={onClose}
            style={{ background: "none", border: "none", cursor: "pointer", color: "#64748b", fontSize: "1.5rem", lineHeight: 1 }}
          >
            ✕
          </button>
        </div>

        {/* Score Bar */}
        <div style={{ height: "6px", background: "rgba(255,255,255,0.06)", borderRadius: "99px", marginBottom: "2rem", overflow: "hidden" }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${score}%` }}
            transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
            style={{ height: "100%", background: `linear-gradient(90deg, #38bdf8, ${tier.color})`, borderRadius: "99px" }}
          />
        </div>

        {/* Breathing Exercise */}
        <div style={{
          background: tier.bgGrad,
          border: `1px solid ${tier.color}22`,
          borderRadius: "18px",
          padding: "2rem",
          marginBottom: "1.5rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "0.75rem",
        }}>
          <p style={{ color: "#94a3b8", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.5rem" }}>
            Live Breathing Guide
          </p>
          <BreathingCircle tier={tier} />
          <p style={{ color: "#94a3b8", fontSize: "0.85rem", textAlign: "center", marginTop: "0.5rem" }}>
            {tier.breathingPattern} · <span style={{ color: tier.color }}>{tier.breathingRhythm}</span>
          </p>
        </div>

        {/* Info Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.5rem" }}>
          <InfoCard icon="🎵" title="Recommended Sound" main={tier.sound} sub={tier.soundExample} color={tier.color} />
          <InfoCard icon="👁️" title="Visual Environment" main={tier.visual} sub={tier.visualExample} color={tier.color} />
        </div>

        {/* Advice */}
        <div style={{
          background: "rgba(255,255,255,0.03)",
          border: `1px solid ${tier.color}22`,
          borderRadius: "14px",
          padding: "1.5rem",
          marginBottom: "2rem",
        }}>
          <p style={{ color: "#94a3b8", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "1rem" }}>
            💬 Guidance for You
          </p>
          {tier.advice.map((line, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + i * 0.15 }}
              style={{ color: "#e2e8f0", fontSize: "1rem", lineHeight: 1.7, fontWeight: i === 0 ? 700 : 400 }}
            >
              {line}
            </motion.p>
          ))}
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
          <button
            id="intervention-retake-btn"
            onClick={onRetake}
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1.5px solid rgba(255,255,255,0.12)",
              borderRadius: "99px",
              color: "#94a3b8",
              padding: "0.75rem 1.75rem",
              cursor: "pointer",
              fontSize: "0.9rem",
              fontWeight: 600,
            }}
          >
            ↺ Retake Survey
          </button>
          <motion.button
            id="intervention-done-btn"
            onClick={onClose}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            style={{
              background: `linear-gradient(135deg, ${tier.color}, ${tier.color}cc)`,
              border: "none",
              borderRadius: "99px",
              color: "#0f172a",
              padding: "0.75rem 2rem",
              cursor: "pointer",
              fontSize: "0.95rem",
              fontWeight: 700,
            }}
          >
            Done ✓
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}
