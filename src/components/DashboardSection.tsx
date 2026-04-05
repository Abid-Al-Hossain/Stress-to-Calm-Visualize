"use client";

import { motion } from "framer-motion";
import type { DashboardSnapshot } from "@/services/dashboardAnalytics";

interface DashboardSectionProps {
  snapshot: DashboardSnapshot;
}

const TEXT_PRIMARY = "#243b53";
const TEXT_SECONDARY = "#486581";
const TEXT_MUTED = "#5d7488";
const ACCENT = "#4a90d9";
const ACCENT_DEEP = "#2f6ea8";

function getBarWidth(value: number) {
  return `${Math.max(value, value > 0 ? 8 : 0)}%`;
}

export default function DashboardSection({ snapshot }: DashboardSectionProps) {
  const responseCoverage = snapshot.totalParticipants === 0
    ? 0
    : Math.round((snapshot.participantsWithSolutionSelections / snapshot.totalParticipants) * 100);
  const totalTrackedQuestions = snapshot.questionStats.length;

  return (
    <motion.section
      className="container"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.65, ease: "easeOut" }}
      style={{ marginBottom: "4rem" }}
    >
      <div
        style={{
          position: "relative",
          overflow: "hidden",
          borderRadius: "32px",
          border: "1px solid rgba(90,155,212,0.16)",
          background: "linear-gradient(180deg, rgba(246,251,255,0.98) 0%, rgba(235,245,251,0.98) 42%, rgba(255,255,255,0.98) 100%)",
          boxShadow: "0 28px 70px rgba(90,155,212,0.12)",
          padding: "2rem",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: "0 auto auto 0",
            width: "100%",
            height: "220px",
            background: "radial-gradient(circle at top left, rgba(99,179,237,0.18), rgba(99,179,237,0) 52%), radial-gradient(circle at top right, rgba(118,199,183,0.18), rgba(118,199,183,0) 48%)",
            pointerEvents: "none",
          }}
        />

        <div style={{ position: "relative", zIndex: 1, marginBottom: "1.8rem" }}>
          <div style={{ maxWidth: "760px" }}>
            <p
              style={{
                margin: "0 0 0.45rem",
                fontSize: "0.76rem",
                fontWeight: 800,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: ACCENT,
              }}
            >
              Survey Dashboard
            </p>
            <h2 style={{ margin: "0 0 0.75rem", color: TEXT_PRIMARY, fontSize: "clamp(1.7rem, 2vw, 2.2rem)" }}>
              Participant Response Summary
            </h2>
            <p style={{ margin: 0, color: TEXT_SECONDARY, lineHeight: 1.75, maxWidth: "860px", fontWeight: 500 }}>
              Mock baseline data with local updates after each completed session.
            </p>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "1rem",
            marginBottom: "1.8rem",
          }}
        >
          <div style={{ padding: "1.1rem 1.15rem", borderRadius: "22px", background: "linear-gradient(180deg, rgba(90,155,212,0.16), rgba(90,155,212,0.08))", border: "1px solid rgba(90,155,212,0.2)" }}>
            <div style={{ color: ACCENT_DEEP, fontSize: "0.75rem", fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "0.4rem" }}>
              Total Participants
            </div>
            <div style={{ color: TEXT_PRIMARY, fontSize: "2.15rem", fontWeight: 800, lineHeight: 1, marginBottom: "0.35rem" }}>{snapshot.totalParticipants}</div>
            <div style={{ color: TEXT_SECONDARY, fontSize: "0.84rem", fontWeight: 600 }}>Completed survey sessions</div>
          </div>
          <div style={{ padding: "1.1rem 1.15rem", borderRadius: "22px", background: "linear-gradient(180deg, rgba(118,199,183,0.16), rgba(118,199,183,0.07))", border: "1px solid rgba(118,199,183,0.22)" }}>
            <div style={{ color: "#2f7f74", fontSize: "0.75rem", fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "0.4rem" }}>
              Solutions Selected
            </div>
            <div style={{ color: TEXT_PRIMARY, fontSize: "2.15rem", fontWeight: 800, lineHeight: 1, marginBottom: "0.35rem" }}>{snapshot.totalSolutionSelections}</div>
            <div style={{ color: TEXT_SECONDARY, fontSize: "0.84rem", fontWeight: 600 }}>Total solution selections</div>
          </div>
          <div style={{ padding: "1.1rem 1.15rem", borderRadius: "22px", background: "linear-gradient(180deg, rgba(255,255,255,0.86), rgba(244,249,252,0.96))", border: "1px solid rgba(90,155,212,0.14)" }}>
            <div style={{ color: TEXT_MUTED, fontSize: "0.75rem", fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "0.4rem" }}>
              Survey Questions
            </div>
            <div style={{ color: TEXT_PRIMARY, fontSize: "2.15rem", fontWeight: 800, lineHeight: 1, marginBottom: "0.35rem" }}>{totalTrackedQuestions}</div>
            <div style={{ color: TEXT_SECONDARY, fontSize: "0.84rem", fontWeight: 600 }}>Questions included in the summary</div>
          </div>
          <div style={{ padding: "1.1rem 1.15rem", borderRadius: "22px", background: "linear-gradient(180deg, rgba(255,255,255,0.86), rgba(244,249,252,0.96))", border: "1px solid rgba(90,155,212,0.14)" }}>
            <div style={{ color: TEXT_MUTED, fontSize: "0.75rem", fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "0.4rem" }}>
              Selection Rate
            </div>
            <div style={{ color: TEXT_PRIMARY, fontSize: "2.15rem", fontWeight: 800, lineHeight: 1, marginBottom: "0.35rem" }}>{responseCoverage}%</div>
            <div style={{ color: TEXT_SECONDARY, fontSize: "0.84rem", fontWeight: 600 }}>Participants who selected a solution</div>
          </div>
        </div>

        <div style={{ marginBottom: "2rem" }}>
          <div style={{ padding: "1.2rem", borderRadius: "24px", background: "rgba(255,255,255,0.88)", border: "1px solid rgba(90,155,212,0.14)", boxShadow: "0 16px 34px rgba(90,155,212,0.06)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap", marginBottom: "0.95rem" }}>
              <h3 style={{ margin: 0, color: TEXT_PRIMARY }}>Solution Distribution</h3>
              <p style={{ margin: 0, color: TEXT_MUTED, fontSize: "0.9rem", fontWeight: 600 }}>4 solution categories</p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: "0.9rem" }}>
              {snapshot.solutionStats.map((solution) => (
                <div
                  key={solution.id}
                  style={{
                    padding: "1rem",
                    borderRadius: "20px",
                    background: "linear-gradient(180deg, rgba(248,251,255,1), rgba(255,255,255,0.98))",
                    border: "1px solid rgba(90,155,212,0.14)",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: "0.7rem", marginBottom: "0.55rem" }}>
                    <div style={{ color: TEXT_PRIMARY, fontWeight: 700 }}>{solution.label}</div>
                    <div style={{ color: ACCENT_DEEP, fontWeight: 800, fontSize: "1.05rem" }}>{solution.count}</div>
                  </div>
                  <div style={{ height: "8px", borderRadius: "999px", background: "rgba(90,155,212,0.1)", overflow: "hidden", marginBottom: "0.45rem" }}>
                    <div style={{ width: getBarWidth(solution.percentage), height: "100%", borderRadius: "999px", background: "linear-gradient(90deg, #5a9bd4, #76c7b7)" }} />
                  </div>
                  <div style={{ color: TEXT_SECONDARY, fontSize: "0.84rem", fontWeight: 600 }}>{solution.percentage}% of selections</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap", marginBottom: "0.95rem" }}>
            <h3 style={{ margin: 0, color: TEXT_PRIMARY }}>Question Responses</h3>
            <p style={{ margin: 0, color: TEXT_MUTED, fontSize: "0.9rem", fontWeight: 600 }}>{totalTrackedQuestions} survey questions</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1rem" }}>
            {snapshot.questionStats.map((question) => (
              <div
                key={question.id}
                style={{
                  padding: "1.1rem 1.15rem",
                  borderRadius: "22px",
                  background: "linear-gradient(180deg, rgba(255,255,255,0.98), rgba(246,251,255,0.98))",
                  border: "1px solid rgba(90,155,212,0.14)",
                  boxShadow: "0 14px 30px rgba(90,155,212,0.06)",
                }}
              >
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "0.8rem", marginBottom: "0.8rem" }}>
                  <div>
                    <div style={{ color: ACCENT_DEEP, fontSize: "0.76rem", fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "0.28rem" }}>
                      Question {question.id}
                    </div>
                    <div style={{ color: TEXT_PRIMARY, fontWeight: 700, lineHeight: 1.55 }}>{question.label}</div>
                  </div>
                  <div style={{ padding: "0.46rem 0.7rem", borderRadius: "999px", background: "rgba(90,155,212,0.12)", color: ACCENT_DEEP, fontSize: "0.78rem", fontWeight: 800, whiteSpace: "nowrap" }}>
                    {question.totalResponses} Responses
                  </div>
                </div>
                <div style={{ display: "grid", gap: "0.8rem" }}>
                  {question.options.map((option) => (
                    <div key={`${question.id}-${option.index}`} style={{ padding: "0.78rem 0.85rem", borderRadius: "16px", background: "rgba(255,255,255,0.94)", border: "1px solid rgba(90,155,212,0.12)" }}>
                      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: "0.8rem", marginBottom: "0.32rem" }}>
                        <div style={{ color: TEXT_PRIMARY, fontSize: "0.9rem", lineHeight: 1.5, fontWeight: 500 }}>{option.label}</div>
                        <div style={{ color: ACCENT_DEEP, fontWeight: 800, whiteSpace: "nowrap" }}>{option.count}</div>
                      </div>
                      <div style={{ height: "8px", borderRadius: "999px", background: "rgba(90,155,212,0.1)", overflow: "hidden", marginBottom: "0.2rem" }}>
                        <div style={{ width: getBarWidth(option.percentage), height: "100%", borderRadius: "999px", background: "linear-gradient(90deg, rgba(90,155,212,0.95), rgba(118,199,183,0.9))" }} />
                      </div>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.75rem" }}>
                        <div style={{ color: TEXT_SECONDARY, fontSize: "0.8rem", fontWeight: 600 }}>{option.percentage}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  );
}
