"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─── Tier data ────────────────────────────────────────────────────────────────

interface Tier {
  range: string;
  label: string;
  color: string;
  dimColor: string;
  glow: string;
  // Breathing
  breathName: string;
  breathDesc: string;
  inhale: number;
  hold: number;
  exhale: number;
  // Sound
  soundName: string;
  soundDesc: string;
  soundTip: string;
  waveType: "calm" | "gentle" | "rhythmic" | "deep" | "minimal";
  // Visual therapy
  visualName: string;
  visualDesc: string;
  colorPalette: string[];
  visualTip: string;
  // Advice
  technique: string;
  techniqueDesc: string;
  steps: { icon: string; sense: string; prompt: string; detail: string }[];
  mantras: string[];
}

const TIERS: Tier[] = [
  {
    range: "0–39", label: "Low Stress", color: "#38bdf8", dimColor: "#0ea5e9", glow: "rgba(56,189,248,0.4)",
    breathName: "Natural Calm Breathing", breathDesc: "Inhale 4s · Exhale 4s. Balanced breathing at this rhythm maintains low sympathetic tone and keeps the parasympathetic nervous system dominant — your body's natural rest-and-digest state. Research confirms this pattern sustains heart rate variability (HRV) in a healthy range.", inhale: 4, hold: 0, exhale: 4,
    soundName: "Morning Forest Ambience", soundDesc: "Light nature sounds — birdsong, soft wind, gentle flowing water. A 2017 study in Scientific Reports found nature sound exposure measurably reduces cortisol and promotes parasympathetic nervous system activity through auditory pathway entrainment. This is the most evidence-backed 'passive' calming stimulus available.", soundTip: "Close your eyes. Let each distinct natural sound serve as an anchor point — a bird call, a rustling leaf, a gentle stream.", waveType: "calm",
    visualName: "Blue Sky & Slow Clouds", visualDesc: "Soft blue and white stable visuals. Clinical chromotherapy research consistently maps blue wavelengths (~470 nm) to lower resting heart rate and reduced arousal. A calm landscape with slow movement activates the visual cortex's safe-environment patterns, reinforcing the parasympathetic state.", colorPalette: ["#e0f2fe", "#bae6fd", "#7dd3fc", "#38bdf8", "#0ea5e9"], visualTip: "Soften your gaze. Let the blue fill your peripheral field, not just your central focus.",
    technique: "Present Moment Anchoring (5-4-3-2-1)", techniqueDesc: "A mindfulness-based sensory grounding exercise rooted in CBT and DBT practice. It interrupts low-level rumination by redirecting awareness to non-threatening, present-moment stimuli — gently deactivating the amygdala's background threat-scanning loop.", steps: [{ icon: "👁️", sense: "See", prompt: "5 things you can see", detail: "Name 5 things around you right now. Be specific — notice colour, texture, shape. Don't evaluate, just observe." }, { icon: "🤲", sense: "Touch", prompt: "4 physical sensations", detail: "Feel 4 physical sensations: your feet on the floor, your back against the seat, the fabric on your skin, the temperature of the air." }, { icon: "👂", sense: "Hear", prompt: "3 distinct sounds", detail: "Listen for 3 sounds. Include quiet background ones — a fan, distant traffic, your own steady breath." }, { icon: "👃", sense: "Smell", prompt: "2 things you can smell", detail: "Detect 2 scents. Smell directly activates the olfactory bulb which connects to the amygdala — even neutral scents produce immediate calming." }, { icon: "👅", sense: "Taste", prompt: "1 thing you can taste", detail: "Acknowledge any taste present. This completes the full sensory circuit and reinforces total present-moment grounding." }], mantras: ["I am safe and calm.", "I breathe easily.", "This moment is peaceful."],
  },
  {
    range: "40–59", label: "Mild Stress", color: "#4ade80", dimColor: "#22c55e", glow: "rgba(74,222,128,0.4)",
    breathName: "Controlled Extended Exhale", breathDesc: "Inhale 4s · Exhale 5s. A longer exhale than inhale is the key mechanism for vagus nerve stimulation. The vagus nerve's afferent fibres carry 'safe' signals directly to the brainstem, suppressing cortisol release. Even a 1-second difference (4:5 ratio) produces measurable heart rate reduction within 3 cycles.", inhale: 4, hold: 0, exhale: 5,
    soundName: "Ocean Waves, Light Rain & Soft Instrumental", soundDesc: "Gentle rhythmic ocean waves with light rainfall and optional soft instrumental music. The predictable rhythm acts as an auditory metronome, entraining neural oscillations toward theta-alpha border (7–9 Hz) — associated with relaxed alertness. Multiple studies support nature rhythm + instrumental music for mild anxiety reduction.", soundTip: "Match your breathing to the wave rhythm. Inhale as the wave builds, exhale as it recedes.", waveType: "gentle",
    visualName: "Water Waves & Slow Blue-Green Particles", visualDesc: "Smooth, slow-flowing visuals in soft blue and green tones. Green wavelengths (~530 nm) are linked to balance and renewal — they reduce cognitive load by activating the visual cortex's 'safe environment' pathways. Flowing particle motion reduces visual hypervigilance by giving the eyes gentle, non-threatening movement.", colorPalette: ["#dcfce7", "#bbf7d0", "#86efac", "#4ade80", "#22c55e"], visualTip: "Let your gaze follow the flow rather than fixing on any single point.",
    technique: "5-4-3-2-1 Grounding (Full Protocol)", techniqueDesc: "The complete 5-4-3-2-1 sensory grounding protocol from DBT's Distress Tolerance module. Recommended by the American Psychological Association for interrupting mild-to-moderate anxiety spirals. Slowing down between each sense with a breath deepens the effect significantly.", steps: [{ icon: "👁️", sense: "See", prompt: "5 things around you", detail: "Look around and name 5 distinct things. Be specific about colour and detail. Take one slow breath between each observation." }, { icon: "🤲", sense: "Touch/Feel", prompt: "4 physical sensations", detail: "Feel 4 things: the ground under your feet, your clothing texture, a surface nearby, the temperature of the air. Press gently." }, { icon: "👂", sense: "Hear", prompt: "3 distinct sounds", detail: "Identify 3 sounds in your environment, including quiet background ones. Give each your full attention for a moment before moving on." }, { icon: "👃", sense: "Smell", prompt: "2 things you can smell", detail: "Detect 2 scents. The olfactory bulb connects directly to the amygdala — even neutral scents provide an immediate calming pathway." }, { icon: "👅", sense: "Taste", prompt: "1 taste you notice", detail: "Focus on one taste or the neutral feeling in your mouth. This completes the sensory circuit and reinforces present-moment presence." }], mantras: ["One breath at a time.", "I am more than this moment.", "This feeling is temporary."],
  },
  {
    range: "60–74", label: "Moderate Stress", color: "#facc15", dimColor: "#eab308", glow: "rgba(250,204,21,0.4)",
    breathName: "Guided Breathing (4-2-6)", breathDesc: "Inhale 4s · Hold 2s · Exhale 6s. This pattern is the intervention guide's clinical recommendation for moderate stress. The 2-second hold allows full alveolar oxygen exchange; the 6-second exhale (longest phase) triggers the baroreceptor stretch reflex — slowing heart rate. Based on Resonance Frequency Breathing at ~5 breaths/min.", inhale: 4, hold: 2, exhale: 6,
    soundName: "Guided Breathing Audio & Low Ambient Tones", soundDesc: "Low-frequency ambient tones (100–400 Hz) with a soft guiding pulse. Low-frequency sound reduces arousal in the sympathetic nervous system. Ambient tones without lyrics eliminate auditory competition with emotional content — freeing cognitive resources for calming. A guiding pulse helps pace your breathing externally.", soundTip: "Use stereo headphones if available. Close your eyes and let the low tone become the only thing you hear.", waveType: "rhythmic",
    visualName: "Expanding & Contracting Circle", visualDesc: "A circle that slowly grows and contracts in sync with each breath. This is the core visual tool recommended by the intervention guide for moderate stress. Research on visual-respiratory biofeedback shows that pacing visual focus to breath rhythm significantly improves respiratory coherence and reduces perceived stress within 5 minutes.", colorPalette: ["#fefce8", "#fef9c3", "#fef08a", "#facc15", "#eab308"], visualTip: "Breathe in as the circle expands. Breathe out as it contracts. Let it lead your body, not your mind.",
    technique: "Body Scan + Progressive Muscle Relaxation (PMR)", techniqueDesc: "Jacobson's Progressive Muscle Relaxation — the gold-standard physical stress release protocol since 1938. A 2024 systematic review of 46 clinical studies (3,400+ participants) confirmed PMR significantly reduces cortisol, blood pressure, and subjective anxiety. Tensing and releasing each muscle group discharges accumulated physical tension.", steps: [{ icon: "🧠", sense: "Head & Face", prompt: "Scrunch and release your face", detail: "Tense your whole face — scrunch your eyes, clench your jaw, tighten your forehead. Hold 5 seconds. Then release everything at once. Notice the warm wave of release spreading." }, { icon: "🫁", sense: "Shoulders & Chest", prompt: "Raise shoulders to ears, then drop", detail: "Pull your shoulders up as high as possible. Hold 5s, then let them drop completely. Feel the weight and warmth of released tension." }, { icon: "✋", sense: "Hands & Arms", prompt: "Make tight fists, then open wide", detail: "Make the tightest fists you can. Hold hard for 5 seconds. Release and spread your fingers as wide as possible. Feel the tingling blood flow." }, { icon: "🦵", sense: "Legs & Thighs", prompt: "Squeeze legs together, then release", detail: "Tighten all your leg muscles simultaneously. Hold 5s. Release. Feel them become heavy and warm as tension leaves." }, { icon: "🦶", sense: "Feet", prompt: "Curl toes hard, then flatten", detail: "Curl your toes tight for 5s, then flatten and spread them. Press your entire sole into the floor. Feel the ground supporting you." }], mantras: ["You are not in danger.", "This feeling is temporary.", "I breathe and release tension."],
  },
  {
    range: "75–89", label: "High Stress", color: "#fb923c", dimColor: "#f97316", glow: "rgba(251,146,60,0.4)",
    breathName: "Slow Deep Breathing (4-7)", breathDesc: "Inhale 4s · Exhale 7s. A pronounced extended exhale is the primary physiological signal for reducing sympathetic activation in high stress. The 7-second exhale maximally stimulates the vagus nerve via the baroreceptor stretch reflex and produces stronger parasympathetic rebound than shorter ratios. Specified directly in your intervention guide for this stress level.", inhale: 4, hold: 0, exhale: 7,
    soundName: "Low Bass Hum, Heartbeat & Brown Noise", soundDesc: "Deep low-frequency brown noise (spectral density ∝ 1/f²) plus a slow heartbeat. Brown noise masks sharp disruptive environmental sounds that spike the threat response. A slow heartbeat audio (below 70 BPM) activates the auditory-cardiac coupling reflex — heart rate tends to entrain to external rhythmic stimuli over time.", soundTip: "Place one hand on your chest. Feel your actual heartbeat. Let the recorded pulse slow it down. One sound. Full attention.", waveType: "deep",
    visualName: "Minimal — Dark Background with Slow Pulsing Light", visualDesc: "A minimal, slow-pulsing light against a dark background. Directly specified in the intervention guide for High Stress. Under high stress, your visual cortex becomes hyperactivated — more visual input makes things worse. A single slow pulse gives your threat-detection system one safe, predictable thing to track without overloading it.", colorPalette: ["#134e4a", "#0f766e", "#0d9488", "#14b8a6", "#99f6e4"], visualTip: "Let your peripheral vision go dark. Follow only the single pulse. One thing. Just this.",
    technique: "TIPP Skill — DBT Distress Tolerance", techniqueDesc: "Temperature · Intense Exercise · Paced Breathing · Progressive Relaxation. Developed by Dr. Marsha Linehan as part of DBT's Distress Tolerance module. TIPP is clinically validated for rapidly reducing high physiological arousal when cognitive strategies are inaccessible. It intervenes directly at the biological level.", steps: [{ icon: "❄️", sense: "Temperature", prompt: "Cool your face immediately", detail: "Splash ice-cold water on your face, or hold a cold wet cloth on your eyes and cheeks for 30 seconds. This activates the mammalian dive reflex — heart rate drops measurably within seconds. (Skip if you have cardiac conditions.)" }, { icon: "💪", sense: "Intense Exercise", prompt: "30–60 second physical burst", detail: "Do 20 jumping jacks, run in place, or 10 push-ups. Break a light sweat. This metabolises the cortisol and adrenaline chemically fuelling your high-stress state." }, { icon: "🫁", sense: "Paced Breathing", prompt: "Inhale 4s · Exhale 6s", detail: "Breathe in 4 seconds, out 6 seconds. Your body is now physiologically ready to receive slow breathing. Continue for 2 minutes without stopping. Exhale must always be longer than inhale." }, { icon: "💆", sense: "Progressive Relaxation", prompt: "Tense and release, head to feet", detail: "From forehead to feet: tense each muscle group for 5 seconds, then release suddenly. Move slowly through face, shoulders, chest, hands, legs, feet." }, { icon: "🧘", sense: "Arrive", prompt: "Notice the contrast", detail: "Sit quietly. Compare where you are now to where you started. This contrast itself is therapeutic — it teaches your nervous system what physiological relief feels like." }], mantras: ["Focus only on your breathing.", "You are safe right now.", "One breath brings me closer to calm."],
  },
  {
    range: "90–100", label: "Severe Stress", color: "#f87171", dimColor: "#ef4444", glow: "rgba(248,113,113,0.4)",
    breathName: "Very Slow Breathing (4-8)", breathDesc: "Inhale 4s · Exhale 8s. The most extended exhale ratio, reserved for severe stress. The 8-second exhale produces the strongest vagal stimulation achievable through voluntary breathing alone. A 2023 randomised controlled trial in Cell Reports Medicine (Stanford, Huberman & Spiegel) found cyclic extended-exhale breathing outperformed mindfulness meditation for acute stress reduction.", inhale: 4, hold: 0, exhale: 8,
    soundName: "Slow Heartbeat & Simple Repetitive Sounds", soundDesc: "A very slow, simple heartbeat pulse (55–60 BPM) and minimal repetitive sound. Under severe stress, complex auditory input causes cognitive overload. A single slow repetitive sound — especially one matching a calm heartbeat — gives the brain one non-threatening stimulus to anchor to, gradually slowing autonomic arousal through auditory-cardiac entrainment.", soundTip: "Put one hand on your chest. Focus only on the pulse. Between beats, there is quiet. Find the quiet between the beats.", waveType: "minimal",
    visualName: "Single Dim Pulsing Light on Dark Background", visualDesc: "The most minimal possible visual: one dim, slowly pulsing point of light against a dark background. Exactly as specified in the intervention guide for Severe Stress. When the nervous system is in crisis, visual simplicity is protective — it prevents sensory overwhelm while providing a single safe focal point for the hyperactivated visual system.", colorPalette: ["#3b0f0f", "#7f1d1d", "#b91c1c", "#ef4444", "#fca5a5"], visualTip: "One light. Follow only this. Let everything else dissolve. One light.",
    technique: "STOP Skill + Safe Place Visualisation", techniqueDesc: "DBT's STOP Skill (Stop · Take a Breath · Observe · Proceed) combined with Safe Place Guided Imagery — a validated technique used in EMDR therapy and somatic trauma work. Together they interrupt the crisis escalation loop and provide the nervous system a neurologically safe mental refuge to stabilise in.", steps: [{ icon: "✋", sense: "Stop", prompt: "Completely freeze for 5 seconds", detail: "Stop all motion. Don't move, don't speak, don't act on any impulse. Freeze for 5 full seconds. This single action interrupts the automatic stress escalation loop before it peaks." }, { icon: "🫁", sense: "Take a Breath", prompt: "Inhale 4s · Exhale 8s, twice", detail: "Breathe in slowly through your nose for 4 seconds. Then breathe out as slowly as possible for 8 full seconds. Repeat this twice. Do absolutely nothing else during this." }, { icon: "🔍", sense: "Observe", prompt: "State 3 neutral facts out loud", detail: "Say out loud: 'The floor is solid beneath me. There is light in this room. I am breathing.' State facts only. Facts activate the prefrontal cortex and override the emotional brain's crisis narrative." }, { icon: "🏡", sense: "Safe Place", prompt: "Enter your safe space — 60 seconds", detail: "Close your eyes. Go to one place where you have felt completely safe. Build it in sensory detail: the temperature, the sounds, the smell, the light. Stay there for a full 60 seconds." }, { icon: "🤝", sense: "Proceed", prompt: "Choose one tiny next action", detail: "From this calmer place, choose ONE small concrete action. Not a solution, not a plan — just one tiny thing. Get water. Sit down. Take one more breath. That is enough." }], mantras: ["Stay here. Breathe slowly.", "You are not alone.", "This will pass."],
  },
];

function getTier(score: number): Tier {
  if (score <= 39) return TIERS[0];
  if (score <= 59) return TIERS[1];
  if (score <= 74) return TIERS[2];
  if (score <= 89) return TIERS[3];
  return TIERS[4];
}

// ─── Breathing Guide ──────────────────────────────────────────────────────────
function BreathingGuide({ tier }: { tier: Tier }) {
  type Phase = "inhale" | "hold" | "exhale" | "ready";
  const [phase, setPhase] = useState<Phase>("ready");
  const [count, setCount] = useState(0);
  const [cycle, setCycle] = useState(0);
  const [started, setStarted] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!started) return;
    let ph: Phase = "inhale";
    let remaining = tier.inhale;
    setCycle(0);

    const tick = (p: Phase, r: number, c: number) => {
      setPhase(p);
      setCount(r);
      if (r > 1) {
        timerRef.current = setTimeout(() => tick(p, r - 1, c), 1000);
      } else {
        // Advance
        if (p === "inhale") {
          if (tier.hold > 0) {
            timerRef.current = setTimeout(() => tick("hold", tier.hold, c), 1000);
          } else {
            timerRef.current = setTimeout(() => tick("exhale", tier.exhale, c), 1000);
          }
        } else if (p === "hold") {
          timerRef.current = setTimeout(() => tick("exhale", tier.exhale, c), 1000);
        } else {
          const nextCycle = c + 1;
          setCycle(nextCycle);
          timerRef.current = setTimeout(() => tick("inhale", tier.inhale, nextCycle), 1200);
        }
      }
    };
    tick("inhale", tier.inhale, 0);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [started, tier]);

  const phaseScale = phase === "inhale" ? 1.45 : phase === "hold" ? 1.45 : 1;
  const phaseDuration = phase === "inhale" ? tier.inhale : phase === "hold" ? tier.hold : tier.exhale;
  const phaseLabel = { ready: "Press to begin", inhale: "Breathe IN", hold: "Hold", exhale: "Breathe OUT" }[phase];
  const phaseColor = { ready: tier.color + "88", inhale: tier.color, hold: "#f8fafc", exhale: tier.dimColor }[phase];

  // Particle ring
  const particles = Array.from({ length: 12 }, (_, i) => i);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1.5rem", padding: "1rem 0" }}>
      <div style={{ position: "relative", width: "220px", height: "220px", display: "flex", alignItems: "center", justifyContent: "center" }}>
        {/* Particle ring */}
        {started && particles.map(i => {
          const angle = (i / 12) * Math.PI * 2;
          const radius = phase === "inhale" ? 120 : phase === "hold" ? 120 : 75;
          return (
            <motion.div key={i} animate={{ x: Math.cos(angle) * radius, y: Math.sin(angle) * radius, opacity: phase === "exhale" ? 0.15 : 0.55, scale: phase === "inhale" ? 1.2 : 0.8 }}
              transition={{ duration: phaseDuration * 0.9, ease: "easeInOut" }}
              style={{ position: "absolute", width: "8px", height: "8px", borderRadius: "50%", background: tier.color }} />
          );
        })}
        {/* Outer glow ring */}
        <motion.div animate={{ scale: phaseScale, opacity: 0.15 }} transition={{ duration: phaseDuration, ease: "easeInOut" }}
          style={{ position: "absolute", width: "200px", height: "200px", borderRadius: "50%", background: `radial-gradient(circle, ${tier.color} 0%, transparent 70%)` }} />
        {/* Main circle */}
        <motion.div
          onClick={() => !started && setStarted(true)}
          animate={{ scale: phaseScale }}
          transition={{ duration: phaseDuration, ease: "easeInOut" }}
          style={{ width: "130px", height: "130px", borderRadius: "50%", background: `radial-gradient(circle, ${tier.color}33 0%, ${tier.color}11 100%)`, border: `2px solid ${tier.color}88`, cursor: started ? "default" : "pointer", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", boxShadow: `0 0 40px ${tier.glow}` }}
        >
          {started ? (
            <>
              <span style={{ fontSize: "2rem", fontWeight: 800, color: phaseColor, fontFamily: "monospace", lineHeight: 1 }}>{count}</span>
              <span style={{ fontSize: "0.6rem", color: tier.color, letterSpacing: "0.08em", textTransform: "uppercase", marginTop: "0.25rem" }}>sec</span>
            </>
          ) : (
            <span style={{ fontSize: "0.75rem", color: tier.color, textAlign: "center", padding: "0 0.5rem", lineHeight: 1.4 }}>Tap to<br />begin</span>
          )}
        </motion.div>
      </div>

      {/* Phase label */}
      <motion.div key={phase} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
        style={{ fontSize: "1.1rem", fontWeight: 700, color: phaseColor, letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "monospace" }}>
        {phaseLabel}
      </motion.div>

      {/* Rhythm display */}
      <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
        {[{ label: "In", val: tier.inhale, active: phase === "inhale" }, ...(tier.hold ? [{ label: "Hold", val: tier.hold, active: phase === "hold" }] : []), { label: "Out", val: tier.exhale, active: phase === "exhale" }].map((p, i) => (
          <div key={i} style={{ textAlign: "center", padding: "0.5rem 0.85rem", borderRadius: "10px", background: p.active ? `${tier.color}22` : "rgba(255,255,255,0.4)", border: `1.5px solid ${p.active ? tier.color : "rgba(90,155,212,0.2)"}`, transition: "all 0.3s" }}>
            <div style={{ fontSize: "1.1rem", fontWeight: 700, color: p.active ? tier.color : "#546e7a" }}>{p.val}s</div>
            <div style={{ fontSize: "0.65rem", color: "#90a4ae", textTransform: "uppercase", letterSpacing: "0.1em" }}>{p.label}</div>
          </div>
        ))}
      </div>

      {started && <div style={{ fontSize: "0.8rem", color: "#90a4ae" }}>Cycle {cycle + 1} · {tier.breathName}</div>}

      <div style={{ background: "rgba(255,255,255,0.5)", borderRadius: "12px", padding: "1rem 1.25rem", maxWidth: "400px", textAlign: "center", border: "1px solid rgba(90,155,212,0.15)" }}>
        <p style={{ color: "#37474f", fontSize: "0.88rem", lineHeight: 1.7, margin: 0 }}>{tier.breathDesc}</p>
      </div>
    </div>
  );
}

// ─── Sound Guide ──────────────────────────────────────────────────────────────

// Procedural audio engine using Web Audio API
function createAudio(waveType: string): { stop: () => void } | null {
  if (typeof window === "undefined") return null;
  try {
    const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    const master = ctx.createGain();
    master.gain.setValueAtTime(0, ctx.currentTime);
    master.gain.linearRampToValueAtTime(0.55, ctx.currentTime + 1.2);
    master.connect(ctx.destination);

    const nodes: AudioNode[] = [master];

    if (waveType === "calm") {
      // Forest ambience: high-pass filtered noise (wind) + gentle sine tones (birds)
      const buf = ctx.createBuffer(1, ctx.sampleRate * 3, ctx.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * 0.15;
      const noise = ctx.createBufferSource();
      noise.buffer = buf;
      noise.loop = true;
      const hp = ctx.createBiquadFilter();
      hp.type = "highpass";
      hp.frequency.value = 1200;
      hp.Q.value = 0.5;
      noise.connect(hp);
      hp.connect(master);
      noise.start();
      nodes.push(noise, hp);

      // Birdsong: gentle sine chirps at intervals
      const birdFreqs = [1800, 2200, 1600, 2600, 1400];
      birdFreqs.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = "sine";
        osc.frequency.value = freq;
        g.gain.setValueAtTime(0, ctx.currentTime);
        const startDelay = 1.5 + i * 2.3;
        g.gain.setValueAtTime(0, ctx.currentTime + startDelay);
        g.gain.linearRampToValueAtTime(0.06, ctx.currentTime + startDelay + 0.05);
        g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + startDelay + 0.35);
        osc.connect(g);
        g.connect(master);
        osc.start();
        nodes.push(osc, g);
      });

    } else if (waveType === "gentle") {
      // Ocean waves: band-pass noise with slow LFO amplitude cycling
      const buf = ctx.createBuffer(1, ctx.sampleRate * 4, ctx.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
      const noise = ctx.createBufferSource();
      noise.buffer = buf;
      noise.loop = true;
      const bp = ctx.createBiquadFilter();
      bp.type = "bandpass";
      bp.frequency.value = 400;
      bp.Q.value = 0.8;
      const waveGain = ctx.createGain();
      waveGain.gain.value = 0.4;
      noise.connect(bp);
      bp.connect(waveGain);
      waveGain.connect(master);
      noise.start();
      nodes.push(noise, bp, waveGain);

      // LFO to simulate wave swell (period ~8 s)
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.type = "sine";
      lfo.frequency.value = 0.12;
      lfoGain.gain.value = 0.35;
      lfo.connect(lfoGain);
      lfoGain.connect(waveGain.gain);
      lfo.start();
      nodes.push(lfo, lfoGain);

      // Soft rain: high-pass noise layer at low volume
      const buf2 = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
      const d2 = buf2.getChannelData(0);
      for (let i = 0; i < d2.length; i++) d2[i] = Math.random() * 2 - 1;
      const rain = ctx.createBufferSource();
      rain.buffer = buf2;
      rain.loop = true;
      const rainHp = ctx.createBiquadFilter();
      rainHp.type = "highpass";
      rainHp.frequency.value = 3000;
      const rainGain = ctx.createGain();
      rainGain.gain.value = 0.12;
      rain.connect(rainHp);
      rainHp.connect(rainGain);
      rainGain.connect(master);
      rain.start();
      nodes.push(rain, rainHp, rainGain);

    } else if (waveType === "rhythmic") {
      // Ambient guided tones: slow sine drone + soft rhythmic pulse
      const drone = ctx.createOscillator();
      const droneGain = ctx.createGain();
      drone.type = "sine";
      drone.frequency.value = 110; // A2
      droneGain.gain.value = 0.18;
      drone.connect(droneGain);
      droneGain.connect(master);
      drone.start();
      nodes.push(drone, droneGain);

      const drone2 = ctx.createOscillator();
      const drone2Gain = ctx.createGain();
      drone2.type = "triangle";
      drone2.frequency.value = 165; // E3 — harmonious fifth
      drone2Gain.gain.value = 0.1;
      drone2.connect(drone2Gain);
      drone2Gain.connect(master);
      drone2.start();
      nodes.push(drone2, drone2Gain);

      // Slow pulse every ~6 s (breathing guide tempo)
      const pulseGain = ctx.createGain();
      pulseGain.gain.value = 0;
      pulseGain.connect(master);
      const pulseosc = ctx.createOscillator();
      pulseosc.type = "sine";
      pulseosc.frequency.value = 220;
      pulseosc.connect(pulseGain);
      pulseosc.start();
      nodes.push(pulseosc, pulseGain);

      let t = ctx.currentTime + 2;
      for (let i = 0; i < 20; i++) {
        pulseGain.gain.setValueAtTime(0, t);
        pulseGain.gain.linearRampToValueAtTime(0.12, t + 0.3);
        pulseGain.gain.exponentialRampToValueAtTime(0.001, t + 1.2);
        t += 6;
      }

    } else if (waveType === "deep") {
      // Brown noise + low bass hum
      const buf = ctx.createBuffer(1, ctx.sampleRate * 4, ctx.sampleRate);
      const data = buf.getChannelData(0);
      let last = 0;
      for (let i = 0; i < data.length; i++) {
        const white = Math.random() * 2 - 1;
        last = (last + 0.02 * white) / 1.02;
        data[i] = last * 18; // brown noise approximation
      }
      const brown = ctx.createBufferSource();
      brown.buffer = buf;
      brown.loop = true;
      const lp = ctx.createBiquadFilter();
      lp.type = "lowpass";
      lp.frequency.value = 300;
      const brownGain = ctx.createGain();
      brownGain.gain.value = 0.55;
      brown.connect(lp);
      lp.connect(brownGain);
      brownGain.connect(master);
      brown.start();
      nodes.push(brown, lp, brownGain);

      // Bass hum — sub-bass sine
      const bass = ctx.createOscillator();
      const bassGain = ctx.createGain();
      bass.type = "sine";
      bass.frequency.value = 55; // A1 — deep grounding hum
      bassGain.gain.value = 0.22;
      bass.connect(bassGain);
      bassGain.connect(master);
      bass.start();
      nodes.push(bass, bassGain);

    } else {
      // Minimal: slow heartbeat at 58 BPM (~1.03 s interval)
      const beatInterval = 60 / 58;
      const beatGain = ctx.createGain();
      beatGain.gain.value = 0;
      beatGain.connect(master);
      const beatOsc = ctx.createOscillator();
      beatOsc.type = "sine";
      beatOsc.frequency.value = 80;
      beatOsc.connect(beatGain);
      beatOsc.start();
      nodes.push(beatOsc, beatGain);

      // Lub-dub pattern
      let t = ctx.currentTime + 0.5;
      for (let i = 0; i < 60; i++) {
        // Lub
        beatGain.gain.setValueAtTime(0, t);
        beatGain.gain.linearRampToValueAtTime(0.45, t + 0.04);
        beatGain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
        // Dub (slightly softer, 0.25 s after)
        beatGain.gain.setValueAtTime(0, t + 0.25);
        beatGain.gain.linearRampToValueAtTime(0.28, t + 0.29);
        beatGain.gain.exponentialRampToValueAtTime(0.001, t + 0.42);
        t += beatInterval;
      }

      // Ambient silence pad — very soft background sine
      const pad = ctx.createOscillator();
      const padGain = ctx.createGain();
      pad.type = "sine";
      pad.frequency.value = 40;
      padGain.gain.value = 0.05;
      pad.connect(padGain);
      padGain.connect(master);
      pad.start();
      nodes.push(pad, padGain);
    }

    return {
      stop: () => {
        master.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.8);
        setTimeout(() => {
          nodes.forEach(n => { try { (n as AudioBufferSourceNode).stop?.(); } catch { /* already stopped */ } });
          ctx.close();
        }, 900);
      },
    };
  } catch {
    return null;
  }
}

function SoundGuide({ tier }: { tier: Tier }) {
  const [active, setActive] = useState(false);
  const audioRef = useRef<{ stop: () => void } | null>(null);
  const barCount = 28;

  const toggle = () => {
    if (active) {
      audioRef.current?.stop();
      audioRef.current = null;
      setActive(false);
    } else {
      audioRef.current = createAudio(tier.waveType);
      setActive(true);
    }
  };

  // Stop audio when component unmounts
  useEffect(() => {
    return () => { audioRef.current?.stop(); };
  }, []);

  // Base wave heights per type (visual only)
  const waveProfiles: Record<string, number[]> = {
    calm:     [0.2, 0.3, 0.25, 0.4, 0.3, 0.2, 0.35, 0.25, 0.3, 0.2, 0.25, 0.3, 0.2, 0.25, 0.3, 0.35, 0.2, 0.3, 0.25, 0.35, 0.2, 0.3, 0.25, 0.2, 0.3, 0.25, 0.2, 0.3],
    gentle:   [0.3, 0.5, 0.4, 0.6, 0.5, 0.3, 0.55, 0.45, 0.5, 0.35, 0.5, 0.6, 0.4, 0.45, 0.55, 0.5, 0.35, 0.55, 0.4, 0.6, 0.35, 0.5, 0.45, 0.35, 0.55, 0.4, 0.35, 0.5],
    rhythmic: [0.4, 0.7, 0.5, 0.8, 0.6, 0.4, 0.75, 0.55, 0.7, 0.45, 0.7, 0.8, 0.5, 0.6, 0.75, 0.65, 0.45, 0.75, 0.5, 0.8, 0.45, 0.7, 0.55, 0.45, 0.75, 0.5, 0.45, 0.7],
    deep:     [0.7, 0.85, 0.75, 0.9, 0.8, 0.7, 0.85, 0.75, 0.8, 0.7, 0.8, 0.9, 0.75, 0.8, 0.85, 0.8, 0.7, 0.85, 0.75, 0.9, 0.7, 0.8, 0.75, 0.7, 0.85, 0.75, 0.7, 0.8],
    minimal:  [0.15, 0.2, 0.15, 0.25, 0.2, 0.15, 0.2, 0.15, 0.2, 0.15, 0.2, 0.25, 0.15, 0.2, 0.25, 0.2, 0.15, 0.25, 0.15, 0.2, 0.15, 0.2, 0.15, 0.15, 0.2, 0.15, 0.15, 0.2],
  };
  const base = waveProfiles[tier.waveType];

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1.5rem" }}>
      {/* Waveform visualiser — click to toggle audio too */}
      <div
        style={{ width: "100%", maxWidth: "440px", height: "100px", display: "flex", alignItems: "center", justifyContent: "center", gap: "3px", padding: "0 1rem", background: "rgba(255,255,255,0.4)", borderRadius: "18px", border: "1px solid rgba(90,155,212,0.15)", cursor: "pointer" }}
        onClick={toggle}
      >
        {Array.from({ length: barCount }, (_, i) => {
          const h = base[i] ?? 0.3;
          return (
            <motion.div key={i}
              animate={active ? { scaleY: [h, h * 1.8, h * 0.6, h * 1.4, h], opacity: [0.6, 1, 0.5, 0.9, 0.7] } : { scaleY: h * 0.5, opacity: 0.3 }}
              transition={active ? { duration: 0.9 + (i % 5) * 0.18, repeat: Infinity, ease: "easeInOut", delay: i * 0.04 } : { duration: 0.5 }}
              style={{ width: "7px", height: "80px", originY: "50%", borderRadius: "4px", background: `linear-gradient(to top, ${tier.dimColor}, ${tier.color})` }}
            />
          );
        })}
      </div>

      <button
        onClick={toggle}
        style={{ background: active ? `linear-gradient(135deg, ${tier.color}, ${tier.dimColor})` : "rgba(255,255,255,0.5)", border: `1.5px solid ${tier.color}66`, borderRadius: "99px", color: active ? "white" : tier.dimColor, padding: "0.65rem 2rem", cursor: "pointer", fontSize: "0.95rem", fontWeight: 700, transition: "all 0.3s", boxShadow: active ? `0 6px 20px ${tier.glow}` : "none" }}
      >
        {active ? "⏸ Stop Sound" : "▶ Play Sound"}
      </button>

      {active && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ fontSize: "0.78rem", color: "#90a4ae", textAlign: "center" }}>
          🎧 Use headphones for best experience
        </motion.p>
      )}

      <div style={{ width: "100%", maxWidth: "420px", background: "rgba(255,255,255,0.55)", borderRadius: "16px", padding: "1.25rem", border: "1px solid rgba(90,155,212,0.15)" }}>
        <p style={{ fontWeight: 700, color: "#2c3e50", marginBottom: "0.5rem", fontSize: "1rem" }}>🎵 {tier.soundName}</p>
        <p style={{ color: "#546e7a", fontSize: "0.88rem", lineHeight: 1.7, marginBottom: "1rem" }}>{tier.soundDesc}</p>
        <div style={{ background: `${tier.color}15`, borderLeft: `3px solid ${tier.color}`, borderRadius: "0 8px 8px 0", padding: "0.75rem 1rem" }}>
          <p style={{ color: "#37474f", fontSize: "0.85rem", margin: 0, fontStyle: "italic" }}>💡 {tier.soundTip}</p>
        </div>
      </div>

      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", justifyContent: "center" }}>
        {(tier.waveType === "calm" ? ["Nature sounds", "Wind ambience", "Bird tones"] : tier.waveType === "gentle" ? ["Ocean waves", "Light rain", "Wave swell LFO"] : tier.waveType === "rhythmic" ? ["Sine drone", "Harmonic fifth", "Breath pulse"] : tier.waveType === "deep" ? ["Brown noise", "Bass hum 55Hz", "Sub-bass"] : ["Heartbeat 58 BPM", "Lub-dub", "Sub pad"]).map((tag) => (
          <span key={tag} style={{ padding: "0.3rem 0.85rem", borderRadius: "99px", background: `${tier.color}18`, border: `1px solid ${tier.color}44`, fontSize: "0.78rem", color: tier.dimColor, fontWeight: 600 }}>{tag}</span>
        ))}
      </div>
    </div>
  );
}


// ─── Visual Guide ─────────────────────────────────────────────────────────────
function VisualGuide({ tier }: { tier: Tier }) {
  const [phase, setPhase] = useState(0); // 0=stressed, 1=transitioning, 2=calm
  const [started, setStarted] = useState(false);
  const particleCount = 30;

  useEffect(() => {
    if (!started) return;
    const t1 = setTimeout(() => setPhase(1), 800);
    const t2 = setTimeout(() => setPhase(2), 4000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [started]);

  // Stressed = warm reds/oranges, calm = tier color palette
  const stressedColors = ["#7f1d1d", "#b91c1c", "#ef4444", "#f97316", "#fbbf24"];
  const calmColors = tier.colorPalette;

  const bgColor = phase === 0 ? "#1a0a0a" : phase === 1 ? "#0f1a2a" : "#f0f9ff";
  const particleColor = (i: number) => {
    const palette = phase < 2 ? stressedColors : calmColors;
    return palette[i % palette.length];
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1.5rem" }}>
      {/* Canvas */}
      <motion.div
        animate={{ background: bgColor }}
        transition={{ duration: 3, ease: "easeInOut" }}
        style={{ width: "100%", maxWidth: "440px", height: "220px", borderRadius: "20px", border: "1px solid rgba(90,155,212,0.2)", position: "relative", overflow: "hidden", cursor: started ? "default" : "pointer" }}
        onClick={() => !started && setStarted(true)}
      >
        {/* Ambient glow */}
        <motion.div animate={{ opacity: phase === 2 ? 0.5 : 0.15, scale: phase === 2 ? 1.3 : 1 }} transition={{ duration: 3, ease: "easeInOut" }}
          style={{ position: "absolute", inset: 0, background: `radial-gradient(circle at 50% 50%, ${phase === 2 ? tier.color : "#ef4444"}66, transparent)` }} />

        {/* Particles */}
        {Array.from({ length: particleCount }, (_, i) => {
          const angle = (i / particleCount) * Math.PI * 2;
          const chaos = phase === 0 ? 1 : phase === 1 ? 0.5 : 0;
          const radius = phase === 2 ? 65 + (i % 5) * 12 : 40 + (i % 8) * 15;
          const jitter = phase === 0 ? (Math.random() - 0.5) * 60 : 0;
          return (
            <motion.div key={i}
              animate={{
                x: `calc(50% + ${Math.cos(angle + (started ? Date.now() / 3000 : 0)) * radius + jitter}px)`,
                y: `calc(50% + ${Math.sin(angle + (started ? Date.now() / 2000 : 0)) * radius * 0.6 + jitter}px)`,
                opacity: phase === 0 ? 0.4 + chaos * 0.3 : 0.7,
                scale: phase === 2 ? 1 + (i % 3) * 0.3 : 0.7,
              }}
              transition={{ duration: phase === 0 ? 0.3 + Math.random() * 0.5 : 2.5, ease: "easeOut", delay: i * 0.04, repeat: phase === 0 ? Infinity : 0, repeatType: "reverse" }}
              style={{ position: "absolute", width: phase === 2 ? "10px" : "7px", height: phase === 2 ? "10px" : "7px", borderRadius: "50%", background: particleColor(i), transform: "translate(-50%, -50%)" }}
            />
          );
        })}

        {/* Center label */}
        {!started && (
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ background: "rgba(0,0,0,0.5)", borderRadius: "12px", padding: "0.75rem 1.5rem", color: "white", fontSize: "0.9rem", fontWeight: 600, backdropFilter: "blur(8px)" }}>
              ▶ Tap to begin visual therapy
            </div>
          </div>
        )}
        {started && phase === 2 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
            style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: "2rem" }}>✨</span>
          </motion.div>
        )}
      </motion.div>

      {/* Status */}
      <motion.p key={phase} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        style={{ fontSize: "0.95rem", fontWeight: 600, color: phase === 0 ? "#ef4444" : phase === 1 ? tier.color : tier.dimColor, textAlign: "center", letterSpacing: "0.05em" }}>
        {!started ? "Tap the canvas to start" : phase === 0 ? "Visualizing stress state..." : phase === 1 ? "Transitioning to calm..." : "✓ Calm state achieved"}
      </motion.p>

      {/* Color swatches */}
      <div style={{ display: "flex", gap: "0.5rem", flexDirection: "column", alignItems: "center", width: "100%", maxWidth: "420px" }}>
        <p style={{ fontSize: "0.75rem", color: "#90a4ae", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.25rem" }}>Your Calming Palette</p>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          {tier.colorPalette.map((c, i) => (
            <motion.div key={i} initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: i * 0.1 }}
              style={{ width: "36px", height: "36px", borderRadius: "50%", background: c, boxShadow: `0 2px 8px ${c}88` }} />
          ))}
        </div>
      </div>

      <div style={{ width: "100%", maxWidth: "420px", background: "rgba(255,255,255,0.55)", borderRadius: "16px", padding: "1.25rem", border: "1px solid rgba(90,155,212,0.15)" }}>
        <p style={{ fontWeight: 700, color: "#2c3e50", marginBottom: "0.5rem" }}>👁️ {tier.visualName}</p>
        <p style={{ color: "#546e7a", fontSize: "0.88rem", lineHeight: 1.7, marginBottom: "0.75rem" }}>{tier.visualDesc}</p>
        <div style={{ background: `${tier.color}15`, borderLeft: `3px solid ${tier.color}`, borderRadius: "0 8px 8px 0", padding: "0.75rem 1rem" }}>
          <p style={{ color: "#37474f", fontSize: "0.85rem", margin: 0, fontStyle: "italic" }}>💡 {tier.visualTip}</p>
        </div>
      </div>
    </div>
  );
}

// ─── Advice Guide ─────────────────────────────────────────────────────────────
function AdviceGuide({ tier }: { tier: Tier }) {
  const [activeStep, setActiveStep] = useState(-1);
  const [done, setDone] = useState(false);

  const advance = () => {
    if (activeStep < tier.steps.length - 1) setActiveStep(s => s + 1);
    else setDone(true);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem", width: "100%", maxWidth: "440px", margin: "0 auto" }}>
      <p style={{ color: "#546e7a", fontSize: "0.9rem", lineHeight: 1.7, textAlign: "center" }}>{tier.techniqueDesc}</p>

      {/* Step indicators */}
      <div style={{ display: "flex", justifyContent: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
        {tier.steps.map((_, i) => (
          <motion.div key={i} animate={{ background: i <= activeStep ? tier.color : "rgba(90,155,212,0.15)", scale: i === activeStep ? 1.3 : 1 }}
            style={{ width: "10px", height: "10px", borderRadius: "50%", border: `1.5px solid ${i <= activeStep ? tier.color : "rgba(90,155,212,0.3)"}`, transition: "background 0.4s" }} />
        ))}
      </div>

      {/* Steps */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem" }}>
        {tier.steps.map((step, i) => {
          const isActive = i === activeStep;
          const isPast = i < activeStep;
          const isLocked = i > activeStep;
          return (
            <motion.div key={i}
              animate={{ opacity: isLocked ? 0.35 : 1, scale: isActive ? 1.02 : 1 }}
              transition={{ duration: 0.35 }}
              style={{ borderRadius: "14px", border: `1.5px solid ${isActive ? tier.color : isPast ? tier.color + "44" : "rgba(90,155,212,0.15)"}`, background: isActive ? `${tier.color}12` : isPast ? "rgba(255,255,255,0.35)" : "rgba(255,255,255,0.25)", padding: "0.9rem 1.1rem", cursor: isLocked ? "default" : "pointer", transition: "all 0.3s" }}
              onClick={() => !isLocked && setActiveStep(i)}
            >
              <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem" }}>
                <span style={{ fontSize: "1.4rem", flexShrink: 0 }}>{isPast ? "✅" : step.icon}</span>
                <div>
                  <p style={{ fontWeight: 700, color: isActive ? tier.dimColor : "#37474f", fontSize: "0.9rem", marginBottom: "0.2rem" }}>{step.sense}: {step.prompt}</p>
                  {isActive && (
                    <motion.p initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
                      style={{ color: "#546e7a", fontSize: "0.84rem", lineHeight: 1.65, marginTop: "0.5rem" }}>
                      {step.detail}
                    </motion.p>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Action button */}
      {!done ? (
        <motion.button onClick={() => { if (activeStep === -1) setActiveStep(0); else advance(); }}
          whileHover={{ scale: 1.04, y: -1 }} whileTap={{ scale: 0.97 }}
          style={{ background: `linear-gradient(135deg, ${tier.color}, ${tier.dimColor})`, border: "none", borderRadius: "99px", color: "white", padding: "0.8rem 2rem", cursor: "pointer", fontSize: "0.95rem", fontWeight: 700, boxShadow: `0 6px 20px ${tier.glow}`, margin: "0.5rem auto", display: "block" }}>
          {activeStep === -1 ? "Begin →" : activeStep === tier.steps.length - 1 ? "Complete ✓" : "Next Step →"}
        </motion.button>
      ) : (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: "center" }}>
          <p style={{ fontSize: "1.1rem", fontWeight: 700, color: tier.dimColor, marginBottom: "1rem" }}>Well done. 🌿</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {tier.mantras.map((m, i) => (
              <motion.p key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.2 }}
                style={{ color: "#546e7a", fontStyle: "italic", fontSize: "0.95rem" }}>"{m}"</motion.p>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
interface InterventionGuideProps {
  score: number;
  onClose: () => void;
  onRetake: () => void;
}

type Method = "breathing" | "sound" | "visual" | "advice";

const METHODS: { id: Method; label: string; icon: string; desc: string }[] = [
  { id: "breathing", label: "Breathing", icon: "🫁", desc: "Guided breath exercise calibrated to your stress level" },
  { id: "sound", label: "Sound", icon: "🎵", desc: "Audio environment recommendations with waveform visualizer" },
  { id: "visual", label: "Visual", icon: "👁️", desc: "Color therapy & particle animation shifting to calm" },
  { id: "advice", label: "Advice", icon: "💬", desc: "Step-by-step grounding & coping technique" },
];

export default function InterventionGuide({ score, onClose, onRetake }: InterventionGuideProps) {
  const tier = getTier(score);
  const [selected, setSelected] = useState<Method | null>(null);

  return (
    <motion.div id="intervention-guide-modal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ position: "fixed", inset: 0, zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem", background: "rgba(180, 215, 235, 0.55)", backdropFilter: "blur(18px)", WebkitBackdropFilter: "blur(18px)" }}>
      <motion.div
        initial={{ scale: 0.93, opacity: 0, y: 22 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.93, opacity: 0, y: 22 }}
        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
        style={{ width: "100%", maxWidth: "660px", background: "rgba(255, 255, 255, 0.82)", backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)", border: "1px solid rgba(255,255,255,0.6)", borderRadius: "24px", padding: "2.5rem", boxShadow: `0 0 60px ${tier.glow}, 0 20px 60px rgba(90,155,212,0.12)`, maxHeight: "92vh", overflowY: "auto" }}
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}>
          <div>
            {selected && (
              <button onClick={() => setSelected(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#90a4ae", fontSize: "0.85rem", fontWeight: 600, padding: 0, marginBottom: "0.5rem", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                ← Back to methods
              </button>
            )}
            <p style={{ fontSize: "0.7rem", fontWeight: 700, color: tier.color, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "0.3rem" }}>
              Score {score}/100 · {tier.label} · Range {tier.range}
            </p>
            <h2 style={{ color: "#2c3e50", fontSize: "1.5rem", fontWeight: 800, margin: 0 }}>
              {selected ? METHODS.find(m => m.id === selected)!.label + " Guide" : "Choose Your Solution"}
            </h2>
          </div>
          <button id="intervention-close-btn" onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#90a4ae", fontSize: "1.3rem", lineHeight: 1 }}>✕</button>
        </div>

        {/* Score bar */}
        <div style={{ height: "4px", background: "rgba(90,155,212,0.1)", borderRadius: "99px", marginBottom: "1.75rem", overflow: "hidden" }}>
          <motion.div initial={{ width: 0 }} animate={{ width: `${score}%` }} transition={{ duration: 1.2, ease: "easeOut" }}
            style={{ height: "100%", background: `linear-gradient(90deg, #5a9bd4, ${tier.color})`, borderRadius: "99px" }} />
        </div>

        <AnimatePresence mode="wait">
          {!selected ? (
            <motion.div key="select" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
              {/* Method selection grid */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.5rem" }}>
                {METHODS.map((m) => (
                  <motion.button key={m.id} id={`method-${m.id}-btn`} onClick={() => setSelected(m.id)}
                    whileHover={{ scale: 1.04, y: -3, boxShadow: `0 10px 30px ${tier.glow}` }}
                    whileTap={{ scale: 0.97 }}
                    style={{ background: "rgba(255,255,255,0.65)", border: `1.5px solid ${tier.color}44`, borderRadius: "18px", padding: "1.5rem 1.25rem", cursor: "pointer", textAlign: "left", transition: "border-color 0.2s", backdropFilter: "blur(8px)" }}>
                    <div style={{ fontSize: "2rem", marginBottom: "0.6rem" }}>{m.icon}</div>
                    <p style={{ fontWeight: 700, color: "#2c3e50", fontSize: "1rem", marginBottom: "0.35rem" }}>{m.label}</p>
                    <p style={{ color: "#78909c", fontSize: "0.8rem", lineHeight: 1.5, margin: 0 }}>{m.desc}</p>
                  </motion.button>
                ))}
              </div>

              {/* Quick mantras */}
              <div style={{ background: `${tier.color}12`, borderRadius: "14px", padding: "1.1rem 1.25rem", border: `1px solid ${tier.color}33`, marginBottom: "1.25rem" }}>
                <p style={{ fontSize: "0.7rem", color: tier.dimColor, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.5rem" }}>Words for right now</p>
                {tier.mantras.map((m, i) => (
                  <motion.p key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.1 }}
                    style={{ color: "#37474f", fontSize: "0.92rem", fontStyle: "italic", lineHeight: 1.7, margin: 0 }}>"{m}"</motion.p>
                ))}
              </div>

              {/* Actions */}
              <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center" }}>
                <button id="intervention-retake-btn" onClick={onRetake} style={{ background: "rgba(255,255,255,0.5)", border: "1.5px solid rgba(90,155,212,0.3)", borderRadius: "99px", color: "#546e7a", padding: "0.65rem 1.5rem", cursor: "pointer", fontSize: "0.88rem", fontWeight: 600 }}>↺ Retake Survey</button>
                <motion.button id="intervention-done-btn" onClick={onClose} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} style={{ background: `linear-gradient(135deg, ${tier.color}, ${tier.dimColor})`, border: "none", borderRadius: "99px", color: "white", padding: "0.65rem 1.75rem", cursor: "pointer", fontSize: "0.88rem", fontWeight: 700, boxShadow: `0 4px 16px ${tier.glow}` }}>Done ✓</motion.button>
              </div>
            </motion.div>
          ) : (
            <motion.div key={selected} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
              {selected === "breathing" && <BreathingGuide tier={tier} />}
              {selected === "sound" && <SoundGuide tier={tier} />}
              {selected === "visual" && <VisualGuide tier={tier} />}
              {selected === "advice" && <AdviceGuide tier={tier} />}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
