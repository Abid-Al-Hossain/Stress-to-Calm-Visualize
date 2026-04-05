"use client";

import {
  DASHBOARD_QUESTIONS,
  SOLUTION_METHODS,
  type SolutionMethodId,
} from "@/data/dashboard";

const DASHBOARD_STORAGE_KEY = "stress_visualizer_dashboard_sessions";
const DASHBOARD_STORAGE_VERSION_KEY = "stress_visualizer_dashboard_sessions_version";
export const DASHBOARD_ANALYTICS_EVENT = "dashboard-analytics-change";
const DASHBOARD_STORAGE_VERSION = "3";
const DEFAULT_MOCK_PARTICIPANT_COUNT = 480;
let cachedSessionsRaw: string | null | undefined;
let cachedVersionRaw: string | null | undefined;
let cachedSessions: DashboardSession[] | null = null;
let cachedSnapshot: DashboardSnapshot | null = null;

export interface DashboardSession {
  id: string;
  answers: Record<number, number>;
  solutionSelections: SolutionMethodId[];
  createdAt: string;
  source: "mock" | "local";
}

export interface DashboardOptionStat {
  index: number;
  label: string;
  count: number;
  percentage: number;
}

export interface DashboardQuestionStat {
  id: number;
  label: string;
  totalResponses: number;
  options: DashboardOptionStat[];
}

export interface DashboardSolutionStat {
  id: SolutionMethodId;
  label: string;
  count: number;
  percentage: number;
}

export interface DashboardSnapshot {
  totalParticipants: number;
  totalSolutionSelections: number;
  participantsWithSolutionSelections: number;
  questionStats: DashboardQuestionStat[];
  solutionStats: DashboardSolutionStat[];
}

interface RecordSurveySessionInput {
  answers: Record<number, number>;
}

const QUESTION_WEIGHT_MAP: Record<number, number[]> = {
  1: [11, 24, 13, 8, 18, 10],
  2: [26, 22, 20, 18, 14],
  3: [15, 34, 31, 20],
  4: [14, 18, 23, 29, 16],
  5: [17, 28, 19, 16, 20],
  6: [26, 13, 24, 17, 20],
  7: [17, 29, 27, 27],
  8: [22, 24, 21, 33],
  9: [43, 34, 23],
  10: [38, 24, 38],
};

const SOLUTION_WEIGHTS: Array<{ id: SolutionMethodId; weight: number }> = [
  { id: "breathing", weight: 32 },
  { id: "sound", weight: 21 },
  { id: "visual", weight: 29 },
  { id: "advice", weight: 18 },
];

function isBrowser() {
  return typeof window !== "undefined";
}

function emitAnalyticsChange() {
  if (!isBrowser()) return;
  window.dispatchEvent(new Event(DASHBOARD_ANALYTICS_EVENT));
}

function pickWeightedIndex(weights: number[], seed: number) {
  const total = weights.reduce((sum, weight) => sum + weight, 0);
  const target = seed % total;
  let running = 0;

  for (let index = 0; index < weights.length; index += 1) {
    running += weights[index];
    if (target < running) return index;
  }

  return weights.length - 1;
}

function createMockSessions(count = DEFAULT_MOCK_PARTICIPANT_COUNT): DashboardSession[] {
  return Array.from({ length: count }, (_, index) => {
    const answers = DASHBOARD_QUESTIONS.reduce<Record<number, number>>((acc, question, questionIndex) => {
      const weights = QUESTION_WEIGHT_MAP[question.id];
      const seed = ((index + 17) * (question.id * 19 + 7) + questionIndex * 23) % 997;
      acc[question.id] = pickWeightedIndex(weights, seed);
      return acc;
    }, {});

    const solutionSeed = ((index + 11) * 37 + answers[6] * 17 + answers[9] * 29) % 1000;
    const solutionId = SOLUTION_WEIGHTS[pickWeightedIndex(
      SOLUTION_WEIGHTS.map((item) => item.weight),
      solutionSeed,
    )].id;

    return {
      id: `mock-session-${index + 1}`,
      answers,
      solutionSelections: [solutionId],
      createdAt: new Date(Date.UTC(2026, 0, 1 + (index % 90), 8 + (index % 9), index % 60, 0)).toISOString(),
      source: "mock",
    };
  });
}

const DEFAULT_MOCK_SESSIONS = createMockSessions();
const DEFAULT_SNAPSHOT = buildSnapshot(DEFAULT_MOCK_SESSIONS);

function getCurrentStorageState() {
  if (!isBrowser()) {
    return {
      sessionsRaw: null,
      versionRaw: DASHBOARD_STORAGE_VERSION,
    };
  }

  return {
    sessionsRaw: localStorage.getItem(DASHBOARD_STORAGE_KEY),
    versionRaw: localStorage.getItem(DASHBOARD_STORAGE_VERSION_KEY),
  };
}

function normalizeSession(session: unknown): DashboardSession | null {
  if (!session || typeof session !== "object") return null;
  const candidate = session as {
    id?: unknown;
    answers?: unknown;
    solutionId?: unknown;
    solutionSelections?: unknown;
    createdAt?: unknown;
    source?: unknown;
  };

  if (
    typeof candidate.id !== "string" ||
    !candidate.answers ||
    typeof candidate.answers !== "object" ||
    typeof candidate.createdAt !== "string" ||
    (candidate.source !== "mock" && candidate.source !== "local")
  ) {
    return null;
  }

  const solutionSelections = Array.isArray(candidate.solutionSelections)
    ? candidate.solutionSelections.filter((value): value is SolutionMethodId =>
        SOLUTION_METHODS.some((method) => method.id === value),
      )
    : typeof candidate.solutionId === "string" &&
        SOLUTION_METHODS.some((method) => method.id === candidate.solutionId)
      ? [candidate.solutionId as SolutionMethodId]
      : [];

  return {
    id: candidate.id,
    answers: candidate.answers as Record<number, number>,
    solutionSelections,
    createdAt: candidate.createdAt,
    source: candidate.source,
  };
}

function parseStoredSessions(raw: string | null): DashboardSession[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed)
      ? parsed
          .map((session) => normalizeSession(session))
          .filter((session): session is DashboardSession => session !== null)
      : [];
  } catch {
    return [];
  }
}

function writeSessions(sessions: DashboardSession[]) {
  if (!isBrowser()) return;
  localStorage.setItem(DASHBOARD_STORAGE_KEY, JSON.stringify(sessions));
  localStorage.setItem(DASHBOARD_STORAGE_VERSION_KEY, DASHBOARD_STORAGE_VERSION);
  cachedSessionsRaw = localStorage.getItem(DASHBOARD_STORAGE_KEY);
  cachedVersionRaw = DASHBOARD_STORAGE_VERSION;
  cachedSessions = sessions;
  cachedSnapshot = buildSnapshot(sessions);
}

function getEffectiveSessions(): DashboardSession[] {
  const { sessionsRaw, versionRaw } = getCurrentStorageState();
  if (sessionsRaw === cachedSessionsRaw && versionRaw === cachedVersionRaw && cachedSessions) {
    return cachedSessions;
  }

  const existing = parseStoredSessions(sessionsRaw);
  const nextSessions =
    existing.length > 0 && versionRaw === DASHBOARD_STORAGE_VERSION
      ? existing
      : [...DEFAULT_MOCK_SESSIONS, ...existing.filter((session) => session.source === "local")];

  cachedSessionsRaw = sessionsRaw;
  cachedVersionRaw = versionRaw;
  cachedSessions = nextSessions;
  cachedSnapshot = buildSnapshot(nextSessions);
  return nextSessions;
}

function countPercentage(count: number, total: number) {
  if (total === 0) return 0;
  return Math.round((count / total) * 100);
}

function buildSnapshot(sessions: DashboardSession[]): DashboardSnapshot {
  const questionStats = DASHBOARD_QUESTIONS.map((question) => {
    const totalResponses = sessions.filter((session) => typeof session.answers[question.id] === "number").length;
    const options = question.options.map((option) => {
      const count = sessions.filter((session) => session.answers[question.id] === option.index).length;
      return {
        index: option.index,
        label: option.label,
        count,
        percentage: countPercentage(count, totalResponses),
      };
    });

    return {
      id: question.id,
      label: question.label,
      totalResponses,
      options,
    };
  });

  const totalParticipants = sessions.length;
  const participantsWithSolutionSelections = sessions.filter((session) => session.solutionSelections.length > 0).length;
  const totalSolutionSelections = sessions.reduce((sum, session) => sum + session.solutionSelections.length, 0);
  const solutionStats = SOLUTION_METHODS.map((solution) => {
    const count = sessions.reduce(
      (sum, session) =>
        sum + session.solutionSelections.filter((selection) => selection === solution.id).length,
      0,
    );
    return {
      id: solution.id,
      label: solution.label,
      count,
      percentage: countPercentage(count, totalSolutionSelections),
    };
  });

  return {
    totalParticipants,
    totalSolutionSelections,
    participantsWithSolutionSelections,
    questionStats,
    solutionStats,
  };
}

export const DashboardAnalyticsService = {
  getSnapshot(): DashboardSnapshot {
    getEffectiveSessions();
    return cachedSnapshot ?? DEFAULT_SNAPSHOT;
  },

  getServerSnapshot(): DashboardSnapshot {
    return DEFAULT_SNAPSHOT;
  },

  subscribe(callback: () => void) {
    if (!isBrowser()) return () => {};
    const handleChange = () => callback();
    window.addEventListener(DASHBOARD_ANALYTICS_EVENT, handleChange);
    window.addEventListener("storage", handleChange);
    return () => {
      window.removeEventListener(DASHBOARD_ANALYTICS_EVENT, handleChange);
      window.removeEventListener("storage", handleChange);
    };
  },

  recordSurveySession({ answers }: RecordSurveySessionInput) {
    const sessions = getEffectiveSessions();
    const session: DashboardSession = {
      id: crypto.randomUUID(),
      answers,
      solutionSelections: [],
      createdAt: new Date().toISOString(),
      source: "local",
    };

    const nextSessions = [...sessions, session];
    writeSessions(nextSessions);
    emitAnalyticsChange();
    return session.id;
  },

  recordSolutionSelection(sessionId: string | null, solutionId: SolutionMethodId) {
    if (!sessionId) return;
    const sessions = getEffectiveSessions();
    const nextSessions = sessions.map((session) =>
      session.id === sessionId
        ? { ...session, solutionSelections: [...session.solutionSelections, solutionId] }
        : session,
    );
    writeSessions(nextSessions);
    emitAnalyticsChange();
  },
};
