import type { PizzaOrder } from "../pizza/types";
import type { Explanation } from "./Explanation";

export type FeedbackType = "correct" | "tooFew" | "tooMany";

export interface Feedback {
  type: FeedbackType;
  title: string;
  message: string;
  pointsEarned: number;
  actionLabel: string;
  explanation?: Explanation;
}

export interface FeedbackDisplay {
  show(feedback: Feedback, order: PizzaOrder): void;
  clear(): void;
}
