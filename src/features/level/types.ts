import type { PizzaOrder } from "../pizza/types";

//What happened on one order after the student solved it
export interface OrderRecord
{
  //The order that was solved (can be an addition or subtraction order)
  order: PizzaOrder;

  //True only if the first Check Order was correct
  firstTryCorrect: boolean;

  //Points the student got for this order
  pointsEarned: number;
}

//Everything the header needs to show
export interface LevelProgress
{
  levelNumber: number;

  //The order the student is on, starting at 1
  currentOrderNumber: number;

  totalOrders: number;

  //How many orders are finished, used to fill the progress bar
  completedOrders: number;

  score: number;

  isComplete: boolean;
}

//Everything the results screen needs to show
export interface LevelResult
{
  levelNumber: number;
  passed: boolean;
  firstTryCorrectCount: number;
  requiredToPass: number;
  totalOrders: number;
  score: number;
  records: OrderRecord[];
}
