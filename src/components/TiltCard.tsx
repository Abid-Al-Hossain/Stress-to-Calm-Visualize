"use client";

import React, { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  tiltMax?: number; // Max tilt in degrees (default 3 - subtle)
}

export default function TiltCard({
  children,
  className = "",
  tiltMax = 3,
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [hovering, setHovering] = useState(false);

  // Mouse position
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Springs for smooth tilting - REDUCED MOTION for Medical Grade Stability
  const mouseXSpring = useSpring(x, { stiffness: 400, damping: 90 }); // Very stiff, very damped
  const mouseYSpring = useSpring(y, { stiffness: 400, damping: 90 });

  // Extremely subtle tilt (max 1 degree)
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], [1, -1]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], [-1, 1]);

  // Use simple scale for hover
  const scale = useSpring(hovering ? 1.02 : 1, { stiffness: 300, damping: 20 });
  const yMove = useSpring(hovering ? -5 : 0, { stiffness: 300, damping: 20 });

  // Glare effect movement (moves opposite to tilt)
  const glareX = useTransform(mouseXSpring, [-0.5, 0.5], [0, 100]);
  const glareY = useTransform(mouseYSpring, [-0.5, 0.5], [0, 100]);
  const glareOpacity = useTransform(
    mouseXSpring,
    (val) => (hovering ? 0.3 : 0), // Only show glare on hover
  );

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();

    const width = rect.width;
    const height = rect.height;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Normalize mouse position to -0.5 to 0.5
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseEnter = () => {
    setHovering(true);
  };

  const handleMouseLeave = () => {
    setHovering(false);
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        scale,
        y: yMove,
        transformStyle: "preserve-3d",
        perspective: 1000,
      }}
    >
      <div style={{ transform: "translateZ(30px)" }}>{children}</div>

      {/* Subtle Glare Layer */}
      <motion.div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          borderRadius: "inherit",
          background: `linear-gradient(135deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.8) 50%, rgba(255,255,255,0) 100%)`,
          opacity: glareOpacity,
          zIndex: 10,
          pointerEvents: "none",
          mixBlendMode: "overlay",
          x: glareX,
          y: glareY,
        }}
      />
    </motion.div>
  );
}
