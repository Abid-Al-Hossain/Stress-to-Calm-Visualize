"use client";

import { useRef, useState, useSyncExternalStore } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import BreathingButton from "@/components/BreathingButton";
import DashboardSection from "@/components/DashboardSection";
import TiltCard from "@/components/TiltCard";
import StressToCalmPreview from "@/components/StressToCalmPreview";
import StressSurvey from "@/components/StressSurvey";
import InterventionGuide from "@/components/InterventionGuide";
import { type SolutionMethodId } from "@/data/dashboard";
import { AuthService } from "@/services/auth";
import { DashboardAnalyticsService } from "@/services/dashboardAnalytics";

// Staggered animation variants
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 50,
      damping: 20,
    },
  },
};

export default function Home() {
  const user = useSyncExternalStore(
    AuthService.subscribe,
    AuthService.getCurrentUser,
    () => null,
  );
  const [isSurveyOpen, setIsSurveyOpen] = useState(false);
  const [calculatedScore, setCalculatedScore] = useState<number | null>(null);
  const [isInterventionOpen, setIsInterventionOpen] = useState(false);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const visualizerRef = useRef<HTMLDivElement>(null);
  const dashboardSnapshot = useSyncExternalStore(
    DashboardAnalyticsService.subscribe,
    DashboardAnalyticsService.getSnapshot,
    DashboardAnalyticsService.getServerSnapshot,
  );

  const handleSurveyComplete = (score: number, answers: Record<number, number>) => {
    const sessionId = DashboardAnalyticsService.recordSurveySession({ answers });
    setActiveSessionId(sessionId);
    setCalculatedScore(score);
    setIsSurveyOpen(false);
    // Smooth scroll to visualizer after a short delay
    setTimeout(() => {
      visualizerRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 300);
  };

  const handleRetakeSurvey = () => {
    setIsInterventionOpen(false);
    setCalculatedScore(null);
    setActiveSessionId(null);
    setTimeout(() => setIsSurveyOpen(true), 300);
  };

  const handleSolutionSelect = (solutionId: SolutionMethodId) => {
    DashboardAnalyticsService.recordSolutionSelection(activeSessionId, solutionId);
  };

  return (
    <>
      {/* Modals */}
      <AnimatePresence>
        {isSurveyOpen && (
          <StressSurvey
            onComplete={handleSurveyComplete}
            onClose={() => setIsSurveyOpen(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isInterventionOpen && calculatedScore !== null && (
          <InterventionGuide
            score={calculatedScore}
            onClose={() => setIsInterventionOpen(false)}
            onRetake={handleRetakeSurvey}
            onSelectSolution={handleSolutionSelect}
          />
        )}
      </AnimatePresence>

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
              Understanding how &quot;Home Tension&quot; affects a child&apos;s mental state
              through symbolic, non-graphic visualization.
            </motion.p>
            <motion.div className="hero-actions" variants={itemVariants}>
              {user ? (
                <div className="hero-user-pill">
                  Welcome back, {user.name}
                </div>
              ) : (
                <BreathingButton href="/register" variant="primary">
                  Create Account
                </BreathingButton>
              )}
              <motion.button
                id="answer-questions-btn"
                onClick={() => setIsSurveyOpen(true)}
                className="btn btn-outline"
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.97 }}
              >
                {calculatedScore !== null ? "Retake Stress Assessment" : "Check Your Stress Level"}
              </motion.button>
            </motion.div>

            <motion.div
              ref={visualizerRef}
              variants={itemVariants}
              className="hero-visualizer"
            >
              <div className="hero-visualizer-inner">
                <StressToCalmPreview externalScore={calculatedScore} />

                {/* Calming guide button - shown after survey is complete */}
                <AnimatePresence>
                  {calculatedScore !== null && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                      style={{ display: "flex", justifyContent: "center", marginTop: "1.5rem" }}
                    >
                      <motion.button
                        id="get-solution-btn"
                        onClick={() => setIsInterventionOpen(true)}
                        whileHover={{ scale: 1.06, y: -3 }}
                        whileTap={{ scale: 0.97 }}
                        style={{
                          background: "linear-gradient(135deg, #63b3ed, #76c7b7)",
                          border: "none",
                          borderRadius: "99px",
                          color: "#0f172a",
                          padding: "0.9rem 2.5rem",
                          cursor: "pointer",
                          fontSize: "1rem",
                          fontWeight: 700,
                          letterSpacing: "0.02em",
                          boxShadow: "0 8px 30px rgba(99,179,237,0.35)",
                        }}
                      >
                        Open Calming Guide
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
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
              anxiety, hypervigilance, and difficulty concentrating - effects that
              are often invisible and hard to explain.
            </p>
            <p className="mt-4">
              The <strong>Stress-to-Calm Visualizer</strong> visually represents
              how &quot;home tension&quot; can influence a child&apos;s stress level through
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
            <TiltCard className="feature-card" flat>
              <div className="feature-icon" style={{ color: "#3b82f6" }}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3>Symbolic Visualization</h3>
              <p>
                Visually demonstrate how &quot;home tension&quot; affects a child&apos;s
                stress/anxiety state using colors, vignettes, and distortions
                rather than graphic depictions.
              </p>
            </TiltCard>
            <TiltCard className="feature-card" flat>
              <div className="feature-icon" style={{ color: "#14b8a6" }}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 13.5V3.75m0 9.75a1.5 1.5 0 010 3m0-3a1.5 1.5 0 000 3m0 3.75V16.5m12-3V3.75m0 9.75a1.5 1.5 0 010 3m0-3a1.5 1.5 0 000 3m0 3.75V16.5m-6-9V3.75m0 3.75a1.5 1.5 0 010 3m0-3a1.5 1.5 0 000 3m0 9.75V10.5" />
                </svg>
              </div>
              <h3>Interactive Assessment</h3>
              <p>
                Users complete 5 scored assessment questions to calculate a stress
                level, followed by 5 non-scored preference questions about recovery
                and calming support.
              </p>
            </TiltCard>
            <TiltCard className="feature-card" flat>
              <div className="feature-icon" style={{ color: "#ec4899" }}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                </svg>
              </div>
              <h3>Coping Mechanisms</h3>
              <p>
                Demonstrate relief through guided interventions - breathing exercises,
                grounding techniques, and personalized advice - that match the user&apos;s
                assessed stress tier.
              </p>
            </TiltCard>
          </motion.div>
        </section>

        <DashboardSection snapshot={dashboardSnapshot} />

        <motion.section
          className="container mb-4"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <div className="card text-center">
            <div className="cta-card">
              <h2>Ready to Explore?</h2>
              <p
                className="text-muted"
                style={{ marginTop: "1rem", marginBottom: "2rem" }}
              >
                Take the stress assessment to see your level, view your personal stress visualization, and open calming guidance matched to your result.
              </p>
              <motion.button
                id="cta-answer-btn"
                onClick={() => setIsSurveyOpen(true)}
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="btn btn-primary"
              >
                {calculatedScore !== null ? "Retake Stress Assessment" : "Check Your Stress Level"}
              </motion.button>
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
    </>
  );
}
