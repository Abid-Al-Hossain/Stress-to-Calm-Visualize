"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function StressToCalmPreview() {
  const [stressLevel, setStressLevel] = useState(50);

  // Calculate visual properties based on stress level (0-100)
  const isStressed = stressLevel > 50;

  // Color transition: Blue (Calm) -> Red (Stress)
  // Simple interpolation logic for demo
  const r = Math.min(255, Math.max(90, 90 + (stressLevel / 100) * 165));
  const g = Math.min(255, Math.max(76, 155 - (stressLevel / 100) * 80));
  const b = Math.min(255, Math.max(60, 212 - (stressLevel / 100) * 152));

  // Breathing speed: 5s (Calm) -> 0.5s (Panic)
  const breathDuration = 5 - (stressLevel / 100) * 4.5;

  const bgRgba = `rgba(${r}, ${g}, ${b}, 0.2)`;
  const mainColor = `rgb(${r}, ${g}, ${b})`;

  return (
    <div className="w-full max-w-2xl mx-auto my-12 p-6 rounded-3xl bg-white/40 backdrop-blur-md border border-white/50 shadow-xl">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-gray-700 mb-2">
          Interactive Preview
        </h3>
        <p className="text-sm text-gray-500">
          Drag the slider to see how tension affects perception
        </p>
      </div>

      <div
        className="relative h-64 rounded-2xl overflow-hidden mb-8 flex items-center justify-center transition-colors duration-300"
        style={{ backgroundColor: bgRgba }}
      >
        {/* Vignette Effect */}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle, transparent 40%, rgba(0,0,0,${stressLevel / 150}) 100%)`,
          }}
        />

        {/* Breathing Circle */}
        <motion.div
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.7, 0.4, 0.7],
          }}
          transition={{
            duration: breathDuration,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="w-32 h-32 rounded-full blur-xl"
          style={{ backgroundColor: mainColor }}
        />

        {/* Floating Particles (Calm) or Jittery (Stress) */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className="text-4xl font-bold transition-all duration-300"
            style={{
              color: mainColor,
              filter: `blur(${stressLevel > 80 ? "2px" : "0px"})`,
              transform: `scale(${1 + stressLevel / 200})`,
            }}
          >
            {stressLevel < 30
              ? "Relaxed"
              : stressLevel < 70
                ? "Focused"
                : "Tense"}
          </span>
        </div>
      </div>

      {/* Slider Control */}
      <div className="flex items-center gap-4 px-4">
        <span className="text-sm font-medium text-blue-500">Calm</span>
        <input
          type="range"
          min="0"
          max="100"
          value={stressLevel}
          onChange={(e) => setStressLevel(Number(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
        />
        <span className="text-sm font-medium text-red-500">Stress</span>
      </div>

      <div className="text-center mt-2 text-xs text-gray-400 font-mono">
        Current Level: {stressLevel}%
      </div>
    </div>
  );
}
