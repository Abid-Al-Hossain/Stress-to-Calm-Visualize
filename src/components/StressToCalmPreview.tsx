"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function StressToCalmPreview() {
  const [stressLevel, setStressLevel] = useState(50);

  // Calculate visual properties based on stress level (0-100)
  const isStressed = stressLevel > 50;

  // Color transition: Blue (Calm) -> Red (Stress)
  const r = Math.min(255, Math.max(90, 90 + (stressLevel / 100) * 165));
  const g = Math.min(255, Math.max(76, 155 - (stressLevel / 100) * 80));
  const b = Math.min(255, Math.max(60, 212 - (stressLevel / 100) * 152));

  const bgRgba = `rgba(${r}, ${g}, ${b}, 0.2)`;
  const mainColor = `rgb(${r}, ${g}, ${b})`;

  // Breathing speed: 5s (Calm) -> 0.5s (Panic)
  const breathDuration = 5 - (stressLevel / 100) * 4.5;

  // Determine current state for facial expression
  const getState = (level: number) => {
    if (level < 33) return "relaxed";
    if (level < 66) return "focused";
    return "stressed";
  };

  const currentState = getState(stressLevel);

  // SVG Paths for facial features
  const faces = {
    relaxed: {
      // Soft rounded circle
      head: "M 50, 10 C 20, 10 10, 30 10, 50 C 10, 80 20, 90 50, 90 C 80, 90 90, 80 90, 50 C 90, 30 80, 10 50, 10 Z",
      // Closed happy eyes (arcs)
      eyeL: "M 30, 45 Q 40, 35 50, 45",
      eyeR: "M 70, 45 Q 80, 35 90, 45", // Adjusted for scaling 0-100 viewBox
      // Gentle smile
      mouth: "M 35, 65 Q 50, 75 65, 65",
    },
    focused: {
      // Slightly more squared/alert
      head: "M 50, 15 C 25, 15 15, 25 15, 50 C 15, 75 25, 85 50, 85 C 75, 85 85, 75 85, 50 C 85, 25 75, 15 50, 15 Z",
      // Open alert eyes (circles)
      eyeL: "M 35, 45 A 5,5 0 1,1 35.01,45", // Circle approx
      eyeR: "M 65, 45 A 5,5 0 1,1 65.01,45",
      // Determined straight mouth
      mouth: "M 40, 70 L 60, 70",
    },
    stressed: {
      // Jagged/Irregular shape
      head: "M 50, 5 C 20, 15 5, 30 15, 55 C 5, 80 20, 95 50, 90 C 80, 95 95, 80 85, 55 C 95, 30 80, 15 50, 5 Z",
      // Wide mismatched eyes
      eyeL: "M 30, 40 A 8,8 0 1,1 30.01,40",
      eyeR: "M 70, 45 A 4,4 0 1,1 70.01,45",
      // Wobbly grimace
      mouth: "M 35, 70 Q 45, 60 50, 70 T 65, 70",
    },
  };

  const currentFace = faces[currentState];

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

        {/* Animated Face Container */}
        <motion.svg
          viewBox="0 0 100 100"
          className="drop-shadow-lg"
          style={{ width: "128px", height: "128px" }}
          animate={{
            scale:
              currentState === "stressed" ? [1, 1.05, 0.95, 1] : [1, 1.05, 1],
            rotate: currentState === "stressed" ? [0, -2, 2, 0] : 0,
          }}
          transition={{
            duration: currentState === "stressed" ? 0.4 : 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {/* Head Shape */}
          <motion.path
            d={currentFace.head}
            fill={mainColor}
            animate={{ d: currentFace.head, fill: mainColor }}
            transition={{ duration: 0.5 }}
          />

          {/* Eyes */}
          <motion.path
            d={currentFace.eyeL}
            stroke="white"
            strokeWidth="3"
            fill="transparent"
            strokeLinecap="round"
            animate={{ d: currentFace.eyeL }}
            transition={{ duration: 0.5 }}
          />
          <motion.path
            d={currentFace.eyeR}
            stroke="white"
            strokeWidth="3"
            strokeLinecap="round"
            fill="transparent"
            animate={{ d: currentFace.eyeR }}
            transition={{ duration: 0.5 }}
          />

          {/* Mouth */}
          <motion.path
            d={currentFace.mouth}
            stroke="white"
            strokeWidth="3"
            strokeLinecap="round"
            fill="transparent"
            animate={{ d: currentFace.mouth }}
            transition={{ duration: 0.5 }}
          />
        </motion.svg>

        {/* State Label */}
        <div className="absolute bottom-4 left-0 right-0 text-center">
          <span
            className="text-lg font-bold transition-all duration-300 px-4 py-1 rounded-full bg-white/60 backdrop-blur-sm"
            style={{
              color: mainColor,
            }}
          >
            {currentState.charAt(0).toUpperCase() + currentState.slice(1)}
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
