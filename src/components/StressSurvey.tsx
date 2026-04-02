"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";

// ── Scoring data from stress_scoring_system.pdf ──────────────────────────────

interface Option {
  label: string;
  labelBn: string;
  score: number;
}

interface Question {
  id: number;
  en: string;
  bn: string;
  category: string;
  scored: boolean;
  options: Option[];
}

interface AnswerState {
  score: number;
  optionIndex: number;
}

// ── Survey sections ───────────────────────────────────────────────────────────

interface Section {
  id: string;
  label: string;
  labelBn: string;
  emoji: string;
  color: string;
  questions: number[]; // question IDs in this section
}

interface SurveyPart {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  color: string;
  questionIds: number[];
}

const SECTIONS: Section[] = [
  {
    id: "emotional",
    label: "Emotional State",
    labelBn: "আবেগের অবস্থা",
    emoji: "💭",
    color: "#5a9bd4",
    questions: [1, 2],
  },
  {
    id: "physical",
    label: "Physical Response",
    labelBn: "শারীরিক প্রতিক্রিয়া",
    emoji: "🫀",
    color: "#fb923c",
    questions: [3, 4],
  },
  {
    id: "perception",
    label: "Stress Perception",
    labelBn: "স্ট্রেসের অনুভূতি",
    emoji: "🎨",
    color: "#a78bfa",
    questions: [5, 6],
  },
  {
    id: "recovery",
    label: "Recovery & Coping",
    labelBn: "সুস্থতা ও সামলানো",
    emoji: "🌱",
    color: "#4ade80",
    questions: [7, 8, 9, 10],
  },
];

const SURVEY_PARTS: SurveyPart[] = [
  {
    id: "assessment",
    title: "Stress Level Assessment",
    subtitle: "These first questions determine your stress score.",
    badge: "Scored",
    color: "#5a9bd4",
    questionIds: [1, 2, 3, 4, 5],
  },
  {
    id: "preferences",
    title: "Recovery & Support Preferences",
    subtitle: "These questions do not affect your score. They describe calming preferences and recovery style.",
    badge: "Not scored",
    color: "#76c7b7",
    questionIds: [6, 7, 8, 9, 10],
  },
];

const QUESTIONS: Question[] = [
  // ── Section 1: Emotional State ───────────────────────────────────────────
  {
    id: 1,
    en: "When there is tension or conflict at home, what feeling do you notice most?",
    bn: "বাড়িতে ঝগড়া বা উত্তেজনাপূর্ণ পরিস্থিতি হলে, আপনি কোন অনুভূতিটি সবচেয়ে বেশি অনুভব করেন?",
    category: "Emotional State",
    scored: true,
    options: [
      { label: "Fear", labelBn: "ভয়", score: 18 },
      { label: "Anxiety / Nervousness", labelBn: "উদ্বেগ / অস্থিরতা", score: 20 },
      { label: "Sadness", labelBn: "দুঃখ", score: 10 },
      { label: "Confusion", labelBn: "বিভ্রান্তি / বুঝতে না পারা", score: 12 },
      { label: "Anger", labelBn: "রাগ", score: 15 },
      { label: "Feeling numb (no strong emotion)", labelBn: "অসংবেদনশীল লাগা", score: 17 },
    ],
  },
  {
    id: 2,
    en: "How does your body usually react during stressful situations?",
    bn: "চাপপূর্ণ পরিস্থিতির সময় আপনার শরীর সাধারণত কীভাবে প্রতিক্রিয়া করে?",
    category: "Emotional State",
    scored: true,
    options: [
      { label: "Trouble breathing", labelBn: "শ্বাস নিতে কষ্ট হওয়া", score: 25 },
      { label: "Racing thoughts", labelBn: "মাথায় অনেক চিন্তা একসাথে ঘোরা", score: 20 },
      { label: "Feeling frozen / unable to react", labelBn: "স্থির হয়ে যাওয়া / কিছু করতে না পারা", score: 23 },
      { label: "Difficulty focusing", labelBn: "মনোযোগ ধরে রাখতে কষ্ট হওয়া", score: 15 },
      { label: "No clear physical reaction", labelBn: "কোনো স্পষ্ট শারীরিক প্রতিক্রিয়া নেই", score: 2 },
    ],
  },
  // ── Section 2: Physical Response ─────────────────────────────────────────
  {
    id: 3,
    en: "After a stressful event ends, how long does the stress linger?",
    bn: "ঝগড়া বা সমস্যার পরেও কি আপনার মনে চাপ বা স্ট্রেস থেকে যায়?",
    category: "Physical Response",
    scored: true,
    options: [
      { label: "Yes, for a short time (minutes)", labelBn: "হ্যাঁ, কিন্তু অল্প সময়ের জন্য (মিনিট খানেক)", score: 18 },
      { label: "Yes, for a long time (hours or more)", labelBn: "হ্যাঁ, অনেকক্ষণ বা দীর্ঘ সময় (ঘণ্টার বেশি)", score: 30 },
      { label: "No, it passes quickly", labelBn: "না, দ্রুত চলে যায়", score: 0 },
      { label: "Not sure", labelBn: "নিশ্চিত না", score: 10 },
    ],
  },
  {
    id: 4,
    en: "During stressful moments, how does the world around you feel?",
    bn: "চাপের মুহূর্তে আপনার চারপাশের পৃথিবী কেমন মনে হয়?",
    category: "Physical Response",
    scored: true,
    options: [
      { label: "Dark or dull (dim, lifeless)", labelBn: "অন্ধকার বা নিস্তেজ লাগে", score: 8 },
      { label: "Blurred or unclear", labelBn: "ঝাপসা বা অস্পষ্ট লাগে", score: 10 },
      { label: "Too loud or overwhelming", labelBn: "খুব জোরে বা সহ্য করা কঠিন মনে হয়", score: 13 },
      { label: "Tight or closing in (space shrinking)", labelBn: "চারপাশ সংকুচিত বা চাপা মনে হয়", score: 15 },
      { label: "Normal, no change", labelBn: "স্বাভাবিক লাগে", score: 0 },
    ],
  },
  // ── Section 3: Stress Perception ─────────────────────────────────────────
  {
    id: 5,
    en: "Which visual effect best matches how stress feels to you?",
    bn: "চাপের সময় আপনার অনুভূতির সাথে কোন দৃশ্যগত পরিবর্তনটি সবচেয়ে বেশি মিলে যায়?",
    category: "Stress Perception",
    scored: true,
    options: [
      { label: "Darkening colors (everything seems dimmer)", labelBn: "রং গাঢ় বা অন্ধকার হয়ে যাওয়া", score: 4 },
      { label: "Tunnel vision (seeing only straight ahead)", labelBn: "চারপাশ কম দেখা, শুধু সামনে দেখা", score: 8 },
      { label: "Shaking or distortion (things look warped)", labelBn: "কাঁপা বা বিকৃত দেখা", score: 9 },
      { label: "Fast or chaotic movement (everything too fast)", labelBn: "দ্রুত বা বিশৃঙ্খল মনে হওয়া", score: 7 },
      { label: "Fading or emptiness (things disappearing)", labelBn: "ধীরে ধীরে মিলিয়ে যাওয়া বা শূন্য লাগা", score: 10 },
    ],
  },
  {
    id: 6,
    en: "What helps you feel calmer after a stressful situation?",
    bn: "চাপপূর্ণ পরিস্থিতির পর আপনাকে শান্ত হতে সবচেয়ে বেশি কী সাহায্য করে?",
    category: "Stress Perception",
    scored: false,
    options: [
      { label: "Deep breathing (slow, controlled breaths)", labelBn: "গভীর শ্বাস নেওয়া", score: 0 },
      { label: "Being alone (quiet time to yourself)", labelBn: "একাই থাকা", score: 0 },
      { label: "Talking to someone (sharing feelings)", labelBn: "কারও সাথে কথা বলা", score: 0 },
      { label: "Music or silence", labelBn: "সঙ্গীত শোনা বা নীরবতা", score: 0 },
      { label: "Sleep or rest", labelBn: "ঘুম বা বিশ্রাম", score: 0 },
    ],
  },
  // ── Section 4: Recovery & Coping ─────────────────────────────────────────
  {
    id: 7,
    en: "How quickly do you usually feel calm again after stress?",
    bn: "আপনি সাধারণত কত দ্রুত আবার শান্ত অনুভব করেন?",
    category: "Recovery & Coping",
    scored: false,
    options: [
      { label: "Very slowly (takes hours or the rest of the day)", labelBn: "খুব ধীরে (অনেক ঘণ্টা বা পুরোদিন)", score: 0 },
      { label: "Gradually (step by step over time)", labelBn: "ধীরে ধীরে (সময়ের সাথে)", score: 0 },
      { label: "Quickly (within minutes)", labelBn: "দ্রুত (কয়েক মিনিটের মধ্যে)", score: 0 },
      { label: "It varies (sometimes fast, sometimes slow)", labelBn: "কখনো দ্রুত, কখনো অনেক দেরি", score: 0 },
    ],
  },
  {
    id: 8,
    en: "Which visual change best represents the feeling of becoming calm?",
    bn: "আবার শান্ত হওয়ার অনুভূতিকে কোন দৃশ্যগত পরিবর্তনটি সবচেয়ে ভালোভাবে প্রকাশ করে?",
    category: "Recovery & Coping",
    scored: false,
    options: [
      { label: "Brighter colors (everything gets lighter and clearer)", labelBn: "উজ্জ্বল রং (সব কিছু হালকা ও স্পষ্ট হয়)", score: 0 },
      { label: "Clear vision (sharp and focused)", labelBn: "স্পষ্ট দেখা (পরিষ্কার ও মনোযোগী)", score: 0 },
      { label: "Slower movement (things settle, feel steady)", labelBn: "ধীরে চলা (সব কিছু শান্ত হয়)", score: 0 },
      { label: "Feeling safe (warmth, comfort, security)", labelBn: "নিরাপদ অনুভব করা (আরাম ও নিরাপত্তা)", score: 0 },
    ],
  },
  {
    id: 9,
    en: "Would a visual animation help you express feelings that are difficult to put into words?",
    bn: "যে অনুভূতিগুলো কথায় বোঝানো কঠিন, সেগুলো কি ভিজ্যুয়াল অ্যানিমেশনের মাধ্যমে বোঝানো সহজ হবে?",
    category: "Recovery & Coping",
    scored: false,
    options: [
      { label: "Yes, absolutely — visuals help more than words", labelBn: "হ্যাঁ, অবশ্যই — ভিজ্যুয়াল কথার চেয়ে ভালো", score: 0 },
      { label: "Maybe, depending on the situation", labelBn: "হয়তো, পরিস্থিতির উপর নির্ভর করে", score: 0 },
      { label: "No, I prefer words or talking", labelBn: "না, আমি কথা বলাকে প্রাধান্য দিই", score: 0 },
    ],
  },
  {
    id: 10,
    en: "Which best describes how stress recovery feels for you?",
    bn: "স্ট্রেস থেকে সুস্থ হয়ে ওঠার প্রক্রিয়াকে আপনার কাছে কোনটি সবচেয়ে ভালোভাবে বর্ণনা করে?",
    category: "Recovery & Coping",
    scored: false,
    options: [
      { label: "Smooth and gradual (like a tide slowly going out)", labelBn: "মসৃণ ও ধীরে ধীরে (ঢেউয়ের মতো)", score: 0 },
      { label: "Sudden shift (like a switch flipping to calm)", labelBn: "হঠাৎ পরিবর্তন (একটি সুইচের মতো)", score: 0 },
      { label: "A mix of both — unpredictable", labelBn: "দুটোর মিশ্রণ — অনিশ্চিত", score: 0 },
    ],
  },
];

// ── Component ────────────────────────────────────────────────────────────────

interface StressSurveyProps {
  onComplete: (score: number) => void;
  onClose: () => void;
}

export default function StressSurvey({ onComplete, onClose }: StressSurveyProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, AnswerState>>({});
  const [viewportWidth, setViewportWidth] = useState(1024);

  const question = QUESTIONS[currentIndex];
  const total = QUESTIONS.length;
  const progress = ((currentIndex + 1) / total) * 100;
  const isLast = currentIndex === total - 1;
  const isLastScoredQuestion = question.id === 5;
  const selectedIndex = useMemo(() => {
    const answer = answers[question.id];
    return answer ? answer.optionIndex : null;
  }, [answers, question]);

  // Determine current section
  const currentSection = SECTIONS.find((s) => s.questions.includes(question.id)) ?? SECTIONS[0];
  const sectionIndex = SECTIONS.indexOf(currentSection);
  const stepInSection = currentSection.questions.indexOf(question.id) + 1;
  const stepsInSection = currentSection.questions.length;
  const currentPart = SURVEY_PARTS.find((part) => part.questionIds.includes(question.id)) ?? SURVEY_PARTS[0];
  const currentPartIndex = SURVEY_PARTS.indexOf(currentPart);
  const stepInPart = currentPart.questionIds.indexOf(question.id) + 1;
  const stepsInPart = currentPart.questionIds.length;
  const isFirstQuestionInPart = stepInPart === 1;

  const handleSelect = (score: number, optionIndex: number) => {
    setAnswers((prev) => ({ ...prev, [question.id]: { score, optionIndex } }));
  };

  const handleNext = () => {
    if (selectedIndex === null) return;
    if (isLast) {
      const totalScore = QUESTIONS.filter((q) => q.scored).reduce(
        (acc, q) => acc + (answers[q.id]?.score ?? 0),
        0
      );
      onComplete(Math.min(totalScore, 100));
    } else {
      setCurrentIndex((i) => i + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex === 0) return;
    setCurrentIndex((i) => i - 1);
  };

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    const previousOverscroll = document.body.style.overscrollBehavior;
    document.body.style.overflow = "hidden";
    document.body.style.overscrollBehavior = "none";
    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.style.overscrollBehavior = previousOverscroll;
    };
  }, []);

  useEffect(() => {
    const updateViewport = () => setViewportWidth(window.innerWidth);
    updateViewport();
    window.addEventListener("resize", updateViewport);
    return () => window.removeEventListener("resize", updateViewport);
  }, []);

  const isMobile = viewportWidth < 640;
  const isTablet = viewportWidth < 900;

  return (
    // Backdrop — soft blur matching site background
    <motion.div
      id="stress-survey-modal"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: isMobile ? "0.5rem" : "1rem",
        background: "rgba(180, 215, 235, 0.68)",
      }}
    >
      <motion.div
        initial={{ scale: 0.94, opacity: 0, y: 18 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.94, opacity: 0, y: 18 }}
        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
        style={{
          width: "100%",
          maxWidth: isTablet ? "100%" : "940px",
          height: isMobile ? "calc(100vh - 1rem)" : "min(84vh, 760px)",
          // Glass card — same as .card / .auth-card on the site
          background: "rgba(255, 255, 255, 0.96)",
          border: "1px solid rgba(255, 255, 255, 0.55)",
          borderRadius: isMobile ? "20px" : "24px",
          padding: isMobile ? "0.9rem 0.9rem 0.85rem" : "1.15rem 1.15rem 0.95rem",
          boxShadow: "0 20px 60px rgba(90, 155, 212, 0.18), 0 4px 16px rgba(30, 41, 59, 0.06)",
          maxHeight: "84vh",
          position: "relative",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            background: `linear-gradient(180deg, ${currentSection.color}10 0%, rgba(255,255,255,0) 22%)`,
          }}
        />
        <button
          id="survey-close-btn"
          onClick={onClose}
          style={{
            position: "absolute",
            top: isMobile ? "0.85rem" : "1rem",
            right: isMobile ? "0.85rem" : "1rem",
            zIndex: 4,
            background: "rgba(255,255,255,0.9)",
            border: "1px solid rgba(90,155,212,0.16)",
            cursor: "pointer",
            color: "#607d8b",
            fontSize: "1.1rem",
            lineHeight: 1,
            width: isMobile ? "36px" : "38px",
            height: isMobile ? "36px" : "38px",
            borderRadius: "50%",
            transition: "background 0.2s, color 0.2s",
            boxShadow: "0 8px 20px rgba(90,155,212,0.08)",
          }}
        >
          x
        </button>
        <div
          style={{
            position: "relative",
            zIndex: 1,
            flex: 1,
            minHeight: 0,
            overflow: "hidden",
            paddingBottom: "0.15rem",
          }}
        >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isTablet ? "1fr" : "minmax(280px, 0.92fr) minmax(320px, 1.08fr)",
            gap: "1rem",
            alignItems: "stretch",
            height: "100%",
            minHeight: 0,
          }}
        >
          <div
            style={{
              position: "relative",
              zIndex: 1,
              display: "flex",
              flexDirection: "column",
              gap: "0.8rem",
              minHeight: 0,
              overflowY: isTablet ? "visible" : "auto",
              overscrollBehavior: "contain",
              WebkitOverflowScrolling: "touch",
              paddingRight: isTablet ? "0" : "0.15rem",
            }}
          >
            <div style={{ display: "flex", alignItems: "flex-start", gap: "0.85rem", padding: isMobile ? "0.85rem 3.1rem 0.85rem 0.9rem" : "0.9rem 3.5rem 0.9rem 1rem", borderRadius: "18px", background: "rgba(255,255,255,0.72)", border: "1px solid rgba(90,155,212,0.14)", boxShadow: "0 10px 30px rgba(90,155,212,0.08)" }}>
              <div style={{ flex: 1 }}>
                <p style={{ margin: "0 0 0.35rem", fontSize: "0.78rem", fontWeight: 800, letterSpacing: "0.16em", textTransform: "uppercase", color: currentPart.color }}>
                  {currentPart.title}
                </p>
                <p style={{ margin: "0 0 0.6rem", color: "#78909c", fontSize: "0.9rem", lineHeight: 1.6 }}>
                  {currentPart.subtitle}
                </p>
                <motion.div
                  key={currentSection.id}
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.4rem",
                    padding: "0.34rem 0.88rem",
                    borderRadius: "99px",
                    background: `${currentSection.color}18`,
                    border: `1.5px solid ${currentSection.color}44`,
                    marginBottom: "0.55rem",
                  }}
                >
                  <span style={{ fontSize: "0.85rem" }}>{currentSection.emoji}</span>
                  <span style={{ fontSize: "0.72rem", fontWeight: 700, color: currentSection.color, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                    {currentSection.label}
                  </span>
                  <span style={{ fontSize: "0.68rem", color: currentSection.color, opacity: 0.7 }}>
                    - {stepInSection}/{stepsInSection}
                  </span>
                </motion.div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
                  <p style={{ fontSize: "0.82rem", color: "#78909c" }}>
                    {currentPart.id === "assessment" ? "Assessment" : "Preferences"} Question {stepInPart} of {stepsInPart}
                  </p>
                  <span style={{ fontSize: "0.8rem", fontWeight: 800, color: currentPart.color, background: `${currentPart.color}14`, padding: "0.3rem 0.75rem", borderRadius: "99px", border: `1px solid ${currentPart.color}30`, letterSpacing: "0.04em" }}>
                    {currentPart.badge}
                  </span>
                  <span style={{ fontSize: "0.74rem", fontWeight: 700, color: "#90a4ae", background: "rgba(180,215,235,0.16)", padding: "0.24rem 0.65rem", borderRadius: "99px", border: "1px solid rgba(180,215,235,0.26)" }}>
                    Part {currentPartIndex + 1} of {SURVEY_PARTS.length}
                  </span>
                </div>
              </div>
            </div>

            <div style={{ padding: "0.85rem 0.9rem", borderRadius: "18px", background: "linear-gradient(180deg, rgba(255,255,255,0.82) 0%, rgba(248,251,255,0.96) 100%)", border: "1px solid rgba(90,155,212,0.14)", boxShadow: "0 12px 28px rgba(90,155,212,0.06)" }}>
              <div style={{ display: "flex", gap: "0.45rem", marginBottom: "0.75rem", flexWrap: "wrap" }}>
                {SURVEY_PARTS.map((part, index) => {
                  const isActive = index === currentPartIndex;
                  const isDone = index < currentPartIndex;
                  return (
                    <div
                      key={part.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.38rem",
                        padding: "0.32rem 0.72rem",
                        borderRadius: "99px",
                        background: isActive ? `${part.color}18` : isDone ? "rgba(90,155,212,0.06)" : "rgba(180,215,235,0.1)",
                        border: `1px solid ${isActive ? part.color + "55" : isDone ? "rgba(90,155,212,0.2)" : "rgba(180,215,235,0.3)"}`,
                      }}
                    >
                      <span style={{ fontSize: "0.68rem", fontWeight: 700, color: isActive ? part.color : isDone ? "#78909c" : "#90a4ae", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                        {isDone ? "Done" : `Part ${index + 1}`}
                      </span>
                      <span style={{ fontSize: "0.72rem", fontWeight: isActive ? 700 : 500, color: isActive ? part.color : isDone ? "#607d8b" : "#90a4ae" }}>
                        {part.title}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div style={{ display: "flex", gap: "0.4rem", marginBottom: "0.8rem", flexWrap: "wrap" }}>
                {SECTIONS.map((s, i) => {
                  const isActive = i === sectionIndex;
                  const isDone = i < sectionIndex;
                  return (
                    <div
                      key={s.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.3rem",
                        padding: "0.24rem 0.58rem",
                        borderRadius: "99px",
                        background: isActive ? `${s.color}20` : isDone ? "rgba(90,155,212,0.06)" : "rgba(180,215,235,0.1)",
                        border: `1px solid ${isActive ? s.color + "66" : isDone ? "rgba(90,155,212,0.2)" : "rgba(180,215,235,0.3)"}`,
                        transition: "all 0.3s",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "0.66rem",
                          fontWeight: 700,
                          color: isDone ? "#78909c" : "inherit",
                          textTransform: isDone ? "uppercase" : "none",
                          letterSpacing: isDone ? "0.06em" : "normal",
                        }}
                      >
                        {isDone ? "Done" : s.emoji}
                      </span>
                      <span style={{
                        fontSize: "0.64rem",
                        fontWeight: isActive ? 700 : 500,
                        color: isActive ? s.color : isDone ? "#78909c" : "#b0bec5",
                        whiteSpace: "nowrap",
                      }}>
                        {s.label}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div style={{
                height: "4px",
                background: "rgba(90, 155, 212, 0.1)",
                borderRadius: "99px",
                marginBottom: currentPart.id === "preferences" ? "0.9rem" : "0",
                overflow: "hidden",
              }}>
                <div
                  style={{
                    height: "100%",
                    width: `${progress}%`,
                    background: `linear-gradient(90deg, #5a9bd4, ${currentSection.color})`,
                    borderRadius: "99px",
                    transition: "width 0.2s ease-out",
                  }}
                />
              </div>

              {currentPart.id === "preferences" && (
                <div
                  style={{
                    marginTop: "0.9rem",
                    padding: "0.95rem 1rem",
                    borderRadius: "18px",
                    background: "linear-gradient(135deg, rgba(118,199,183,0.16), rgba(90,155,212,0.08))",
                    border: "1px solid rgba(118,199,183,0.26)",
                    boxShadow: "0 10px 24px rgba(118,199,183,0.08)",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.8rem", flexWrap: "wrap" }}>
                    <div>
                      <p style={{ margin: "0 0 0.35rem", fontSize: "0.76rem", fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", color: "#4f9f95" }}>
                        Preference Section
                      </p>
                      <h3 style={{ margin: "0 0 0.25rem", fontSize: "1rem", lineHeight: 1.35, color: "#284b63", fontFamily: "var(--font-heading)" }}>
                        Your stress score is already set.
                      </h3>
                      <p style={{ margin: 0, fontSize: "0.88rem", lineHeight: 1.6, color: "#607d8b" }}>
                        These next questions do not change your score. They help describe how calm feels to you and what kind of support feels most useful.
                      </p>
                    </div>
                    <div
                      style={{
                        padding: "0.42rem 0.9rem",
                        borderRadius: "999px",
                        background: "rgba(255,255,255,0.82)",
                        border: "1px solid rgba(118,199,183,0.32)",
                        color: "#4f9f95",
                        fontSize: "0.82rem",
                        fontWeight: 800,
                        letterSpacing: "0.06em",
                        textTransform: "uppercase",
                      }}
                    >
                      Not scored
                    </div>
                  </div>
                  {isFirstQuestionInPart && (
                    <div
                      style={{
                        marginTop: "0.7rem",
                        paddingTop: "0.7rem",
                        borderTop: "1px solid rgba(118,199,183,0.2)",
                        fontSize: "0.84rem",
                        fontWeight: 700,
                        color: "#4f9f95",
                      }}
                    >
                      You are now in Part 2 of 2.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

        <div style={{ position: "relative", zIndex: 1, padding: isMobile ? "0.85rem 0.75rem 0.9rem 0.85rem" : "0.95rem 0.9rem 1rem 1rem", borderRadius: "20px", background: "linear-gradient(180deg, rgba(255,255,255,0.82) 0%, rgba(248,251,255,0.96) 100%)", border: "1px solid rgba(90,155,212,0.14)", boxShadow: "0 12px 28px rgba(90,155,212,0.06)", minHeight: 0, height: "100%", overflowY: "auto", overscrollBehavior: "contain", WebkitOverflowScrolling: "touch", boxSizing: "border-box" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "0.45rem", padding: "0.32rem 0.7rem", borderRadius: "999px", background: `${currentSection.color}14`, color: currentSection.color, fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "0.7rem" }}>
              <span>{currentSection.emoji}</span>
              <span>{question.category}</span>
            </div>
            {/* English question */}
            <h2 style={{
              color: "#2c3e50",
              fontSize: isMobile ? "1.02rem" : "1.18rem",
              fontWeight: 800,
              lineHeight: 1.35,
              marginBottom: "0.55rem",
              fontFamily: "var(--font-heading)",
              maxWidth: "34rem",
            }}>
              {question.en}
            </h2>
            {/* Bengali */}
            <p style={{ color: "#78909c", fontSize: isMobile ? "0.84rem" : "0.9rem", lineHeight: 1.6, marginBottom: "0.95rem", maxWidth: "34rem" }}>
              {question.bn}
            </p>

            {/* Options */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.55rem", paddingBottom: "0.35rem" }}>
              {question.options.map((opt, idx) => {
                const isActive = selectedIndex === idx;
                return (
                  <button
                    key={idx}
                    id={`survey-q${question.id}-opt${idx}`}
                    onClick={() => handleSelect(opt.score, idx)}
                    style={{
                      width: "100%",
                      textAlign: "left",
                      padding: isMobile ? "0.72rem 0.78rem" : "0.8rem 0.9rem",
                      borderRadius: "16px",
                      cursor: "pointer",
                      border: isActive
                        ? `1.5px solid ${currentSection.color}`
                        : "1.5px solid rgba(90,155,212,0.15)",
                      background: isActive
                        ? `linear-gradient(135deg, ${currentSection.color}14, rgba(255,255,255,0.96))`
                        : "rgba(255, 255, 255, 0.72)",
                      transition: "background 0.16s, border-color 0.16s, box-shadow 0.16s, transform 0.16s",
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "0.8rem",
                      boxShadow: isActive ? "0 8px 20px rgba(90,155,212,0.12)" : "0 4px 12px rgba(90,155,212,0.04)",
                      transform: isActive ? "translateY(-1px)" : "none",
                    }}
                  >
                    {/* Radio dot */}
                    <div style={{
                      width: "20px",
                      height: "20px",
                      borderRadius: "50%",
                      border: isActive ? `6px solid ${currentSection.color}` : "2px solid #b0bec5",
                      flexShrink: 0,
                      transition: "border 0.2s",
                      background: "white",
                      marginTop: "0.18rem",
                    }} />
                    <span style={{ flex: 1 }}>
                      <span style={{
                        color: isActive ? "#2c3e50" : "#37474f",
                        fontWeight: isActive ? 800 : 600,
                        fontSize: isMobile ? "0.86rem" : "0.92rem",
                        display: "block",
                        transition: "color 0.2s",
                        lineHeight: 1.35,
                      }}>
                        {opt.label}
                      </span>
                      <span style={{ color: "#90a4ae", fontSize: isMobile ? "0.75rem" : "0.8rem", lineHeight: 1.45, display: "block", marginTop: "0.1rem" }}>{opt.labelBn}</span>
                    </span>
                    <span style={{ color: isActive ? currentSection.color : "#b0bec5", fontWeight: 700, fontSize: isMobile ? "0.68rem" : "0.74rem", letterSpacing: "0.08em", paddingTop: "0.18rem", textTransform: "uppercase" }}>
                      {isActive ? "Selected" : "Choose"}
                    </span>
                  </button>
                );
              })}
            </div>
        </div>
        </div>
        </div>

        {/* Navigation */}
        <div style={{ display: isMobile ? "flex" : "grid", gridTemplateColumns: isMobile ? undefined : "minmax(0, 1fr) auto minmax(0, 1fr)", flexDirection: isMobile ? "column" : undefined, alignItems: "center", gap: "0.75rem", marginTop: "0.1rem", marginLeft: isMobile ? "-0.9rem" : "-1.15rem", marginRight: isMobile ? "-0.9rem" : "-1.15rem", marginBottom: isMobile ? "-0.85rem" : "-0.95rem", padding: isMobile ? "0.8rem 0.9rem 0.85rem" : "0.85rem 1.15rem 0.95rem", position: "relative", zIndex: 3, background: "#ffffff", borderTop: "1px solid rgba(90,155,212,0.12)", boxShadow: "0 -10px 24px rgba(90,155,212,0.08)" }}>
          <div style={{ fontSize: "0.82rem", color: "#78909c", fontWeight: 600, minWidth: 0, width: isMobile ? "100%" : undefined, textAlign: isMobile ? "center" : "left" }}>
            {selectedIndex !== null ? "Choice saved" : "Choose one answer to continue"}
          </div>
          <div style={{ display: "flex", justifyContent: isMobile ? "stretch" : "center", width: isMobile ? "100%" : undefined, gap: "0.75rem" }}>
            <button
              id="survey-prev-btn"
              onClick={handlePrev}
              disabled={currentIndex === 0}
              style={{
                background: "none",
                border: "1.5px solid rgba(90,155,212,0.25)",
                borderRadius: "99px",
                color: currentIndex === 0 ? "#b0bec5" : "#546e7a",
                padding: "0.65rem 1.1rem",
                cursor: currentIndex === 0 ? "not-allowed" : "pointer",
                fontSize: "0.9rem",
                fontWeight: 600,
                transition: "all 0.2s",
                fontFamily: "var(--font-heading)",
                flex: isMobile ? 1 : undefined,
              }}
            >
              Back
            </button>
            <button
              id="survey-next-btn"
              onClick={handleNext}
              disabled={selectedIndex === null}
              style={{
                background: selectedIndex !== null
                  ? "linear-gradient(135deg, #5a9bd4, #76c7b7)"
                  : "rgba(90,155,212,0.1)",
                border: "none",
                borderRadius: "99px",
                color: selectedIndex !== null ? "white" : "#b0bec5",
                padding: "0.74rem 1.55rem",
                cursor: selectedIndex !== null ? "pointer" : "not-allowed",
                fontSize: "0.95rem",
                fontWeight: 700,
                transition: "background 0.3s, color 0.3s",
                boxShadow: selectedIndex !== null ? "0 4px 14px rgba(90,155,212,0.3)" : "none",
                fontFamily: "var(--font-heading)",
                flex: isMobile ? 1 : undefined,
              }}
            >
              {isLast ? "See My Results" : isLastScoredQuestion ? "Continue to Preferences" : "Next"}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
