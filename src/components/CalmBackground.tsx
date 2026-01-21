"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function CalmBackground() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  // Organic blob configurations
  // We use very long durations and varying scales to create a "lava lamp" effect
  const blobs = [
    {
      color: "#DAF7A6", // Soft Lime
      size: "400px",
      initial: { x: -100, y: -100 },
      animate: {
        x: [0, 100, -50, 0],
        y: [0, 50, 100, 0],
        scale: [1, 1.2, 0.9, 1],
      },
      duration: 25,
    },
    {
      color: "#FFC300", // Soft Amber
      size: "350px",
      initial: { x: "80vw", y: "10vh" },
      animate: {
        x: ["80vw", "70vw", "85vw", "80vw"],
        y: ["10vh", "30vh", "15vh", "10vh"],
        scale: [1, 0.8, 1.1, 1],
      },
      duration: 30,
    },
    {
      color: "#FF5733", // Soft Coral (low opacity)
      size: "500px",
      initial: { x: "20vw", y: "60vh" },
      animate: {
        x: ["20vw", "40vw", "10vw", "20vw"],
        y: ["60vh", "50vh", "70vh", "60vh"],
        scale: [1.1, 0.9, 1.2, 1.1],
      },
      duration: 35,
    },
    {
      color: "#C70039", // Deep Soft Red (low opacity)
      size: "300px",
      initial: { x: "60vw", y: "80vh" },
      animate: {
        x: ["60vw", "50vw", "70vw", "60vw"],
        y: ["80vh", "70vh", "90vh", "80vh"],
        scale: [0.9, 1.1, 0.8, 0.9],
      },
      duration: 28,
    },
  ];

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: -1,
        overflow: "hidden",
        pointerEvents: "none",
        filter: "blur(60px)", // Heavy blur for "gooey" or "cloud-like" feel
        opacity: 0.4, // Subtle presence
      }}
    >
      {blobs.map((blob, i) => (
        <motion.div
          key={i}
          style={{
            position: "absolute",
            width: blob.size,
            height: blob.size,
            borderRadius: "50%",
            backgroundColor: blob.color,
            x: blob.initial.x,
            y: blob.initial.y,
          }}
          animate={blob.animate}
          transition={{
            duration: blob.duration,
            repeat: Infinity,
            repeatType: "mirror",
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
