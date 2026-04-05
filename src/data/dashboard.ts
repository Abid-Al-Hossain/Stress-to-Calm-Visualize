export interface DashboardQuestionOption {
  index: number;
  label: string;
}

export interface DashboardQuestionDefinition {
  id: number;
  label: string;
  options: DashboardQuestionOption[];
}

export const DASHBOARD_QUESTIONS: DashboardQuestionDefinition[] = [
  {
    id: 1,
    label: "When there is tension or conflict at home, what feeling do you notice most?",
    options: [
      { index: 0, label: "Fear" },
      { index: 1, label: "Anxiety / Nervousness" },
      { index: 2, label: "Sadness" },
      { index: 3, label: "Confusion" },
      { index: 4, label: "Anger" },
      { index: 5, label: "Feeling numb (no strong emotion)" },
    ],
  },
  {
    id: 2,
    label: "How does your body usually react during stressful situations?",
    options: [
      { index: 0, label: "Trouble breathing" },
      { index: 1, label: "Racing thoughts" },
      { index: 2, label: "Feeling frozen / unable to react" },
      { index: 3, label: "Difficulty focusing" },
      { index: 4, label: "No clear physical reaction" },
    ],
  },
  {
    id: 3,
    label: "After a stressful event ends, how long does the stress linger?",
    options: [
      { index: 0, label: "Yes, for a short time (minutes)" },
      { index: 1, label: "Yes, for a long time (hours or more)" },
      { index: 2, label: "No, it passes quickly" },
      { index: 3, label: "Not sure" },
    ],
  },
  {
    id: 4,
    label: "During stressful moments, how does the world around you feel?",
    options: [
      { index: 0, label: "Dark or dull (dim, lifeless)" },
      { index: 1, label: "Blurred or unclear" },
      { index: 2, label: "Too loud or overwhelming" },
      { index: 3, label: "Tight or closing in (space shrinking)" },
      { index: 4, label: "Normal, no change" },
    ],
  },
  {
    id: 5,
    label: "Which visual effect best matches how stress feels to you?",
    options: [
      { index: 0, label: "Darkening colors (everything seems dimmer)" },
      { index: 1, label: "Tunnel vision (seeing only straight ahead)" },
      { index: 2, label: "Shaking or distortion (things look warped)" },
      { index: 3, label: "Fast or chaotic movement (everything too fast)" },
      { index: 4, label: "Fading or emptiness (things disappearing)" },
    ],
  },
  {
    id: 6,
    label: "What helps you feel calmer after a stressful situation?",
    options: [
      { index: 0, label: "Deep breathing (slow, controlled breaths)" },
      { index: 1, label: "Being alone (quiet time to yourself)" },
      { index: 2, label: "Talking to someone (sharing feelings)" },
      { index: 3, label: "Music or silence" },
      { index: 4, label: "Sleep or rest" },
    ],
  },
  {
    id: 7,
    label: "How quickly do you usually feel calm again after stress?",
    options: [
      { index: 0, label: "Very slowly (takes hours or the rest of the day)" },
      { index: 1, label: "Gradually (step by step over time)" },
      { index: 2, label: "Quickly (within minutes)" },
      { index: 3, label: "It varies (sometimes fast, sometimes slow)" },
    ],
  },
  {
    id: 8,
    label: "Which visual change best represents the feeling of becoming calm?",
    options: [
      { index: 0, label: "Brighter colors (everything gets lighter and clearer)" },
      { index: 1, label: "Clear vision (sharp and focused)" },
      { index: 2, label: "Slower movement (things settle, feel steady)" },
      { index: 3, label: "Feeling safe (warmth, comfort, security)" },
    ],
  },
  {
    id: 9,
    label: "Would a visual animation help you express feelings that are difficult to put into words?",
    options: [
      { index: 0, label: "Yes, absolutely - visuals help more than words" },
      { index: 1, label: "Maybe, depending on the situation" },
      { index: 2, label: "No, I prefer words or talking" },
    ],
  },
  {
    id: 10,
    label: "Which best describes how stress recovery feels for you?",
    options: [
      { index: 0, label: "Smooth and gradual (like a tide slowly going out)" },
      { index: 1, label: "Sudden shift (like a switch flipping to calm)" },
      { index: 2, label: "A mix of both - unpredictable" },
    ],
  },
];

export const SOLUTION_METHODS = [
  {
    id: "breathing",
    label: "Breathing",
    short: "BR",
    desc: "Follow the guide-prescribed breathing rhythm for your tier.",
  },
  {
    id: "sound",
    label: "Sound",
    short: "SO",
    desc: "Play a matching calming sound pattern for this stress level.",
  },
  {
    id: "visual",
    label: "Visual",
    short: "VI",
    desc: "Use guided imagery or visualization matched to this stress level.",
  },
  {
    id: "advice",
    label: "Advice",
    short: "AD",
    desc: "Use the guide prompts together with a sensory grounding sequence.",
  },
] as const;

export type SolutionMethodId = (typeof SOLUTION_METHODS)[number]["id"];
