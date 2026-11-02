import type { PizzaOrder } from "../pizza/types";
import type { LevelProgress, LevelResult, OrderRecord } from "./types";

/*
  LevelModel
  This class holds everything about one level and the rules for it:
  which orders are in the level, which order the student is on,
  the score so far, and whether each order was solved on the first try.

  It does NOT draw anything on the screen and it does NOT listen for clicks.
  Drawing is LevelView's job, and connecting things together is
  LevelController's job.

  How a level plays out:
    1. The game creates a LevelModel with a list of orders.
    2. getCurrentOrder() tells the pizza feature which order to show.
    3. When the student gets it right, recordCorrectOrder() saves the result
       and moves on to the next order.
    4. After the last order, getResult() says if the student passed.
    5. restart() puts everything back to Order 1 for Play Again / Retry Level.
*/
export class LevelModel
{
  // These three are set once when the level is created and never change
  private levelNumber: number;
  private orders: PizzaOrder[];
  private requiredToPass: number;

  // These change while the student plays
  private currentIndex = 0;            // position in the orders list (0 = first order)
  private score = 0;                   // total points so far
  private records: OrderRecord[] = []; // one record per solved order

  // requiredToPass is optional.
  // If nobody passes it in, we use the user story's rule: total orders - 1.
  public constructor(levelNumber: number, orders: PizzaOrder[], requiredToPass?: number)
  {
    if (!Number.isInteger(levelNumber) || levelNumber < 1)
    {
      throw new Error("Invalid level number");
    }

    // With only 1 order, "all but one" would mean 0 correct to pass,
    // so the smallest level we allow is 2 orders
    if (orders.length < 2)
    {
      throw new Error("A level needs at least two orders");
    }

    // Start with the default rule: the student can miss one order.
    // 5 orders -> need 4, 2 orders -> need 1
    let required = orders.length - 1;

    // If a pass requirement was passed in, use that instead of the default.
    if (requiredToPass !== undefined)
    {
      required = requiredToPass;
    }

    // No half orders, 0 orders, or more orders than the level has
    if (!Number.isInteger(required) || required < 1 || required > orders.length)
    {
      throw new Error("Invalid pass requirement");
    }

    this.levelNumber = levelNumber;
    this.requiredToPass = required;

    // Make our own copy of the list. If we just kept the original,
    // someone could remove an order from it later and break the level mid-game.
    this.orders = [];
    for (let i = 0; i < orders.length; i++)
    {
      this.orders.push(orders[i]);
    }
  }

  // Gives back the order the student should be working on right now
  public getCurrentOrder(): PizzaOrder
  {
    if (this.isComplete())
    {
      throw new Error("Level is already complete");
    }

    return this.orders[this.currentIndex];
  }

  // Called when the student gets the current order right.
  // incorrectAttempts: how many wrong tries they had on this order (from the feedback feature)
  // pointsEarned: points from the correct answer (also from the feedback feature)
  public recordCorrectOrder(incorrectAttempts: number, pointsEarned: number): void
  {
    if (this.isComplete())
    {
      throw new Error("Level is already complete");
    }

    // Attempts and points should always be whole numbers that aren't negative
    if (!Number.isInteger(incorrectAttempts) || incorrectAttempts < 0)
    {
      throw new Error("Invalid incorrect attempts");
    }

    if (!Number.isInteger(pointsEarned) || pointsEarned < 0)
    {
      throw new Error("Invalid points earned");
    }

    // No wrong tries = correct first Check Order
    let firstTryCorrect = false;
    if (incorrectAttempts === 0)
    {
      firstTryCorrect = true;
    }

    // Save what happened so the results screen can list it later
    const record: OrderRecord = {
      order: this.orders[this.currentIndex],
      firstTryCorrect: firstTryCorrect,
      pointsEarned: pointsEarned,
    };
    this.records.push(record);

    // Points still count even if it took a retry (Story 2 gives +100 for any correct answer).
    // A retry only matters for passing, not for the score.
    this.score = this.score + pointsEarned;

    // Move on to the next order
    this.currentIndex = this.currentIndex + 1;
  }

  // The level is done when we've moved past the last order
  public isComplete(): boolean
  {
    if (this.currentIndex >= this.orders.length)
    {
      return true;
    }

    return false;
  }

  // Gets level number, "Order x of y", how full the progress bar should be, and the score
  public getProgress(): LevelProgress
  {
    let currentOrderNumber = this.currentIndex + 1;

    // After the last order, currentIndex goes one past the end or the header would say "Order 6 of 5".
    if (currentOrderNumber > this.orders.length)
    {
      currentOrderNumber = this.orders.length;
    }

    const progress: LevelProgress = {
      levelNumber: this.levelNumber,
      currentOrderNumber: currentOrderNumber,
      totalOrders: this.orders.length,
      completedOrders: this.currentIndex,
      score: this.score,
      isComplete: this.isComplete(),
    };

    return progress;
  }

  // for result screen
  // Only shows after the last order, because before that there's no final result.
  public getResult(): LevelResult
  {
    if (!this.isComplete())
    {
      throw new Error("Level is not complete yet");
    }

    // Go through the saved records and count the first-try ones
    let firstTryCorrectCount = 0;
    for (let i = 0; i < this.records.length; i++)
    {
      if (this.records[i].firstTryCorrect)
      {
        firstTryCorrectCount = firstTryCorrectCount + 1;
      }
    }

    // Passing is based on first-try orders, not on the score
    let passed = false;
    if (firstTryCorrectCount >= this.requiredToPass)
    {
      passed = true;
    }

    // returns a copy so the results screen can't accidentally change our saved data
    const recordsCopy: OrderRecord[] = [];
    for (let i = 0; i < this.records.length; i++)
    {
      recordsCopy.push(this.records[i]);
    }

    const result: LevelResult = {
      levelNumber: this.levelNumber,
      passed: passed,
      firstTryCorrectCount: firstTryCorrectCount,
      requiredToPass: this.requiredToPass,
      totalOrders: this.orders.length,
      score: this.score,
      records: recordsCopy,
    };

    return result;
  }

  // Used by both Play Again and Retry Level.
  // The orders and the pass rule stay the same; only the player's progress is cleared.
  public restart(): void
  {
    this.currentIndex = 0;
    this.score = 0;
    this.records = [];
  }
}
