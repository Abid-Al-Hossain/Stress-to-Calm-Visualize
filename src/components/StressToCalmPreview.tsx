"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function StressToCalmPreview() {
  const [stressLevel, setStressLevel] = useState(50);

  // Determine current state
  const getState = (level: number) => {
    if (level < 33) return "relaxed";
    if (level < 66) return "focused";
    return "stressed";
  };

  const currentState = getState(stressLevel);

  // Dynamic visual properties
  const visuals = {
    relaxed: {
      color: "#38BDF8", // Sky 400
      glow: "rgba(56, 189, 248, 0.5)",
      // Smooth, symmetrical face
      head: "M 20,40 Q 20,80 50,90 Q 80,80 80,40 Q 80,10 50,10 Q 20,10 20,40 Z",
      earL: "M 20,50 Q 15,50 15,60 Q 15,70 20,70",
      earR: "M 80,50 Q 85,50 85,60 Q 85,70 80,70",
      eyeL: "M 32,45 Q 40,38 48,45", // Soft arc
      eyeR: "M 52,45 Q 60,38 68,45",
      mouth: "M 35,68 Q 50,78 65,68", // Smile
      filter: "drop-shadow(0px 0px 8px rgba(56, 189, 248, 0.6))",
      scale: [1, 1.02, 1],
    },
    focused: {
      color: "#818CF8", // Indigo 400
      glow: "rgba(129, 140, 248, 0.5)",
      // Geometric, defined jawline
      head: "M 25,30 L 25,60 L 50,85 L 75,60 L 75,30 L 50,15 Z",
      earL: "M 25,50 L 20,55 L 25,60",
      earR: "M 75,50 L 80,55 L 75,60",
      eyeL: "M 30,45 L 42,45 L 42,50 L 30,50 Z", // Rectangular
      eyeR: "M 58,45 L 70,45 L 70,50 L 58,50 Z",
      mouth: "M 38,70 L 62,70", // Straight line
      filter: "drop-shadow(0px 0px 4px rgba(129, 140, 248, 0.8))",
      scale: 1,
    },
    stressed: {
      color: "#F87171", // Red 400
      glow: "rgba(248, 113, 113, 0.5)",
      // Asymmetric, jagged
      head: "M 22,35 L 18,65 L 45,88 L 82,62 L 78,28 L 52,12 L 35,22 Z",
      earL: "M 18,55 L 12,50 L 18,65",
      earR: "M 82,45 L 88,55 L 78,60",
      eyeL: "M 28,42 L 35,38 L 38,52 L 25,48 Z", // Distorted poly
      eyeR: "M 62,45 L 72,42 L 75,55 L 60,52 Z",
      mouth: "M 35,72 L 42,65 L 50,75 L 58,68 L 65,72", // Zigzag
      filter: "drop-shadow(0px 0px 15px rgba(248, 113, 113, 0.8))",
      scale: [1, 0.98, 1.02, 1],
    },
  };

  const currentVisual = visuals[currentState];

  return (
    <div className="w-full max-w-2xl mx-auto my-12 p-8 rounded-3xl bg-slate-900/90 backdrop-blur-xl border border-slate-700/50 shadow-2xl relative overflow-hidden">
      {/* Tech Grid Background */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(${currentVisual.color} 1px, transparent 1px), linear-gradient(90deg, ${currentVisual.color} 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      <div className="text-center mb-8 relative z-10">
        <h3 className="text-xl font-light text-slate-200 tracking-[0.2em] uppercase">
          Bio-Metric Analysis
        </h3>
        <div className="flex justify-center gap-2 mt-2">
          <span className="h-1 w-1 rounded-full bg-slate-500 animate-pulse" />
          <span className="h-1 w-1 rounded-full bg-slate-500 animate-pulse delay-75" />
          <span className="h-1 w-1 rounded-full bg-slate-500 animate-pulse delay-150" />
        </div>
      </div>

      <div className="relative h-72 flex items-center justify-center mb-8">
        <motion.div
          className="relative z-10"
          animate={{
            scale: currentVisual.scale,
            filter: currentVisual.filter,
          }}
          transition={{
            duration: currentState === "stressed" ? 0.2 : 4,
            repeat: Infinity,
            ease: currentState === "focused" ? "linear" : "easeInOut",
          }}
        >
          <svg
            viewBox="0 0 100 100"
            style={{ width: "200px", height: "200px" }}
            className="overflow-visible"
          >
            {/* Connection Nodes (Tech feel) */}
            <circle
              cx="50"
              cy="15"
              r="1"
              fill={currentVisual.color}
              className="opacity-50"
            />
            <circle
              cx="20"
              cy="40"
              r="1"
              fill={currentVisual.color}
              className="opacity-50"
            />
            <circle
              cx="80"
              cy="40"
              r="1"
              fill={currentVisual.color}
              className="opacity-50"
            />

            {/* Head Wireframe */}
            <motion.path
              d={currentVisual.head}
              fill="none"
              stroke={currentVisual.color}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              animate={{ d: currentVisual.head, stroke: currentVisual.color }}
              transition={{ duration: 0.6 }}
            />
            {/* Ears */}
            <motion.path
              d={currentVisual.earL}
              fill="none"
              stroke={currentVisual.color}
              strokeWidth="1"
              animate={{ d: currentVisual.earL, stroke: currentVisual.color }}
              transition={{ duration: 0.6 }}
            />
            <motion.path
              d={currentVisual.earR}
              fill="none"
              stroke={currentVisual.color}
              strokeWidth="1"
              animate={{ d: currentVisual.earR, stroke: currentVisual.color }}
              transition={{ duration: 0.6 }}
            />

            {/* Features group */}
            <g className="opacity-90">
              <motion.path
                d={currentVisual.eyeL}
                fill="none"
                stroke={currentVisual.color}
                strokeWidth="2"
                animate={{ d: currentVisual.eyeL, stroke: currentVisual.color }}
                transition={{ duration: 0.4 }}
              />
              <motion.path
                d={currentVisual.eyeR}
                fill="none"
                stroke={currentVisual.color}
                strokeWidth="2"
                animate={{ d: currentVisual.eyeR, stroke: currentVisual.color }}
                transition={{ duration: 0.4 }}
              />
              <motion.path
                d={currentVisual.mouth}
                fill="none"
                stroke={currentVisual.color}
                strokeWidth="2"
                animate={{
                  d: currentVisual.mouth,
                  stroke: currentVisual.color,
                }}
                transition={{ duration: 0.4 }}
              />
            </g>

            {/* Scanning Line (only in focused/stressed) */}
            {currentState !== "relaxed" && (
              <motion.line
                x1="0"
                y1="0"
                x2="100"
                y2="0"
                stroke={currentVisual.color}
                strokeWidth="0.5"
                opacity="0.3"
                animate={{ y1: [0, 100], y2: [0, 100] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              />
            )}
          </svg>
        </motion.div>

        {/* State Indicator */}
        <div className="absolute bottom-[-20px] text-center w-full">
          <span
            className="text-2xl font-bold font-mono uppercase tracking-widest transition-colors duration-300"
            style={{
              color: currentVisual.color,
              textShadow: `0 0 10px ${currentVisual.color}`,
            }}
          >
            {currentState}
          </span>
        </div>
      </div>

      {/* Slider */}
      <div className="relative z-20 px-4 mt-8">
        <div className="flex items-center gap-4">
          <span className="text-xs font-mono text-cyan-400">NORM</span>
          <input
            type="range"
            min="0"
            max="100"
            value={stressLevel}
            onChange={(e) => setStressLevel(Number(e.target.value))}
            className="w-full h-1 bg-slate-700 rounded-none appearance-none cursor-pointer accent-current hover:bg-slate-600 transition-colors"
            style={{ accentColor: currentVisual.color }}
          />
          <span className="text-xs font-mono text-red-400">CRIT</span>
        </div>
        <div className="flex justify-between mt-2 text-[10px] font-mono text-slate-500 uppercase">
          <span>0%</span>
          <span>50%</span>
          <span>100%</span>
        </div>
      </div>
    </div>
  );
}
