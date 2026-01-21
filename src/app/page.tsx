"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import BreathingButton from "@/components/BreathingButton";

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
            <BreathingButton href="/register" variant="primary">
              Create Account
            </BreathingButton>
            <Link
              href="#objectives"
              className="btn btn-outline"
              style={{ marginLeft: "1rem" }}
            >
              Learn More
            </Link>
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
            Computer Graphics plays a vital role in visualizing complex
            real-world concepts in a simple and intuitive manner. Children who
            are exposed to domestic violence may experience fear, anxiety,
            hypervigilance, and difficulty concentrating—effects that are often
            invisible and hard to explain.
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
          <motion.div className="feature-card" variants={itemVariants}>
            <h3>Symbolic Visualization</h3>
            <p>
              Visually demonstrate how "home tension" affects a child's
              stress/anxiety state using colors, vignettes, and distortions
              rather than graphic depictions.
            </p>
          </motion.div>
          <motion.div className="feature-card" variants={itemVariants}>
            <h3>Interactive Control</h3>
            <p>
              Users can adjust "Home Tension" levels and view real-time changes
              in a Stress Meter and related indicators like focus, sleep, and
              fear.
            </p>
          </motion.div>
          <motion.div className="feature-card" variants={itemVariants}>
            <h3>Coping Mechanisms</h3>
            <p>
              Demonstrate relief through coping tool buttons (breathing,
              grounding, support) that trigger calming visual transitions and
              reduce stress levels.
            </p>
          </motion.div>
        </motion.div>
      </section>

      <motion.section
        className="container mb-4"
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
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
            <BreathingButton href="/register" variant="primary">
              Get Started Now
            </BreathingButton>
          </div>
        </div>
      </motion.section>

      <footer
        className="container text-center text-muted"
        style={{ padding: "2rem 0", borderTop: "1px solid #eee" }}
      >
        <p>
          © 2026 Stress-to-Calm Visualizer. Computer Graphics Course Project.
        </p>
        <p style={{ fontSize: "0.8rem", marginTop: "0.5rem" }}>
          Submitted by: Ahmed Talal Wazih, Fahad Bin Aziz Nabil, Abid Al Hossain
        </p>
      </footer>
    </main>
  );
}
