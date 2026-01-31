// Tarot Spread Definitions
// Each spread defines positions with specific meanings

export interface SpreadPosition {
  id: number;
  name: string;
  description: string;
  x: number; // Position for layout (0-1 normalized)
  y: number;
}

export interface Spread {
  id: string;
  name: string;
  description: string;
  cardCount: number;
  positions: SpreadPosition[];
  icon: string; // Feather icon name
}

export const spreads: Spread[] = [
  {
    id: "single",
    name: "Single Card",
    description: "A focused answer to a direct question. Perfect for daily guidance or quick insights.",
    cardCount: 1,
    icon: "circle",
    positions: [
      {
        id: 1,
        name: "The Message",
        description: "The core insight or guidance for your question",
        x: 0.5,
        y: 0.5,
      },
    ],
  },
  {
    id: "three-card",
    name: "Past, Present, Future",
    description: "A classic three-card spread showing the timeline of your situation.",
    cardCount: 3,
    icon: "minus",
    positions: [
      {
        id: 1,
        name: "Past",
        description: "Influences and events that have shaped the current situation",
        x: 0.2,
        y: 0.5,
      },
      {
        id: 2,
        name: "Present",
        description: "The current state of affairs and immediate circumstances",
        x: 0.5,
        y: 0.5,
      },
      {
        id: 3,
        name: "Future",
        description: "The likely outcome if the current path continues",
        x: 0.8,
        y: 0.5,
      },
    ],
  },
  {
    id: "five-card",
    name: "Five Card Cross",
    description: "A balanced spread exploring the heart of a matter from multiple angles.",
    cardCount: 5,
    icon: "plus",
    positions: [
      {
        id: 1,
        name: "Present",
        description: "The heart of the matter—your current situation",
        x: 0.5,
        y: 0.5,
      },
      {
        id: 2,
        name: "Past",
        description: "What led to this moment",
        x: 0.2,
        y: 0.5,
      },
      {
        id: 3,
        name: "Future",
        description: "Where things are heading",
        x: 0.8,
        y: 0.5,
      },
      {
        id: 4,
        name: "Above",
        description: "Your conscious desires and goals",
        x: 0.5,
        y: 0.2,
      },
      {
        id: 5,
        name: "Below",
        description: "Subconscious influences and hidden factors",
        x: 0.5,
        y: 0.8,
      },
    ],
  },
  {
    id: "celtic-cross",
    name: "Celtic Cross",
    description: "The most comprehensive spread, revealing all aspects of a complex situation.",
    cardCount: 10,
    icon: "target",
    positions: [
      {
        id: 1,
        name: "Present",
        description: "The current situation and atmosphere",
        x: 0.3,
        y: 0.45,
      },
      {
        id: 2,
        name: "Challenge",
        description: "The immediate obstacle or crossing force",
        x: 0.3,
        y: 0.55,
      },
      {
        id: 3,
        name: "Past",
        description: "Recent events that have influenced the situation",
        x: 0.15,
        y: 0.5,
      },
      {
        id: 4,
        name: "Future",
        description: "Events coming in the near future",
        x: 0.45,
        y: 0.5,
      },
      {
        id: 5,
        name: "Above",
        description: "Your conscious goals and aspirations",
        x: 0.3,
        y: 0.2,
      },
      {
        id: 6,
        name: "Below",
        description: "Subconscious influences and hidden foundations",
        x: 0.3,
        y: 0.8,
      },
      {
        id: 7,
        name: "Advice",
        description: "Guidance on how to approach the situation",
        x: 0.7,
        y: 0.85,
      },
      {
        id: 8,
        name: "External",
        description: "Outside influences and how others see you",
        x: 0.7,
        y: 0.6,
      },
      {
        id: 9,
        name: "Hopes & Fears",
        description: "Your deepest hopes and fears about the outcome",
        x: 0.7,
        y: 0.35,
      },
      {
        id: 10,
        name: "Outcome",
        description: "The likely outcome on the current path",
        x: 0.7,
        y: 0.1,
      },
    ],
  },
  {
    id: "relationship",
    name: "Relationship",
    description: "Explore the dynamics between you and another person.",
    cardCount: 6,
    icon: "heart",
    positions: [
      {
        id: 1,
        name: "You",
        description: "Your current feelings and position",
        x: 0.25,
        y: 0.3,
      },
      {
        id: 2,
        name: "Them",
        description: "Their feelings and perspective",
        x: 0.75,
        y: 0.3,
      },
      {
        id: 3,
        name: "Connection",
        description: "What brings you together",
        x: 0.5,
        y: 0.4,
      },
      {
        id: 4,
        name: "Challenges",
        description: "Obstacles in the relationship",
        x: 0.5,
        y: 0.6,
      },
      {
        id: 5,
        name: "Advice",
        description: "Guidance for the relationship",
        x: 0.35,
        y: 0.8,
      },
      {
        id: 6,
        name: "Potential",
        description: "The relationship's potential outcome",
        x: 0.65,
        y: 0.8,
      },
    ],
  },
  {
    id: "decision",
    name: "Decision",
    description: "Compare two paths when facing a major choice.",
    cardCount: 5,
    icon: "git-branch",
    positions: [
      {
        id: 1,
        name: "The Choice",
        description: "The core of your decision",
        x: 0.5,
        y: 0.2,
      },
      {
        id: 2,
        name: "Path A",
        description: "The first option and its energy",
        x: 0.25,
        y: 0.45,
      },
      {
        id: 3,
        name: "Path B",
        description: "The second option and its energy",
        x: 0.75,
        y: 0.45,
      },
      {
        id: 4,
        name: "Outcome A",
        description: "Where Path A leads",
        x: 0.25,
        y: 0.75,
      },
      {
        id: 5,
        name: "Outcome B",
        description: "Where Path B leads",
        x: 0.75,
        y: 0.75,
      },
    ],
  },
];

export const getSpreadById = (id: string): Spread | undefined =>
  spreads.find((s) => s.id === id);

export const getDefaultSpread = (): Spread => spreads[0];
