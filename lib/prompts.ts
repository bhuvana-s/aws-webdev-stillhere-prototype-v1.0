export interface Prompt {
  id: string;
  text: string;
  iconPath: string;
  durationMin: number;
}

export const PROMPTS: Prompt[] = [
  {
    id: "1",
    text: "Tell me about the day you were born.",
    iconPath: "/assets/icons/baby-shoes.png",
    durationMin: 3,
  },
  {
    id: "2",
    text: "What is your favorite family recipe and its story?",
    iconPath: "/assets/icons/cooking-utensils.png",
    durationMin: 3,
  },
  {
    id: "3",
    text: "Share a story from your greatest adventure.",
    iconPath: "/assets/icons/suitcase.png",
    durationMin: 5,
  },
  {
    id: "4",
    text: "What was your favorite wedding tradition?",
    iconPath: "/assets/icons/wedding-cake.png",
    durationMin: 3,
  },
  {
    id: "5",
    text: "What's a lesson you learned the hard way?",
    iconPath: "/assets/icons/graduation-cap.png",
    durationMin: 3,
  },
  {
    id: "6",
    text: "Send your warmest birthday wishes.",
    iconPath: "/assets/hero-gift-box.png",
    durationMin: 2,
  },
];

export const DEFAULT_PROMPT_ID = "1";

export function getPromptById(id: string): Prompt | undefined {
  return PROMPTS.find((p) => p.id === id);
}
