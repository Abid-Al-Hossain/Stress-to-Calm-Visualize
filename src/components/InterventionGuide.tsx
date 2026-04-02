"use client";

import { motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";

type Method = "breathing" | "sound" | "visual" | "advice";
type SoundMode = "nature" | "ocean" | "guided" | "grounding" | "heartbeat";
type VisualMode = "sky" | "waves" | "circle" | "pulse" | "single";
type PhaseId = "inhale" | "hold" | "exhale";

interface PhaseStep {
  id: PhaseId;
  label: string;
  seconds: number;
  scale: number;
}

interface Tier {
  range: string;
  label: string;
  color: string;
  dimColor: string;
  glow: string;
  breathing: { name: string; summary: string; inhale: number; hold: number; exhale: number };
  sound: { name: string; summary: string; example: string; mode: SoundMode; tags: string[] };
  visual: { name: string; summary: string; example: string; mode: VisualMode; palette: string[]; dark: boolean; practice: string; focus: string; steps: string[]; scriptTitle: string; script: string[] };
  advice: { title: string; lines: string[]; focus: string; groundingName: string; groundingIntro: string; groundingSteps: string[] };
  support?: { title: string; text: string };
}

const TIERS: Tier[] = [
  { range: "0-19", label: "Minimal Stress", color: "#38bdf8", dimColor: "#0ea5e9", glow: "rgba(56,189,248,0.32)",
    breathing: { name: "Slow natural breathing", summary: "Inhale 4 seconds, exhale 4 seconds.", inhale: 4, hold: 0, exhale: 4 },
    sound: { name: "Light nature sounds", summary: "Birds, wind, and soft water.", example: "Morning forest ambience.", mode: "nature", tags: ["Birds", "Wind", "Soft water"] },
    visual: {
      name: "Soft, bright, stable visuals",
      summary: "Use a calm sky scene with slow clouds and stable shapes.",
      example: "Blue sky, slow clouds, calm landscapes.",
      mode: "sky",
      palette: ["#e0f2fe", "#bae6fd", "#7dd3fc", "#dbeafe", "#ffffff"],
      dark: false,
      practice: "Guided imagery",
      focus: "Picture a bright open sky and a safe calm landscape. Let the image feel spacious, slow, and steady rather than analytical.",
      steps: ["Sit comfortably and let your eyes soften or close.", "Imagine a blue sky with slow clouds and a peaceful open place beneath it.", "Stay with the colors, light, and quiet feeling of the scene for about 1 to 3 minutes."],
      scriptTitle: "Guided imagery script",
      script: ["Settle into your seat and let your shoulders drop.", "Picture a wide blue sky, slow clouds, and a peaceful open place below.", "Stay with the light, the color, and the quiet until the scene feels easy to hold."],
    },
    advice: {
      title: "Stay present and relaxed",
      lines: ["You're safe. This feeling will pass.", "Stay present and relaxed."],
      focus: "Keep the breath easy and let your attention rest on one calm detail.",
      groundingName: "5-4-3-2-1 grounding",
      groundingIntro: "Use your senses to return attention to the present moment.",
      groundingSteps: ["Name 5 things you can see.", "Notice 4 things you can feel.", "Listen for 3 things you can hear.", "Find 2 things you can smell.", "Notice 1 thing you can taste, or imagine a familiar taste."],
    } },
  { range: "20-39", label: "Mild Stress", color: "#4ade80", dimColor: "#22c55e", glow: "rgba(74,222,128,0.32)",
    breathing: { name: "Controlled breathing", summary: "Inhale 4 seconds, exhale 5 seconds.", inhale: 4, hold: 0, exhale: 5 },
    sound: { name: "Gentle rhythmic sounds", summary: "Ocean waves, light rain, and soft instrumental tones.", example: "Ocean waves, light rain, soft instrumental.", mode: "ocean", tags: ["Ocean waves", "Light rain", "Soft instrumental"] },
    visual: {
      name: "Smooth flowing visuals",
      summary: "Use slow wave motion and blue-green drifting particles.",
      example: "Water waves, slow particles, soft blue/green tones.",
      mode: "waves",
      palette: ["#dcfce7", "#bbf7d0", "#99f6e4", "#67e8f9", "#4ade80"],
      dark: false,
      practice: "Guided imagery",
      focus: "Picture a calm shoreline or rain scene with smooth repeated motion. The goal is to imagine gentle flow, not scan the room.",
      steps: ["Close your eyes or keep a soft gaze on the scene.", "Imagine slow water, light rain, or a gentle shore moving at an even pace.", "Stay with one repeating visual rhythm until the body feels a little less rushed."],
      scriptTitle: "Guided imagery script",
      script: ["Let your eyes soften and imagine slow water or light rain.", "See the movement staying even and gentle, never fast or sharp.", "Keep following that calm rhythm until your body starts to slow with it."],
    },
    advice: {
      title: "Slow down and narrow your focus",
      lines: ["Slow down your breathing.", "Focus on one thing at a time."],
      focus: "Pick one sound, shape, or breath cycle and stay with that single anchor.",
      groundingName: "5-4-3-2-1 grounding",
      groundingIntro: "Use your senses one by one so the environment becomes clearer than the stress signal.",
      groundingSteps: ["Name 5 things you can see.", "Notice 4 things you can feel.", "Listen for 3 things you can hear.", "Find 2 things you can smell.", "Notice 1 thing you can taste, or imagine a familiar taste."],
    } },
  { range: "40-59", label: "Moderate Stress", color: "#facc15", dimColor: "#eab308", glow: "rgba(250,204,21,0.32)",
    breathing: { name: "Guided breathing", summary: "Inhale 4 seconds, hold 2 seconds, exhale 6 seconds.", inhale: 4, hold: 2, exhale: 6 },
    sound: { name: "Guided breathing audio and low ambient tones", summary: "Slow ambient tones with breath-paced cue pulses.", example: "Guided breathing audio, low ambient tones.", mode: "guided", tags: ["Guided cue", "Low ambient tones", "Breath pulse"] },
    visual: {
      name: "Focused visuals",
      summary: "Use one expanding and contracting circle as the visual anchor.",
      example: "Expanding/contracting circle.",
      mode: "circle",
      palette: ["#fefce8", "#fef08a", "#fde047", "#facc15", "#f8fafc"],
      dark: false,
      practice: "Focused-attention visual meditation",
      focus: "Choose one visual object and keep returning your attention to it whenever the mind wanders. The goal here is stable visual focus, not scene-building.",
      steps: ["Keep your eyes on the center point or ring.", "When attention drifts, notice it and gently return to the same visual object.", "Stay with the chosen point for 1 to 3 minutes, aiming for steadier attention rather than vivid imagery."],
      scriptTitle: "Focused-attention prompt",
      script: ["Choose the center point as your only visual object.", "If your attention drifts, release the distraction and come back to the point.", "Keep returning to the same object until the mind feels less scattered."],
    },
    advice: {
      title: "Reduce the alarm signal",
      lines: ["You are not in danger.", "This feeling is temporary."],
      focus: "Let the circle or breath cue lead. You do not need to think ahead right now.",
      groundingName: "5-4-3-2-1 grounding",
      groundingIntro: "Move through the senses slowly so your attention returns to the room, not the alarm feeling.",
      groundingSteps: ["Name 5 things you can see.", "Notice 4 things you can feel.", "Listen for 3 things you can hear.", "Find 2 things you can smell.", "Notice 1 thing you can taste, or imagine a familiar taste."],
    } },
  { range: "60-79", label: "High Stress", color: "#fb923c", dimColor: "#f97316", glow: "rgba(251,146,60,0.34)",
    breathing: { name: "Slow deep breathing", summary: "Inhale 4 seconds, exhale 7 seconds.", inhale: 4, hold: 0, exhale: 7 },
    sound: { name: "Deep grounding sounds", summary: "Low bass hum, heartbeat, and brown noise.", example: "Low bass hum, heartbeat, brown noise.", mode: "grounding", tags: ["Bass hum", "Heartbeat", "Brown noise"] },
    visual: {
      name: "Minimal visuals",
      summary: "Reduce the scene to a dark background and one slow pulsing light.",
      example: "Dark background with slow pulsing light.",
      mode: "pulse",
      palette: ["#082f49", "#0f172a", "#1e293b", "#fb923c", "#fdba74"],
      dark: true,
      practice: "Soft-gaze fixation",
      focus: "Keep the visual field minimal and rest your eyes on one slow light. This reduces visual load and supports a calmer attentional rhythm.",
      steps: ["Use one dim pulsing light as the only point of focus.", "Keep your gaze soft rather than staring hard at it.", "If thoughts speed up, make the field smaller again and return to that one light."],
      scriptTitle: "Soft-gaze prompt",
      script: ["Rest your eyes on one gentle light.", "Let the rest of the scene stay quiet and unfocused.", "Each time your thoughts race, soften your gaze and return to the same light."],
    },
    advice: {
      title: "Make the task smaller",
      lines: ["Focus only on your breathing.", "You are safe right now."],
      focus: "One breath in, one breath out. Nothing else needs your attention right now.",
      groundingName: "3-3-3 grounding",
      groundingIntro: "When the body is very activated, shorten the grounding task and stay with the easiest sensory cues.",
      groundingSteps: ["Name 3 things you can see.", "Name 3 things you can hear.", "Move or touch 3 parts of your body, or 3 nearby surfaces."],
    } },
  { range: "80-100", label: "Severe Stress", color: "#f87171", dimColor: "#ef4444", glow: "rgba(248,113,113,0.36)",
    breathing: { name: "Very slow breathing", summary: "Inhale 4 seconds, exhale 8 seconds.", inhale: 4, hold: 0, exhale: 8 },
    sound: { name: "Very simple repetitive sounds", summary: "A slow heartbeat with very simple repeating cues.", example: "Slow heartbeat, soft voice guidance.", mode: "heartbeat", tags: ["Slow heartbeat", "Simple pulse", "Guidance cue"] },
    visual: {
      name: "Very minimal visuals",
      summary: "Keep only a single dim pulsing light on a dark background.",
      example: "Single dim pulsing light, dark background.",
      mode: "single",
      palette: ["#111827", "#1f2937", "#7f1d1d", "#b91c1c", "#fca5a5"],
      dark: true,
      practice: "Single-point visual anchor",
      focus: "Use the smallest possible visual target. The aim is not rich imagery but a single simple visual cue that is easy to return to.",
      steps: ["Focus on one dim point of light only.", "Do not add extra details or build a whole scene.", "If the visual anchor increases distress or does not help, stop and switch to the grounding method in Advice."],
      scriptTitle: "Single-point prompt",
      script: ["Stay with one point only.", "Do not make the picture bigger or more detailed.", "If the point stops helping, leave this method and use the grounding steps instead."],
    },
    advice: {
      title: "Stay with the simplest next cue",
      lines: ["Stay here. Breathe slowly.", "You are not alone.", "This will pass."],
      focus: "Use one slow breath and one small anchor. Do not try to solve everything at once.",
      groundingName: "Orientation grounding",
      groundingIntro: "Keep the questions simple and sensory so your attention returns to what is here right now.",
      groundingSteps: ["Tell yourself 1 thing you can see right now, 1 thing you can hear right now, and 1 thing you can touch or feel right now.", "If that helps, find 2 new things you can see, 2 you can hear, and 2 you can feel.", "Stop and get support if the exercise makes you more distressed or you do not feel safe."],
    },
    support: { title: "Need immediate support?", text: "If you feel unable to stay safe or the distress is overwhelming, call or text 988 now. If there is immediate danger, call emergency services right away." } },
];

const METHODS = [
  { id: "breathing" as Method, label: "Breathing", desc: "Follow the guide-prescribed breathing rhythm for your tier.", short: "BR" },
  { id: "sound" as Method, label: "Sound", desc: "Play a matching calming sound pattern for this stress level.", short: "SO" },
  { id: "visual" as Method, label: "Visual", desc: "Use guided imagery or visualization matched to this stress level.", short: "VI" },
  { id: "advice" as Method, label: "Advice", desc: "Use the guide prompts together with a sensory grounding sequence.", short: "AD" },
];

const CLOUDS = [
  { top: 34, left: -18, width: 92, delay: 0, duration: 24 },
  { top: 92, left: -10, width: 74, delay: 4, duration: 20 },
  { top: 136, left: -22, width: 112, delay: 8, duration: 28 },
];

const WAVE_BANDS = [
  { top: 122, height: 76, opacity: 0.28, duration: 14, delay: 0 },
  { top: 138, height: 82, opacity: 0.2, duration: 18, delay: 1.5 },
  { top: 154, height: 88, opacity: 0.16, duration: 22, delay: 3 },
];

const PARTICLES = [
  { x: 56, y: 48, size: 8, delay: 0 },
  { x: 104, y: 72, size: 10, delay: 0.6 },
  { x: 156, y: 54, size: 7, delay: 1.2 },
  { x: 214, y: 92, size: 9, delay: 1.8 },
  { x: 278, y: 66, size: 8, delay: 2.4 },
  { x: 332, y: 110, size: 11, delay: 3.0 },
  { x: 388, y: 82, size: 7, delay: 3.6 },
];

const CALM_ACCENT = "#63b3ed";
const CALM_ACCENT_DEEP = "#76c7b7";
const CALM_ACCENT_TEXT = "#4f87b9";
const CALM_BORDER = "rgba(99,179,237,0.18)";
const CALM_PANEL = "linear-gradient(180deg, rgba(255,255,255,0.84) 0%, rgba(240,249,255,0.96) 100%)";

function getTier(score: number) {
  if (score <= 19) return TIERS[0];
  if (score <= 39) return TIERS[1];
  if (score <= 59) return TIERS[2];
  if (score <= 79) return TIERS[3];
  return TIERS[4];
}

function getPhases(tier: Tier): PhaseStep[] {
  const steps: PhaseStep[] = [{ id: "inhale", label: "Inhale", seconds: tier.breathing.inhale, scale: 1.32 }];
  if (tier.breathing.hold > 0) steps.push({ id: "hold", label: "Hold", seconds: tier.breathing.hold, scale: 1.32 });
  steps.push({ id: "exhale", label: "Exhale", seconds: tier.breathing.exhale, scale: 1 });
  return steps;
}

function getBreathingTargets(tier: Tier) {
  const cycleSeconds = tier.breathing.inhale + tier.breathing.hold + tier.breathing.exhale;
  const startCycles = Math.ceil(180 / cycleSeconds);
  const steadyCycles = Math.ceil(300 / cycleSeconds);
  return { cycleSeconds, startCycles, steadyCycles };
}

function usePhases(phases: PhaseStep[], autoStart = false) {
  const [running, setRunning] = useState(autoStart);
  const [index, setIndex] = useState(0);
  const [remaining, setRemaining] = useState(phases[0]?.seconds ?? 0);
  const [cycles, setCycles] = useState(0);

  useEffect(() => {
    if (!running || phases.length === 0) return;
    const timer = window.setTimeout(() => {
      if (remaining > 1) {
        setRemaining((value) => value - 1);
        return;
      }
      const next = (index + 1) % phases.length;
      if (next === 0) setCycles((value) => value + 1);
      setIndex(next);
      setRemaining(phases[next].seconds);
    }, 1000);
    return () => window.clearTimeout(timer);
  }, [index, phases, remaining, running]);

  return {
    running,
    setRunning,
    phase: phases[index],
    remaining,
    cycles,
    reset: () => {
      setRunning(autoStart);
      setIndex(0);
      setRemaining(phases[0]?.seconds ?? 0);
      setCycles(0);
    },
  };
}

function createAudio(mode: SoundMode): { stop: () => void } | null {
  if (typeof window === "undefined") return null;
  try {
    const AudioCtor = window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtor) return null;
    const ctx = new AudioCtor();
    const master = ctx.createGain();
    master.gain.setValueAtTime(0, ctx.currentTime);
    master.gain.linearRampToValueAtTime(0.28, ctx.currentTime + 0.6);
    master.connect(ctx.destination);
    const timers: number[] = [];
    const nodes: Array<{ stop?: () => void; disconnect?: () => void }> = [master];

    const noise = (seconds: number, brown = false) => {
      const buffer = ctx.createBuffer(1, seconds * ctx.sampleRate, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      let last = 0;
      for (let i = 0; i < data.length; i += 1) {
        if (brown) {
          const white = Math.random() * 2 - 1;
          last = (last + 0.02 * white) / 1.02;
          data[i] = last * 4.5;
        } else {
          data[i] = Math.random() * 2 - 1;
        }
      }
      return buffer;
    };

    const loopNoise = (buffer: AudioBuffer, connect: (src: AudioBufferSourceNode) => void) => {
      const src = ctx.createBufferSource();
      src.buffer = buffer;
      src.loop = true;
      connect(src);
      src.start();
      nodes.push(src);
    };

    const oneshot = (frequency: number, duration: number, gainValue: number, type: OscillatorType) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.value = frequency;
      gain.gain.setValueAtTime(0.0001, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(gainValue, ctx.currentTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(master);
      osc.start();
      osc.stop(ctx.currentTime + duration + 0.05);
      nodes.push(osc, gain);
    };

    const heartbeat = (bpm: number, gainValue: number) => {
      const beatGain = ctx.createGain();
      const beatOsc = ctx.createOscillator();
      beatOsc.type = "sine";
      beatOsc.frequency.value = 82;
      beatGain.gain.value = 0;
      beatOsc.connect(beatGain);
      beatGain.connect(master);
      beatOsc.start();
      nodes.push(beatOsc, beatGain);
      let at = ctx.currentTime + 0.2;
      for (let i = 0; i < 90; i += 1) {
        beatGain.gain.setValueAtTime(0, at);
        beatGain.gain.linearRampToValueAtTime(gainValue, at + 0.03);
        beatGain.gain.exponentialRampToValueAtTime(0.0001, at + 0.16);
        beatGain.gain.setValueAtTime(0, at + 0.22);
        beatGain.gain.linearRampToValueAtTime(gainValue * 0.7, at + 0.26);
        beatGain.gain.exponentialRampToValueAtTime(0.0001, at + 0.38);
        at += 60 / bpm;
      }
    };

    if (mode === "nature") {
      const wind = ctx.createBiquadFilter();
      wind.type = "highpass";
      wind.frequency.value = 1200;
      const windGain = ctx.createGain();
      windGain.gain.value = 0.06;
      wind.connect(windGain);
      windGain.connect(master);
      nodes.push(wind, windGain);
      loopNoise(noise(4), (src) => src.connect(wind));

      const water = ctx.createBiquadFilter();
      water.type = "bandpass";
      water.frequency.value = 380;
      const waterGain = ctx.createGain();
      waterGain.gain.value = 0.08;
      water.connect(waterGain);
      waterGain.connect(master);
      nodes.push(water, waterGain);
      loopNoise(noise(3), (src) => src.connect(water));
      timers.push(window.setInterval(() => oneshot(1400 + Math.random() * 900, 0.28, 0.04, "sine"), 2600));
    } else if (mode === "ocean") {
      const ocean = ctx.createBiquadFilter();
      ocean.type = "bandpass";
      ocean.frequency.value = 320;
      const oceanGain = ctx.createGain();
      oceanGain.gain.value = 0.16;
      ocean.connect(oceanGain);
      oceanGain.connect(master);
      nodes.push(ocean, oceanGain);
      loopNoise(noise(5), (src) => src.connect(ocean));
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.type = "sine";
      lfo.frequency.value = 0.12;
      lfoGain.gain.value = 0.08;
      lfo.connect(lfoGain);
      lfoGain.connect(oceanGain.gain);
      lfo.start();
      nodes.push(lfo, lfoGain);
      const rain = ctx.createBiquadFilter();
      rain.type = "highpass";
      rain.frequency.value = 2600;
      const rainGain = ctx.createGain();
      rainGain.gain.value = 0.045;
      rain.connect(rainGain);
      rainGain.connect(master);
      nodes.push(rain, rainGain);
      loopNoise(noise(2), (src) => src.connect(rain));
    } else if (mode === "guided") {
      const drone = ctx.createOscillator();
      const droneGain = ctx.createGain();
      drone.type = "sine";
      drone.frequency.value = 110;
      droneGain.gain.value = 0.09;
      drone.connect(droneGain);
      droneGain.connect(master);
      drone.start();
      nodes.push(drone, droneGain);
      timers.push(window.setInterval(() => oneshot(220, 0.24, 0.06, "sine"), 6000));
    } else if (mode === "grounding") {
      const brown = ctx.createBiquadFilter();
      brown.type = "lowpass";
      brown.frequency.value = 240;
      const brownGain = ctx.createGain();
      brownGain.gain.value = 0.16;
      brown.connect(brownGain);
      brownGain.connect(master);
      nodes.push(brown, brownGain);
      loopNoise(noise(5, true), (src) => src.connect(brown));
      const bass = ctx.createOscillator();
      const bassGain = ctx.createGain();
      bass.type = "sine";
      bass.frequency.value = 55;
      bassGain.gain.value = 0.08;
      bass.connect(bassGain);
      bassGain.connect(master);
      bass.start();
      nodes.push(bass, bassGain);
      heartbeat(60, 0.14);
    } else {
      heartbeat(56, 0.18);
      const pad = ctx.createOscillator();
      const padGain = ctx.createGain();
      pad.type = "sine";
      pad.frequency.value = 40;
      padGain.gain.value = 0.035;
      pad.connect(padGain);
      padGain.connect(master);
      pad.start();
      nodes.push(pad, padGain);
    }

    return {
      stop: () => {
        timers.forEach((timer) => window.clearInterval(timer));
        master.gain.linearRampToValueAtTime(0.0001, ctx.currentTime + 0.35);
        window.setTimeout(() => {
          nodes.forEach((node) => {
            try { node.stop?.(); } catch {}
            try { node.disconnect?.(); } catch {}
          });
          void ctx.close();
        }, 450);
      },
    };
  } catch {
    return null;
  }
}

function BreathingGuide({ tier }: { tier: Tier }) {
  const phases = useMemo(() => getPhases(tier), [tier]);
  const targets = useMemo(() => getBreathingTargets(tier), [tier]);
  const { running, setRunning, phase, remaining, cycles, reset } = usePhases(phases);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1.1rem", padding: "0.4rem 0 0.25rem" }}>
      <motion.div
        animate={{ scale: running ? phase.scale : 1 }}
        transition={{ duration: phase.seconds, ease: "easeInOut" }}
        style={{ width: "150px", height: "150px", borderRadius: "50%", border: `2px solid ${CALM_ACCENT}88`, background: `radial-gradient(circle, rgba(99,179,237,0.18) 0%, rgba(255,255,255,0.7) 100%)`, boxShadow: "0 0 42px rgba(99,179,237,0.22)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}
      >
        <span style={{ fontSize: "1.9rem", fontWeight: 800, color: CALM_ACCENT_TEXT, fontFamily: "monospace", lineHeight: 1 }}>{remaining}</span>
        <span style={{ fontSize: "0.82rem", color: "#546e7a", marginTop: "0.3rem" }}>{running ? phase.label : "Ready"}</span>
      </motion.div>

      <div style={{ fontSize: "1rem", fontWeight: 700, color: CALM_ACCENT_TEXT }}>{tier.breathing.name}</div>

      <div style={{ display: "flex", gap: "0.65rem", justifyContent: "center", flexWrap: "wrap" }}>
        {phases.map((step) => {
          const active = step.id === phase.id && running;
          return (
            <div key={step.id} style={{ padding: "0.55rem 0.9rem", borderRadius: "12px", minWidth: "78px", background: active ? "rgba(227,242,253,0.82)" : "rgba(255,255,255,0.56)", border: `1px solid ${active ? CALM_ACCENT : "rgba(90,155,212,0.18)"}`, textAlign: "center" }}>
              <div style={{ fontSize: "1rem", fontWeight: 700, color: active ? CALM_ACCENT_TEXT : "#455a64" }}>{step.seconds}s</div>
              <div style={{ fontSize: "0.72rem", color: "#78909c", textTransform: "uppercase", letterSpacing: "0.08em" }}>{step.label}</div>
            </div>
          );
        })}
      </div>

      <div style={{ display: "flex", gap: "0.65rem", justifyContent: "center", flexWrap: "wrap" }}>
        <button onClick={() => setRunning((value) => !value)} style={{ background: `linear-gradient(135deg, ${CALM_ACCENT}, ${CALM_ACCENT_DEEP})`, border: "none", borderRadius: "999px", color: "#fff", padding: "0.72rem 1.4rem", cursor: "pointer", fontWeight: 700, boxShadow: "0 8px 24px rgba(99,179,237,0.24)" }}>
          {running ? "Pause breathing" : "Start breathing"}
        </button>
        <button onClick={reset} style={{ background: "rgba(255,255,255,0.66)", border: "1px solid rgba(90,155,212,0.22)", borderRadius: "999px", color: "#546e7a", padding: "0.72rem 1.2rem", cursor: "pointer", fontWeight: 600 }}>
          Reset
        </button>
      </div>

      <div style={{ display: "grid", gap: "0.3rem", justifyItems: "center", textAlign: "center" }}>
        <div style={{ fontSize: "0.88rem", color: "#78909c" }}>Cycle {cycles + 1}</div>
        <div style={{ fontSize: "0.84rem", color: "#546e7a", lineHeight: 1.6 }}>
          Suggested goal: {targets.startCycles} cycles to start
          <span style={{ color: "#90a4ae" }}> ({Math.ceil((targets.startCycles * targets.cycleSeconds) / 60)} min)</span>
        </div>
        <div style={{ fontSize: "0.8rem", color: "#78909c", lineHeight: 1.55 }}>
          Longer practice: about {targets.steadyCycles} cycles
          <span style={{ color: "#90a4ae" }}> ({Math.ceil((targets.steadyCycles * targets.cycleSeconds) / 60)} min)</span>
        </div>
      </div>

      <div style={{ width: "100%", maxWidth: "430px", background: "rgba(255,255,255,0.58)", borderRadius: "16px", padding: "1rem 1.15rem", border: "1px solid rgba(90,155,212,0.15)" }}>
        <p style={{ margin: "0 0 0.45rem", color: "#37474f", fontSize: "0.92rem", lineHeight: 1.7 }}>{tier.breathing.summary}</p>
        <p style={{ margin: 0, color: "#607d8b", fontSize: "0.84rem", lineHeight: 1.65 }}>
          This target is based on a short 3-minute start and a steadier 5-minute practice using this exact breathing rhythm.
        </p>
      </div>

      <div style={{ width: "100%", maxWidth: "430px", background: "rgba(227,242,253,0.62)", borderLeft: `3px solid ${CALM_ACCENT}`, borderRadius: "0 12px 12px 0", padding: "0.9rem 1rem" }}>
        <p style={{ margin: 0, color: "#455a64", fontSize: "0.86rem", lineHeight: 1.7 }}>
          Breathe gently and stay within a comfortable range. If the rhythm feels too strong, return to a normal easy breath and restart when ready.
        </p>
      </div>
    </div>
  );
}
function SoundGuide({ tier }: { tier: Tier }) {
  const [active, setActive] = useState(false);
  const audioRef = useRef<{ stop: () => void } | null>(null);
  const phases = useMemo(() => getPhases(tier), [tier]);
  const { phase } = usePhases(phases, active && (tier.sound.mode === "guided" || tier.sound.mode === "heartbeat"));

  useEffect(() => () => {
    audioRef.current?.stop();
    audioRef.current = null;
  }, []);

  const toggle = () => {
    if (active) {
      audioRef.current?.stop();
      audioRef.current = null;
      setActive(false);
      return;
    }
    audioRef.current = createAudio(tier.sound.mode);
    setActive(true);
  };

  const bars = Array.from({ length: 26 }, (_, index) => {
    const base = tier.sound.mode === "heartbeat" ? [0.18, 0.32, 0.16, 0.12] : tier.sound.mode === "grounding" ? [0.75, 0.6, 0.8, 0.68] : tier.sound.mode === "guided" ? [0.48, 0.62, 0.54, 0.7] : tier.sound.mode === "ocean" ? [0.36, 0.52, 0.44, 0.6] : [0.24, 0.3, 0.28, 0.34];
    return base[index % base.length];
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
      <div onClick={toggle} style={{ width: "100%", maxWidth: "440px", minHeight: "108px", borderRadius: "18px", padding: "1rem", cursor: "pointer", display: "flex", flexDirection: "column", gap: "0.85rem", justifyContent: "center", background: "linear-gradient(180deg, rgba(255,255,255,0.8) 0%, rgba(240,249,255,0.95) 100%)", border: `1px solid ${CALM_BORDER}` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "0.75rem" }}>
          <div>
            <div style={{ fontSize: "0.76rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "#607d8b" }}>{tier.sound.name}</div>
            <div style={{ fontSize: "0.9rem", fontWeight: 700, color: "#2c3e50" }}>{active ? "Audio is playing" : "Tap to play"}</div>
          </div>
          <div style={{ color: CALM_ACCENT_TEXT, fontWeight: 700 }}>{active ? "Stop" : "Play"}</div>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "4px", minHeight: "40px" }}>
          {bars.map((value, index) => (
            <div
              key={index}
              style={{
                width: "8px",
                height: `${42 * (active ? Math.min(value * 1.35, 1) : value * 0.6)}px`,
                borderRadius: "999px",
                opacity: active ? 0.9 : 0.28,
                transition: "height 0.18s ease-out, opacity 0.18s ease-out",
                background: `linear-gradient(to top, ${CALM_ACCENT_DEEP}, ${CALM_ACCENT})`,
              }}
            />
          ))}
        </div>

        {(tier.sound.mode === "guided" || tier.sound.mode === "heartbeat") && active && (
          <div style={{ textAlign: "center", color: CALM_ACCENT_TEXT, fontWeight: 700, letterSpacing: "0.06em" }}>Cue: {phase.label}</div>
        )}
      </div>

      <div style={{ width: "100%", maxWidth: "430px", background: "rgba(255,255,255,0.58)", borderRadius: "16px", padding: "1rem 1.15rem", border: "1px solid rgba(90,155,212,0.15)" }}>
        <p style={{ margin: "0 0 0.45rem", fontWeight: 700, color: "#2c3e50" }}>{tier.sound.summary}</p>
        <p style={{ margin: "0 0 0.85rem", color: "#546e7a", fontSize: "0.9rem", lineHeight: 1.7 }}>Example: {tier.sound.example}</p>
        <div style={{ display: "flex", gap: "0.45rem", flexWrap: "wrap" }}>
          {tier.sound.tags.map((tag) => (
            <span key={tag} style={{ padding: "0.32rem 0.82rem", borderRadius: "999px", background: "rgba(227,242,253,0.82)", border: `1px solid ${CALM_BORDER}`, color: CALM_ACCENT_TEXT, fontWeight: 600, fontSize: "0.8rem" }}>{tag}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
function CircleFocus({ tier }: { tier: Tier }) {
  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "0.8rem" }}>
      <div style={{ width: "132px", height: "132px", borderRadius: "50%", border: `2px solid ${CALM_ACCENT}`, boxShadow: "0 0 34px rgba(99,179,237,0.18)", display: "flex", alignItems: "center", justifyContent: "center", background: "radial-gradient(circle, rgba(99,179,237,0.14) 0%, rgba(255,255,255,0.9) 100%)" }}>
        <div style={{ width: "72px", height: "72px", borderRadius: "50%", border: `2px solid ${CALM_ACCENT}88`, display: "flex", alignItems: "center", justifyContent: "center", background: "radial-gradient(circle, rgba(99,179,237,0.32) 0%, rgba(255,255,255,0.22) 100%)" }}>
          <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: CALM_ACCENT_TEXT, boxShadow: "0 0 14px rgba(99,179,237,0.24)" }} />
        </div>
      </div>
      <div style={{ textAlign: "center" }}>
        <div style={{ color: CALM_ACCENT_TEXT, fontWeight: 700 }}>Center / Ring / Edge</div>
        <div style={{ color: "#546e7a", fontSize: "0.88rem" }}>Use your eyes to move from the center outward, then back to the room.</div>
      </div>
    </div>
  );
}

function VisualGuide({ tier }: { tier: Tier }) {
  const background = tier.visual.mode === "sky"
    ? "linear-gradient(180deg, #dbeafe 0%, #eff6ff 58%, #d9f99d 100%)"
    : tier.visual.mode === "waves"
      ? "linear-gradient(180deg, #ecfeff 0%, #d1fae5 54%, #e0f2fe 100%)"
      : tier.visual.mode === "circle"
        ? "linear-gradient(180deg, #f8fbff 0%, #eef7fb 100%)"
        : tier.visual.mode === "pulse"
          ? "linear-gradient(180deg, #e5f0ff 0%, #edf7fb 58%, #dff5ee 100%)"
          : "linear-gradient(180deg, #edf4ff 0%, #f6fbff 56%, #e4f6f1 100%)";
  const visualAccent = tier.visual.mode === "pulse" || tier.visual.mode === "single" ? CALM_ACCENT_DEEP : CALM_ACCENT;
  const visualGlow = tier.visual.mode === "pulse" || tier.visual.mode === "single" ? "rgba(118,199,183,0.34)" : "rgba(99,179,237,0.24)";

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
      <div style={{ width: "100%", maxWidth: "440px", height: "220px", borderRadius: "20px", overflow: "hidden", position: "relative", border: `1px solid ${CALM_BORDER}`, background, boxShadow: "inset 0 1px 0 rgba(255,255,255,0.55)" }}>
        {tier.visual.mode === "sky" && (
          <>
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "56px", background: "linear-gradient(180deg, rgba(167,243,208,0.2) 0%, #bbf7d0 100%)" }} />
            <div
              style={{ position: "absolute", top: "28px", right: "38px", width: "52px", height: "52px", borderRadius: "50%", background: "rgba(255,255,255,0.55)", boxShadow: "0 0 38px rgba(255,255,255,0.55)" }}
            />
            {CLOUDS.map((cloud) => (
              <div
                key={cloud.top}
                style={{ position: "absolute", top: `${cloud.top}px`, left: `${Math.max(12, cloud.left + 36)}px`, width: `${cloud.width}px`, height: "28px", borderRadius: "999px", background: "rgba(255,255,255,0.78)", boxShadow: "0 8px 24px rgba(255,255,255,0.22)" }}
              />
            ))}
          </>
        )}

        {tier.visual.mode === "waves" && (
          <>
            {WAVE_BANDS.map((band) => (
              <div
                key={band.top}
                style={{ position: "absolute", top: `${band.top}px`, left: "-5%", width: "110%", height: `${band.height}px`, borderRadius: "50% 50% 0 0", background: `linear-gradient(180deg, rgba(56,189,248,${band.opacity}) 0%, rgba(74,222,128,0.06) 100%)` }}
              />
            ))}
            {PARTICLES.map((particle) => (
              <div
                key={`${particle.x}-${particle.y}`}
                style={{ position: "absolute", left: `${particle.x}px`, top: `${particle.y}px`, width: `${particle.size}px`, height: `${particle.size}px`, borderRadius: "50%", opacity: 0.55, background: particle.x % 2 === 0 ? "#67e8f9" : "#4ade80", boxShadow: "0 0 10px rgba(103,232,249,0.28)" }}
              />
            ))}
          </>
        )}

        {tier.visual.mode === "circle" && <CircleFocus tier={tier} />}

        {tier.visual.mode === "pulse" && (
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div
              style={{ width: "74px", height: "74px", borderRadius: "50%", background: `radial-gradient(circle, ${visualAccent} 0%, rgba(255,255,255,0) 72%)`, opacity: 0.72, boxShadow: `0 0 42px ${visualGlow}` }}
            />
          </div>
        )}

        {tier.visual.mode === "single" && (
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div
              style={{ width: "28px", height: "28px", borderRadius: "50%", background: visualAccent, opacity: 0.58, boxShadow: `0 0 34px ${visualGlow}` }}
            />
          </div>
        )}
      </div>

      <div style={{ width: "100%", maxWidth: "430px", background: CALM_PANEL, borderRadius: "16px", padding: "1rem 1.15rem", border: `1px solid ${CALM_BORDER}` }}>
        <p style={{ margin: "0 0 0.45rem", fontWeight: 700, color: "#2c3e50" }}>{tier.visual.name}</p>
        <p style={{ margin: "0 0 0.6rem", color: "#546e7a", fontSize: "0.9rem", lineHeight: 1.7 }}>{tier.visual.summary}</p>
        <p style={{ margin: "0 0 0.55rem", color: "#455a64", fontSize: "0.88rem", lineHeight: 1.6 }}>Example: {tier.visual.example}</p>
        <div style={{ padding: "0.85rem 0.95rem", borderRadius: "14px", background: "rgba(227,242,253,0.7)", border: `1px solid ${CALM_BORDER}`, marginBottom: "0.75rem" }}>
          <div style={{ color: CALM_ACCENT_TEXT, fontWeight: 700, marginBottom: "0.25rem" }}>{tier.visual.practice}</div>
          <div style={{ color: "#455a64", fontSize: "0.86rem", lineHeight: 1.65 }}>{tier.visual.focus}</div>
        </div>
        <div style={{ padding: "0.95rem 1rem", borderRadius: "16px", background: "rgba(255,255,255,0.82)", border: `1px solid ${CALM_BORDER}`, marginBottom: "0.75rem" }}>
          <div style={{ color: CALM_ACCENT_TEXT, fontWeight: 700, marginBottom: "0.45rem" }}>{tier.visual.scriptTitle}</div>
          <div style={{ display: "grid", gap: "0.55rem" }}>
            {tier.visual.script.map((line, index) => (
              <p key={line} style={{ margin: 0, color: "#37474f", fontSize: "0.92rem", lineHeight: 1.7 }}>
                {index + 1}. {line}
              </p>
            ))}
          </div>
        </div>
        <div style={{ display: "grid", gap: "0.55rem" }}>
          {tier.visual.steps.map((step, index) => (
            <div key={step} style={{ padding: "0.82rem 0.95rem", borderRadius: "14px", background: "rgba(255,255,255,0.78)", border: `1px solid ${CALM_BORDER}` }}>
              <div style={{ color: CALM_ACCENT_TEXT, fontWeight: 700, marginBottom: "0.2rem" }}>Practice note {index + 1}</div>
              <div style={{ color: "#37474f", fontSize: "0.88rem", lineHeight: 1.6 }}>{step}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
function AdviceGuide({ tier }: { tier: Tier }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem", width: "100%", maxWidth: "440px", margin: "0 auto" }}>
      <div style={{ background: CALM_PANEL, borderRadius: "18px", border: `1px solid ${CALM_BORDER}`, padding: "1.15rem 1.2rem" }}>
        <p style={{ margin: "0 0 0.45rem", fontSize: "0.76rem", textTransform: "uppercase", letterSpacing: "0.1em", color: CALM_ACCENT_TEXT }}>{tier.advice.title}</p>
        <div style={{ display: "grid", gap: "0.55rem" }}>
          {tier.advice.lines.map((line, index) => (
            <div key={line} style={{ padding: "0.8rem 0.95rem", borderRadius: "14px", background: index === 0 ? "rgba(227,242,253,0.78)" : "rgba(255,255,255,0.72)", border: `1px solid ${CALM_BORDER}` }}>
              <div style={{ color: CALM_ACCENT_TEXT, fontSize: "0.74rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.2rem" }}>
                Prompt {index + 1}
              </div>
              <div style={{ color: "#2c3e50", fontSize: "1rem", lineHeight: 1.55, fontWeight: 700 }}>
                {line}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: "rgba(227,242,253,0.62)", borderLeft: `3px solid ${CALM_ACCENT}`, borderRadius: "0 12px 12px 0", padding: "0.9rem 1rem" }}>
        <p style={{ margin: 0, color: "#455a64", fontSize: "0.88rem", lineHeight: 1.7 }}>{tier.advice.focus}</p>
      </div>

      <div style={{ background: CALM_PANEL, borderRadius: "18px", border: `1px solid ${CALM_BORDER}`, padding: "1rem 1.05rem" }}>
        <p style={{ margin: "0 0 0.35rem", color: CALM_ACCENT_TEXT, fontSize: "0.76rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em" }}>
          {tier.advice.groundingName}
        </p>
        <p style={{ margin: "0 0 0.75rem", color: "#546e7a", fontSize: "0.9rem", lineHeight: 1.7 }}>
          {tier.advice.groundingIntro}
        </p>
        <div style={{ display: "grid", gap: "0.6rem" }}>
          {tier.advice.groundingSteps.map((step, index) => (
            <div key={step} style={{ padding: "0.85rem 0.95rem", borderRadius: "14px", background: "rgba(255,255,255,0.78)", border: `1px solid ${CALM_BORDER}` }}>
              <div style={{ color: CALM_ACCENT_TEXT, fontWeight: 700, marginBottom: "0.2rem" }}>Grounding step {index + 1}</div>
              <div style={{ color: "#37474f", lineHeight: 1.6 }}>{step}</div>
            </div>
          ))}
        </div>
      </div>

      {tier.support && (
        <div style={{ background: "rgba(248,113,113,0.12)", borderRadius: "16px", border: "1px solid rgba(248,113,113,0.35)", padding: "1rem 1.1rem" }}>
          <p style={{ margin: "0 0 0.35rem", color: "#b91c1c", fontWeight: 700 }}>{tier.support.title}</p>
          <p style={{ margin: 0, color: "#7f1d1d", lineHeight: 1.7 }}>{tier.support.text}</p>
        </div>
      )}
    </div>
  );
}

interface InterventionGuideProps {
  score: number;
  onClose: () => void;
  onRetake: () => void;
}

export default function InterventionGuide({ score, onClose, onRetake }: InterventionGuideProps) {
  const tier = getTier(score);
  const [selected, setSelected] = useState<Method | null>(null);
  const [viewportWidth, setViewportWidth] = useState(1024);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    const previousOverscroll = document.body.style.overscrollBehavior;
    document.body.style.overflow = "hidden";
    document.body.style.overscrollBehavior = "none";
    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.style.overscrollBehavior = previousOverscroll;
    };
  }, []);

  useEffect(() => {
    const updateViewport = () => setViewportWidth(window.innerWidth);
    updateViewport();
    window.addEventListener("resize", updateViewport);
    return () => window.removeEventListener("resize", updateViewport);
  }, []);

  const isMobile = viewportWidth < 640;
  const isTablet = viewportWidth < 900;

  return (
    <motion.div id="intervention-guide-modal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ position: "fixed", inset: 0, zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: isMobile ? "0.65rem" : "1rem", background: "rgba(180,215,235,0.62)" }}>
      <motion.div initial={{ scale: 0.94, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.94, opacity: 0, y: 20 }}
        transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
        style={{ width: "100%", maxWidth: isTablet ? "100%" : "700px", background: "linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(244,250,255,0.98) 100%)", border: "1px solid rgba(255,255,255,0.62)", borderRadius: isMobile ? "20px" : "24px", padding: isMobile ? "1rem 0.95rem 0.95rem" : "1.4rem 1.4rem 1.25rem", boxShadow: "0 0 32px rgba(99,179,237,0.18), 0 20px 48px rgba(90,155,212,0.12)", maxHeight: "88vh", overflow: "hidden", display: "flex", flexDirection: "column" }}>
        <div style={{ flex: 1, minHeight: 0, overflowY: "auto", overscrollBehavior: "contain", WebkitOverflowScrolling: "touch", paddingRight: isMobile ? "0" : "0.15rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem", marginBottom: "0.8rem", flexWrap: isMobile ? "wrap" : "nowrap" }}>
          <div>
            {selected && <button onClick={() => setSelected(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#78909c", fontSize: "0.9rem", fontWeight: 600, padding: 0, marginBottom: "0.45rem" }}>Back to methods</button>}
            <p style={{ fontSize: "0.75rem", fontWeight: 700, color: CALM_ACCENT_TEXT, letterSpacing: "0.12em", textTransform: "uppercase", margin: "0 0 0.3rem" }}>
              Score {score}/100 - {tier.label} - Range {tier.range}
            </p>
            <h2 style={{ color: "#2c3e50", fontSize: isMobile ? "1.3rem" : "1.55rem", fontWeight: 800, margin: 0, lineHeight: 1.2 }}>
              {selected ? `${METHODS.find((method) => method.id === selected)?.label} Guide` : "Choose Your Solution"}
            </h2>
          </div>
          <button id="intervention-close-btn" onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#90a4ae", fontSize: "1.3rem", lineHeight: 1 }} aria-label="Close solution guide">x</button>
        </div>

        <div style={{ height: "4px", background: "rgba(90,155,212,0.12)", borderRadius: "999px", overflow: "hidden", marginBottom: "1.2rem" }}>
          <div style={{ width: `${score}%`, height: "100%", background: `linear-gradient(90deg, ${CALM_ACCENT}, ${CALM_ACCENT_DEEP})`, borderRadius: "999px", transition: "width 0.35s ease-out" }} />
        </div>

        {!selected && <div style={{ background: "rgba(227,242,253,0.58)", borderRadius: "16px", border: `1px solid ${CALM_BORDER}`, padding: "1rem 1.1rem", marginBottom: "1.2rem" }}>
          <p style={{ margin: 0, color: "#455a64", lineHeight: 1.7 }}>
            This solution flow follows stress_intervention_guide.txt. Each method below matches your current stress range for breathing, sound, visual focus, and advice prompts.
          </p>
        </div>}

        {!selected ? (
            <div>
              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fit, minmax(220px, 1fr))", gap: "0.9rem", marginBottom: "1.2rem" }}>
                {METHODS.map((method) => (
                  <button key={method.id} id={`method-${method.id}-btn`} onClick={() => setSelected(method.id)}
                    style={{ background: "rgba(255,255,255,0.74)", border: `1px solid ${CALM_BORDER}`, borderRadius: "18px", padding: "1.15rem", cursor: "pointer", textAlign: "left", display: "flex", flexDirection: "column", gap: "0.55rem", boxShadow: "0 8px 24px rgba(99,179,237,0.05)" }}>
                    <div style={{ width: "38px", height: "38px", borderRadius: "50%", display: "inline-flex", alignItems: "center", justifyContent: "center", background: "rgba(227,242,253,0.82)", color: CALM_ACCENT_TEXT, fontWeight: 800 }}>{method.short}</div>
                    <div style={{ fontSize: "1rem", fontWeight: 700, color: "#2c3e50" }}>{method.label}</div>
                    <div style={{ fontSize: "0.88rem", color: "#607d8b", lineHeight: 1.6 }}>{method.desc}</div>
                  </button>
                ))}
              </div>

              <div style={{ background: CALM_PANEL, borderRadius: "16px", padding: "1rem 1.1rem", border: `1px solid ${CALM_BORDER}`, marginBottom: "1.2rem" }}>
                <p style={{ margin: "0 0 0.5rem", color: CALM_ACCENT_TEXT, fontSize: "0.76rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>Right now</p>
                {tier.advice.lines.map((line) => <p key={line} style={{ margin: "0 0 0.4rem", color: "#37474f", lineHeight: 1.65 }}>&quot;{line}&quot;</p>)}
              </div>

              {tier.support && <div style={{ background: "rgba(248,113,113,0.12)", borderRadius: "16px", border: "1px solid rgba(248,113,113,0.3)", padding: "1rem 1.1rem", marginBottom: "1.1rem" }}>
                <p style={{ margin: "0 0 0.35rem", fontWeight: 700, color: "#b91c1c" }}>{tier.support.title}</p>
                <p style={{ margin: 0, color: "#7f1d1d", lineHeight: 1.7 }}>{tier.support.text}</p>
              </div>}

              <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap", flexDirection: isMobile ? "column" : "row" }}>
                <button id="intervention-retake-btn" onClick={onRetake} style={{ background: "rgba(255,255,255,0.5)", border: "1px solid rgba(90,155,212,0.24)", borderRadius: "999px", color: "#546e7a", padding: "0.7rem 1.5rem", cursor: "pointer", fontWeight: 600 }}>Retake Survey</button>
                <button id="intervention-done-btn" onClick={onClose}
                  style={{ background: `linear-gradient(135deg, ${CALM_ACCENT}, ${CALM_ACCENT_DEEP})`, border: "none", borderRadius: "999px", color: "#fff", padding: "0.7rem 1.6rem", cursor: "pointer", fontWeight: 700, boxShadow: "0 8px 24px rgba(99,179,237,0.24)" }}>Done</button>
              </div>
            </div>
          ) : (
            <div>
              {selected === "breathing" && <BreathingGuide key={`breathing-${tier.label}`} tier={tier} />}
              {selected === "sound" && <SoundGuide key={`sound-${tier.label}`} tier={tier} />}
              {selected === "visual" && <VisualGuide key={`visual-${tier.label}`} tier={tier} />}
              {selected === "advice" && <AdviceGuide key={`advice-${tier.label}`} tier={tier} />}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
