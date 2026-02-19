"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, Variants } from "framer-motion";
import BreathingButton from "@/components/BreathingButton";
import TiltCard from "@/components/TiltCard";
import StressToCalmPreview from "@/components/StressToCalmPreview";
import { AuthService, User } from "@/services/auth";

// Staggered animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2, // Stagger each child by 0.2s
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 50,
      damping: 20,
    },
  },
};

export default function Home() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    setUser(AuthService.getCurrentUser());

    const handleAuthChange = () => {
      setUser(AuthService.getCurrentUser());
    };

    window.addEventListener("auth-change", handleAuthChange);
    return () => window.removeEventListener("auth-change", handleAuthChange);
  }, []);

  return (
    <main>
      <motion.section
        className="hero"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="container">
          <motion.h1 className="title-gradient" variants={itemVariants}>
            Stress-to-Calm <br /> Visualizer
          </motion.h1>
          <motion.p className="subtitle" variants={itemVariants}>
            Understanding how "Home Tension" affects a child's mental state
            through symbolic, non-graphic visualization.
          </motion.p>
          <motion.div style={{ marginTop: "2rem" }} variants={itemVariants}>
            {user ? (
              <div className="inline-block px-6 py-3 bg-white/50 backdrop-blur-md rounded-full border border-white/60 shadow-sm text-gray-700 font-medium">
                Welcome back, {user.name}
              </div>
            ) : (
              <BreathingButton href="/register" variant="primary">
                Create Account
              </BreathingButton>
            )}
            <Link
              href="#objectives"
              className="btn btn-outline"
              style={{ marginLeft: "1rem" }}
            >
              Learn More
            </Link>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="mt-12 w-full flex justify-center"
          >
            <StressToCalmPreview />
          </motion.div>
        </div>
      </motion.section>

      <motion.section
        id="introduction"
        className="container mt-8"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="card">
          <h2>Introduction</h2>
          <p className="mt-2" style={{ maxWidth: "800px", lineHeight: "1.8" }}>
            Children who are exposed to domestic violence may experience fear,
            anxiety, hypervigilance, and difficulty concentrating—effects that
            are often invisible and hard to explain.
          </p>
          <p className="mt-4">
            The <strong>Stress-to-Calm Visualizer</strong> visually represents
            how "home tension" can influence a child's stress level through
            changes in color tone, vignette/tunnel vision, mild distortion, and
            calming transitions when coping tools are selected.
          </p>
          <div
            className="alert alert-info mt-4"
            style={{
              background: "#E3F2FD",
              padding: "1rem",
              borderRadius: "8px",
              borderLeft: "4px solid #4A90E2",
              marginTop: "2rem",
            }}
          >
            <strong>Educational Disclaimer:</strong> This system is designed
            strictly for educational and demonstrative purposes. It provides
            symbolic visualizations and is <strong>not</strong> a medical or
            diagnostic tool.
          </div>
        </div>
      </motion.section>

      <section
        id="objectives"
        className="container"
        style={{ marginTop: "4rem", marginBottom: "4rem" }}
      >
        <h2 className="text-center mb-4">Project Objectives</h2>
        <motion.div
          className="feature-grid"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={containerVariants}
        >
          <TiltCard className="feature-card">
            <div className="mb-4 text-4xl text-blue-500">
              {/* Eye Icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-12 h-12"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <h3>Symbolic Visualization</h3>
            <p>
              Visually demonstrate how "home tension" affects a child's
              stress/anxiety state using colors, vignettes, and distortions
              rather than graphic depictions.
            </p>
          </TiltCard>
          <TiltCard className="feature-card">
            <div className="mb-4 text-4xl text-teal-500">
              {/* Sliders Icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-12 h-12"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 13.5V3.75m0 9.75a1.5 1.5 0 010 3m0-3a1.5 1.5 0 000 3m0 3.75V16.5m12-3V3.75m0 9.75a1.5 1.5 0 010 3m0-3a1.5 1.5 0 000 3m0 3.75V16.5m-6-9V3.75m0 3.75a1.5 1.5 0 010 3m0-3a1.5 1.5 0 000 3m0 9.75V10.5"
                />
              </svg>
            </div>
            <h3>Interactive Control</h3>
            <p>
              Users can adjust "Home Tension" levels and view real-time changes
              in a Stress Meter and related indicators like focus, sleep, and
              fear.
            </p>
          </TiltCard>
          <TiltCard className="feature-card">
            <div className="mb-4 text-4xl text-pink-500">
              {/* Heart Icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-12 h-12"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                />
              </svg>
            </div>
            <h3>Coping Mechanisms</h3>
            <p>
              Demonstrate relief through coping tool buttons (breathing,
              grounding, support) that trigger calming visual transitions and
              reduce stress levels.
            </p>
          </TiltCard>
        </motion.div>
      </section>

      <motion.section
        className="container mb-4"
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
      >
        <div className="card text-center">
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <h2>Ready to Explore?</h2>
            <p
              className="text-muted"
              style={{
                marginTop: "1rem",
                marginBottom: "2rem",
              }}
            >
              Join the platform to access the educational visualization tool.
            </p>
            {user ? (
              <p className="text-xl font-medium text-slate-700">
                You are currently logged in as{" "}
                <span className="text-blue-600">{user.name}</span>
              </p>
            ) : (
              <BreathingButton href="/register" variant="primary">
                Get Started Now
              </BreathingButton>
            )}
          </div>
        </div>
      </motion.section>

      <footer
        className="container text-center text-muted"
        style={{ padding: "2rem 0", borderTop: "1px solid #eee" }}
      >
        <p>© 2026 Stress-to-Calm Visualizer.</p>
        <p style={{ fontSize: "0.8rem", marginTop: "0.5rem" }}>
          By Ahmed Talal Wazih, Fahad Bin Aziz Nabil, Abid Al Hossain
        </p>
      </footer>
    </main>
  );
}
