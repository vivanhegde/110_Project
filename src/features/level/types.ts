import type { PizzaOrder } from "../pizza/types";

//What happened on one order after the student solved it
export interface OrderRecord {
  order: PizzaOrder;
  //True only if the first Check Order was correct
  firstTryCorrect: boolean;
  pointsEarned: number;
}

//Everything the header needs: level number, "Order x of y", progress bar, and score
export interface LevelProgress {
  levelNumber: number;
  //Order the student is on, starting at 1
  currentOrderNumber: number;
  totalOrders: number;
  //Orders finished so far, used to fill the progress bar
  completedOrders: number;
  score: number;
  isComplete: boolean;
}

//Everything the results screen needs after the last order
export interface LevelResult {
  levelNumber: number;
  passed: boolean;
  firstTryCorrectCount: number;
  requiredToPass: number;
  totalOrders: number;
  score: number;
  records: OrderRecord[];
}
