"use client";

import React, { useState, useLayoutEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Interface for a single ripple
interface Ripple {
  x: number;
  y: number;
  size: number;
  id: number;
}

export default function CalmRipple() {
  const [ripples, setRipples] = useState<Ripple[]>([]);

  // Cleanup ripples that are done to keep memory low
  // In a real prod app, useDebounce or just let AnimatePresence handle it
  // For simplicity, we just add them and let them visually disperse

  const addRipple = (e: React.MouseEvent) => {
    const container = e.currentTarget.getBoundingClientRect();
    const size = Math.max(container.width, container.height);
    const x = e.clientX - container.left - size / 2;
    const y = e.clientY - container.top - size / 2;

    const newRipple = { x, y, size, id: Date.now() };
    setRipples((prev) => [...prev, newRipple]);
  };

  return (
    <div
      onMouseDown={addRipple}
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        borderRadius: "inherit",
        pointerEvents: "auto",
        cursor: "pointer",
        zIndex: 10,
      }}
    >
      <AnimatePresence>
        {ripples.map((ripple) => (
          <motion.span
            key={ripple.id}
            initial={{ transform: "scale(0)", opacity: 0.5 }}
            animate={{ transform: "scale(4)", opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }} // Slightly faster but still viscous
            style={{
              position: "absolute",
              backgroundColor: "rgba(255, 255, 255, 0.8)", // More visible
              borderRadius: "50%",
              pointerEvents: "none",
              left: ripple.x,
              top: ripple.y,
              width: ripple.size,
              height: ripple.size,
            }}
            onAnimationComplete={() => {
              setRipples((prev) => prev.filter((r) => r.id !== ripple.id));
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
