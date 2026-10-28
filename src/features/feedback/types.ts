export type FeedbackType = "correct" | "tooFew" | "tooMany";

export interface Feedback {
  type: FeedbackType;
  title: string;
  message: string;
  pointsEarned: number;
  actionLabel: string;
}