"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

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

const QUESTIONS: Question[] = [
  {
    id: 1,
    en: "When there is tension or conflict at home, what feeling do you notice the most?",
    bn: "বাড়িতে ঝগড়া বা উত্তেজনাপূর্ণ পরিস্থিতি হলে, আপনি কোন অনুভূতিটি সবচেয়ে বেশি অনুভব করেন?",
    category: "Emotion",
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
    en: "How does your body usually react during stressful situations at home?",
    bn: "বাড়িতে চাপপূর্ণ পরিস্থিতির সময় আপনার শরীর সাধারণত কীভাবে প্রতিক্রিয়া করে?",
    category: "Body Response",
    scored: true,
    options: [
      { label: "Trouble breathing", labelBn: "শ্বাস নিতে কষ্ট হওয়া", score: 25 },
      { label: "Racing thoughts", labelBn: "মাথায় অনেক চিন্তা একসাথে ঘোরা", score: 20 },
      { label: "Feeling frozen", labelBn: "স্থির হয়ে যাওয়া", score: 23 },
      { label: "Difficulty focusing", labelBn: "মনোযোগ ধরে রাখতে কষ্ট হওয়া", score: 15 },
      { label: "No clear physical reaction", labelBn: "কোনো স্পষ্ট শারীরিক প্রতিক্রিয়া নেই", score: 2 },
    ],
  },
  {
    id: 3,
    en: "After the conflict ends, does the stress stay with you?",
    bn: "ঝগড়া বা সমস্যার পরেও কি আপনার মনে চাপ বা স্ট্রেস থেকে যায়?",
    category: "Stress Persistence",
    scored: true,
    options: [
      { label: "Yes, for a short time", labelBn: "হ্যাঁ, কিন্তু অল্প সময়ের জন্য থাকে", score: 18 },
      { label: "Yes, for a long time", labelBn: "হ্যাঁ, অনেকক্ষণ বা দীর্ঘ সময় থাকে", score: 30 },
      { label: "No", labelBn: "না", score: 0 },
      { label: "Maybe / Not sure", labelBn: "হতে পারে / নিশ্চিত না", score: 10 },
    ],
  },
  {
    id: 4,
    en: "During stressful moments, how does the world around you feel?",
    bn: "চাপের মুহূর্তে আপনার চারপাশের পৃথিবী কেমন মনে হয়?",
    category: "World Perception",
    scored: true,
    options: [
      { label: "Dark or dull", labelBn: "অন্ধকার বা নিস্তেজ লাগে", score: 8 },
      { label: "Blurred or unclear", labelBn: "ঝাপসা বা অস্পষ্ট লাগে", score: 10 },
      { label: "Too loud or overwhelming", labelBn: "খুব জোরে বা সহ্য করা কঠিন মনে হয়", score: 13 },
      { label: "Tight or closing in", labelBn: "চারপাশ সংকুচিত বা চাপা মনে হয়", score: 15 },
      { label: "Normal", labelBn: "স্বাভাবিক লাগে", score: 0 },
    ],
  },
  {
    id: 5,
    en: "Which visual effect best matches how stress feels to you?",
    bn: "চাপের সময় আপনার অনুভূতির সাথে কোন দৃশ্যগত পরিবর্তনটি সবচেয়ে বেশি মিলে যায়?",
    category: "Visual Effects",
    scored: true,
    options: [
      { label: "Darkening colors", labelBn: "রং গাঢ় বা অন্ধকার হয়ে যাওয়া", score: 4 },
      { label: "Tunnel vision", labelBn: "চারপাশ কম দেখা, শুধু সামনে দেখা", score: 8 },
      { label: "Shaking or distortion", labelBn: "কাঁপা বা বিকৃত দেখা", score: 9 },
      { label: "Fast or chaotic movement", labelBn: "দ্রুত বা বিশৃঙ্খল মনে হওয়া", score: 7 },
      { label: "Fading or emptiness", labelBn: "ধীরে ধীরে মিলিয়ে যাওয়া বা শূন্য লাগা", score: 10 },
    ],
  },
  {
    id: 6,
    en: "What helps you feel calmer after a stressful situation?",
    bn: "চাপপূর্ণ পরিস্থিতির পর আপনাকে শান্ত হতে সবচেয়ে বেশি কী সাহায্য করে?",
    category: "Coping Strategy",
    scored: false,
    options: [
      { label: "Deep breathing", labelBn: "গভীর শ্বাস নেওয়া", score: 0 },
      { label: "Being alone", labelBn: "একাই থাকা", score: 0 },
      { label: "Talking to someone", labelBn: "কারও সাথে কথা বলা", score: 0 },
      { label: "Music or silence", labelBn: "সঙ্গীত শোনা বা নীরবতা", score: 0 },
      { label: "Sleep", labelBn: "ঘুম", score: 0 },
    ],
  },
  {
    id: 7,
    en: "How quickly do you usually feel calm again?",
    bn: "আপনি সাধারণত কত দ্রুত আবার শান্ত অনুভব করেন?",
    category: "Recovery Speed",
    scored: false,
    options: [
      { label: "Very slowly (takes a lot of time)", labelBn: "খুব ধীরে", score: 0 },
      { label: "Gradually (step by step)", labelBn: "ধীরে ধীরে", score: 0 },
      { label: "Quickly (in a short time)", labelBn: "দ্রুত", score: 0 },
      { label: "It takes a long time (calm comes much later)", labelBn: "অনেক সময় লাগে", score: 0 },
    ],
  },
  {
    id: 8,
    en: "What change best represents feeling calm again?",
    bn: "আবার শান্ত হওয়ার অনুভূতিকে কোন পরিবর্তনটি সবচেয়ে ভালোভাবে প্রকাশ করে?",
    category: "Calm Representation",
    scored: false,
    options: [
      { label: "Brighter colors", labelBn: "উজ্জ্বল রং", score: 0 },
      { label: "Clear vision", labelBn: "স্পষ্ট দেখা", score: 0 },
      { label: "Slower movement", labelBn: "ধীরে চলা", score: 0 },
      { label: "Feeling safe", labelBn: "নিরাপদ অনুভব করা", score: 0 },
    ],
  },
  {
    id: 9,
    en: "Would a visual animation help express feelings that are hard to explain in words?",
    bn: "যে অনুভূতিগুলো কথায় বোঝানো কঠিন, সেগুলো কি ভিজ্যুয়াল অ্যানিমেশনের মাধ্যমে বোঝানো সহজ হবে?",
    category: "Visual Communication",
    scored: false,
    options: [
      { label: "Yes", labelBn: "হ্যাঁ", score: 0 },
      { label: "Maybe", labelBn: "হতে পারে", score: 0 },
      { label: "No", labelBn: "না", score: 0 },
    ],
  },
  {
    id: 10,
    en: "Which is more accurate for showing stress recovery?",
    bn: "স্ট্রেস থেকে সুস্থ হয়ে ওঠার প্রক্রিয়াকে কোনটি বেশি সঠিকভাবে দেখায়?",
    category: "Recovery Representation",
    scored: false,
    options: [
      { label: "Smooth, gradual transition", labelBn: "মসৃণ, ধীরে ধীরে পরিবর্তন", score: 0 },
      { label: "Sudden change", labelBn: "হঠাৎ পরিবর্তন", score: 0 },
      { label: "Combination (mix of both)", labelBn: "দুটোর সমন্বয়", score: 0 },
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
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [selected, setSelected] = useState<number | null>(null);
  const [direction, setDirection] = useState(1);

  const question = QUESTIONS[currentIndex];
  const total = QUESTIONS.length;
  const progress = (currentIndex / total) * 100;
  const isLast = currentIndex === total - 1;

  const handleSelect = (score: number, optIdx: number) => {
    setSelected(optIdx);
    setAnswers((prev) => ({ ...prev, [question.id]: score }));
  };

  const handleNext = () => {
    if (selected === null) return;
    if (isLast) {
      const totalScore = QUESTIONS.filter((q) => q.scored).reduce(
        (acc, q) => acc + (answers[q.id] ?? 0),
        0
      );
      onComplete(Math.min(totalScore, 100));
    } else {
      setDirection(1);
      setCurrentIndex((i) => i + 1);
      setSelected(null);
    }
  };

  const handlePrev = () => {
    if (currentIndex === 0) return;
    setDirection(-1);
    setCurrentIndex((i) => i - 1);
    const prevQuestion = QUESTIONS[currentIndex - 1];
    const prevScore = answers[prevQuestion.id];
    if (prevScore !== undefined) {
      const idx = prevQuestion.options.findIndex((o) => o.score === prevScore);
      setSelected(idx >= 0 ? idx : null);
    } else {
      setSelected(null);
    }
  };

  const slideVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? 50 : -50, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -50 : 50, opacity: 0 }),
  };

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
        padding: "1rem",
        background: "rgba(180, 215, 235, 0.55)",
        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",
      }}
    >
      <motion.div
        initial={{ scale: 0.94, opacity: 0, y: 18 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.94, opacity: 0, y: 18 }}
        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
        style={{
          width: "100%",
          maxWidth: "620px",
          // Glass card — same as .card / .auth-card on the site
          background: "rgba(255, 255, 255, 0.78)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          border: "1px solid rgba(255, 255, 255, 0.55)",
          borderRadius: "24px",
          padding: "2.5rem",
          boxShadow: "0 20px 60px rgba(90, 155, 212, 0.18), 0 4px 16px rgba(30, 41, 59, 0.06)",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.25rem" }}>
          <div>
            <p style={{
              fontSize: "0.7rem",
              fontWeight: 700,
              color: question.scored ? "#5a9bd4" : "#76c7b7",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              marginBottom: "0.2rem",
            }}>
              {question.scored ? `Scored · ${question.category}` : `Informational · ${question.category}`}
            </p>
            <p style={{ fontSize: "0.85rem", color: "#78909c" }}>
              Question {currentIndex + 1} of {total}
            </p>
          </div>
          <button
            id="survey-close-btn"
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#90a4ae",
              fontSize: "1.3rem",
              lineHeight: 1,
              padding: "0.25rem",
              borderRadius: "50%",
              transition: "color 0.2s",
            }}
          >
            ✕
          </button>
        </div>

        {/* Progress Bar */}
        <div style={{
          height: "4px",
          background: "rgba(90, 155, 212, 0.1)",
          borderRadius: "99px",
          marginBottom: "2rem",
          overflow: "hidden",
        }}>
          <motion.div
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.45 }}
            style={{
              height: "100%",
              background: "linear-gradient(90deg, #5a9bd4, #76c7b7)",
              borderRadius: "99px",
            }}
          />
        </div>

        {/* Slide */}
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.28, ease: "easeInOut" }}
          >
            {/* English question */}
            <h2 style={{
              color: "#2c3e50",
              fontSize: "1.15rem",
              fontWeight: 700,
              lineHeight: 1.55,
              marginBottom: "0.6rem",
              fontFamily: "var(--font-heading)",
            }}>
              {question.en}
            </h2>
            {/* Bengali */}
            <p style={{ color: "#78909c", fontSize: "0.9rem", lineHeight: 1.7, marginBottom: "1.6rem" }}>
              {question.bn}
            </p>

            {/* Options */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem" }}>
              {question.options.map((opt, idx) => {
                const isActive = selected === idx;
                return (
                  <motion.button
                    key={idx}
                    id={`survey-q${question.id}-opt${idx}`}
                    onClick={() => handleSelect(opt.score, idx)}
                    whileHover={{ x: 3, boxShadow: "0 4px 16px rgba(90,155,212,0.12)" }}
                    whileTap={{ scale: 0.98 }}
                    style={{
                      width: "100%",
                      textAlign: "left",
                      padding: "0.9rem 1.15rem",
                      borderRadius: "14px",
                      cursor: "pointer",
                      border: isActive
                        ? "1.5px solid #5a9bd4"
                        : "1.5px solid rgba(90,155,212,0.15)",
                      background: isActive
                        ? "rgba(90, 155, 212, 0.1)"
                        : "rgba(255, 255, 255, 0.55)",
                      transition: "background 0.2s, border-color 0.2s",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.85rem",
                      backdropFilter: "blur(4px)",
                    }}
                  >
                    {/* Radio dot */}
                    <div style={{
                      width: "18px",
                      height: "18px",
                      borderRadius: "50%",
                      border: isActive ? "5px solid #5a9bd4" : "2px solid #b0bec5",
                      flexShrink: 0,
                      transition: "border 0.2s",
                      background: "white",
                    }} />
                    <span>
                      <span style={{
                        color: isActive ? "#2c3e50" : "#37474f",
                        fontWeight: isActive ? 700 : 500,
                        fontSize: "0.95rem",
                        display: "block",
                        transition: "color 0.2s",
                      }}>
                        {opt.label}
                      </span>
                      <span style={{ color: "#90a4ae", fontSize: "0.8rem" }}>{opt.labelBn}</span>
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "2rem" }}>
          <button
            id="survey-prev-btn"
            onClick={handlePrev}
            disabled={currentIndex === 0}
            style={{
              background: "none",
              border: "1.5px solid rgba(90,155,212,0.25)",
              borderRadius: "99px",
              color: currentIndex === 0 ? "#b0bec5" : "#546e7a",
              padding: "0.65rem 1.5rem",
              cursor: currentIndex === 0 ? "not-allowed" : "pointer",
              fontSize: "0.9rem",
              fontWeight: 600,
              transition: "all 0.2s",
              fontFamily: "var(--font-heading)",
            }}
          >
            ← Back
          </button>

          <motion.button
            id="survey-next-btn"
            onClick={handleNext}
            disabled={selected === null}
            whileHover={selected !== null ? { scale: 1.04, y: -1 } : {}}
            whileTap={selected !== null ? { scale: 0.97 } : {}}
            style={{
              background: selected !== null
                ? "linear-gradient(135deg, #5a9bd4, #76c7b7)"
                : "rgba(90,155,212,0.1)",
              border: "none",
              borderRadius: "99px",
              color: selected !== null ? "white" : "#b0bec5",
              padding: "0.75rem 2rem",
              cursor: selected !== null ? "pointer" : "not-allowed",
              fontSize: "0.95rem",
              fontWeight: 700,
              transition: "background 0.3s, color 0.3s",
              boxShadow: selected !== null ? "0 4px 14px rgba(90,155,212,0.3)" : "none",
              fontFamily: "var(--font-heading)",
            }}
          >
            {isLast ? "See My Results →" : "Next →"}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}
