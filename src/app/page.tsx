"use client";

import Link from "next/link";

export default function Home() {
  return (
    <main>
      <section className="hero">
        <div className="container">
          <h1 className="title-gradient">
            Stress-to-Calm <br /> Visualizer
          </h1>
          <p className="subtitle">
            Understanding how "Home Tension" affects a child's mental state
            through symbolic, non-graphic visualization.
          </p>
          <div style={{ marginTop: "2rem" }}>
            <Link
              href="/register"
              className="btn btn-primary"
              style={{ marginRight: "1rem" }}
            >
              Create Account
            </Link>
            <Link href="#objectives" className="btn btn-outline">
              Learn More
            </Link>
          </div>
        </div>
      </section>

      <section id="introduction" className="container mt-8">
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
      </section>

      <section
        id="objectives"
        className="container"
        style={{ marginTop: "4rem", marginBottom: "4rem" }}
      >
        <h2 className="text-center mb-4">Project Objectives</h2>
        <div className="feature-grid">
          <div className="feature-card">
            <h3>Symbolic Visualization</h3>
            <p>
              Visually demonstrate how "home tension" affects a child's
              stress/anxiety state using colors, vignettes, and distortions
              rather than graphic depictions.
            </p>
          </div>
          <div className="feature-card">
            <h3>Interactive Control</h3>
            <p>
              Users can adjust "Home Tension" levels and view real-time changes
              in a Stress Meter and related indicators like focus, sleep, and
              fear.
            </p>
          </div>
          <div className="feature-card">
            <h3>Coping Mechanisms</h3>
            <p>
              Demonstrate relief through coping tool buttons (breathing,
              grounding, support) that trigger calming visual transitions and
              reduce stress levels.
            </p>
          </div>
        </div>
      </section>

      <section className="container mb-4">
        <div className="card" style={{ background: "#2C3E50", color: "white" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
            }}
          >
            <h2>Ready to Explore?</h2>
            <p
              style={{
                color: "#BDC3C7",
                marginTop: "1rem",
                marginBottom: "2rem",
              }}
            >
              Join the platform to access the educational visualization tool.
            </p>
            <Link href="/register" className="btn btn-secondary">
              Get Started Now
            </Link>
          </div>
        </div>
      </section>

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
