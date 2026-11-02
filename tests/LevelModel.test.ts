import { describe, it, expect } from "vitest";
import { LevelModel } from "../src/features/level/LevelModel";
import type { PizzaOrder } from "../src/features/pizza/types";

/*
  Unit tests for LevelModel.

  These only test the model by itself: no pizza, no feedback, no screen.
  Instead of actually playing orders, we call recordCorrectOrder() directly
  and pretend the student had 0 wrong tries (first try) or 1 wrong try (a retry).

  Every test follows the same pattern:
    1. Set up a level
    2. Do something to it
    3. Use expect() to check the result is what the user story says it should be
*/

// Five sample orders shared by most tests.
// the model only cares how many orders there are and which one we're on so fractions don't matter here
const fiveOrders: PizzaOrder[] = [
  { numerator: 5, denominator: 8 },
  { numerator: 3, denominator: 8 },
  { numerator: 4, denominator: 8 },
  { numerator: 6, denominator: 8 },
  { numerator: 2, denominator: 8 },
];

// Helper to write 5 recordCorrectOrder() calls in every test.
// The first "retryCount" orders took one wrong try, the rest were right on the first try.
// Example: finishFiveOrders(level, 1) means 1 retry and 4 first-try orders.
function finishFiveOrders(level: LevelModel, retryCount: number): void
{
  for (let i = 0; i < 5; i++)
  {
    if (i < retryCount)
    {
      level.recordCorrectOrder(1, 100);
    }
    else
    {
      level.recordCorrectOrder(0, 100);
    }
  }
}

describe("LevelModel", () => {
  // new level should be at the beginning
  it("should start on order 1 with a score of 0", () => {
    const level = new LevelModel(1, fiveOrders);
    const progress = level.getProgress();

    expect(progress.levelNumber).toBe(1);
    expect(progress.currentOrderNumber).toBe(1);
    expect(progress.totalOrders).toBe(5);
    expect(progress.completedOrders).toBe(0);
    expect(progress.score).toBe(0);
    expect(progress.isComplete).toBe(false);
    expect(level.getCurrentOrder()).toEqual({ numerator: 5, denominator: 8 });
  });

  // Solving one order should move us to order 2 and give us the points
  it("should move to the next order and add points after a correct order", () => {
    const level = new LevelModel(1, fiveOrders);
    level.recordCorrectOrder(0, 100);
    const progress = level.getProgress();

    expect(progress.currentOrderNumber).toBe(2);
    expect(progress.completedOrders).toBe(1);
    expect(progress.score).toBe(100);
    expect(level.getCurrentOrder()).toEqual({ numerator: 3, denominator: 8 });
  });

  // After the last order the header should say "Order 5 of 5", not "Order 6 of 5"
  it("should be complete after the last order and keep showing the last order number", () => {
    const level = new LevelModel(1, fiveOrders);
    finishFiveOrders(level, 0);

    expect(level.isComplete()).toBe(true);
    expect(level.getProgress().currentOrderNumber).toBe(5);
    expect(level.getProgress().completedOrders).toBe(5);
  });

  // The story's rule: total orders - 1. For 5 orders that's 4.
  // 1 retry means 4 first-try orders
  it("should pass with 4 of 5 first try correct", () => {
    const level = new LevelModel(1, fiveOrders);
    finishFiveOrders(level, 1);
    const result = level.getResult();

    expect(result.passed).toBe(true);
    expect(result.firstTryCorrectCount).toBe(4);
    expect(result.requiredToPass).toBe(4);
  });

  // 2 retries means only 3 first-try orders, one short for passing
  it("should not pass with 3 of 5 first try correct", () => {
    const level = new LevelModel(1, fiveOrders);
    finishFiveOrders(level, 2);
    const result = level.getResult();

    expect(result.passed).toBe(false);
    expect(result.firstTryCorrectCount).toBe(3);
  });

  // Score and passing are separate. Every order took a retry, so they fail,
  // but they still got 100 points for each order they eventually solved.
  it("should still add points for an order solved after a retry", () => {
    const level = new LevelModel(1, fiveOrders);
    finishFiveOrders(level, 5);
    const result = level.getResult();

    expect(result.score).toBe(500);
    expect(result.passed).toBe(false);
  });

  // Check wheter the records of each order are saved correctly for result screen
  it("should record each order and whether it was first try", () => {
    const level = new LevelModel(1, fiveOrders);
    finishFiveOrders(level, 1);
    const records = level.getResult().records;

    expect(records.length).toBe(5);
    expect(records[0].order).toEqual(fiveOrders[0]);
    expect(records[0].firstTryCorrect).toBe(false); // the first order was the retry
    expect(records[0].pointsEarned).toBe(100);
    expect(records[1].firstTryCorrect).toBe(true);
  });

  // Two-order levels: 2 - 1 = 1, so one first-try order is enough
  it("should pass a two order level with 1 of 2 first try correct", () => {
    const twoOrders = [fiveOrders[0], fiveOrders[1]];
    const level = new LevelModel(1, twoOrders);
    level.recordCorrectOrder(0, 100); // first try
    level.recordCorrectOrder(1, 100); // needed a retry

    expect(level.getResult().requiredToPass).toBe(1);
    expect(level.getResult().passed).toBe(true);
  });

  // Both orders needed retries, so 0 first-try orders, which is below 1
  it("should not pass a two order level with 0 of 2 first try correct", () => {
    const twoOrders = [fiveOrders[0], fiveOrders[1]];
    const level = new LevelModel(1, twoOrders);
    level.recordCorrectOrder(1, 100);
    level.recordCorrectOrder(2, 100);

    expect(level.getResult().passed).toBe(false);
  });

  // Passing a third value overrides the default rule. Here only 2 are needed.
  it("should use a custom pass requirement", () => {
    const level = new LevelModel(1, fiveOrders, 2);
    finishFiveOrders(level, 3); // 2 first-try orders

    expect(level.getResult().passed).toBe(true);
  });

  // Play Again / Retry Level should take us back to the start
  it("should reset score and progress to order 1 on restart", () => {
    const level = new LevelModel(1, fiveOrders);
    finishFiveOrders(level, 0);
    level.restart();

    expect(level.isComplete()).toBe(false);
    expect(level.getProgress().currentOrderNumber).toBe(1);
    expect(level.getProgress().score).toBe(0);
    expect(level.getCurrentOrder()).toEqual(fiveOrders[0]);
  });

  // Nofinal result while orders are still left
  it("should not give results before the level is complete", () => {
    const level = new LevelModel(1, fiveOrders);
    level.recordCorrectOrder(0, 100);

    expect(() => level.getResult()).toThrow("Level is not complete yet");
  });

  // Once the level is over, nothing else should be recorded
  it("should not record or return orders after the level is complete", () => {
    const level = new LevelModel(1, fiveOrders);
    finishFiveOrders(level, 0);

    expect(() => level.recordCorrectOrder(0, 100)).toThrow("Level is already complete");
    expect(() => level.getCurrentOrder()).toThrow("Level is already complete");
  });

  // The model copies the orders list, so changing the original list later shouldn't change the level
  it("should not change when the original order list is changed", () => {
    const orders = [fiveOrders[0], fiveOrders[1], fiveOrders[2]];
    const level = new LevelModel(1, orders);
    orders.pop(); // remove an order from the original list

    expect(level.getProgress().totalOrders).toBe(3); // the level still has all 3
  });

  // tests for checking bad setup and bugs
  it("should reject invalid setup values", () => {
    expect(() => new LevelModel(0, fiveOrders)).toThrow("Invalid level number");
    expect(() => new LevelModel(1.5, fiveOrders)).toThrow("Invalid level number");
    expect(() => new LevelModel(1, [])).toThrow("A level needs at least two orders");
    expect(() => new LevelModel(1, [fiveOrders[0]])).toThrow("A level needs at least two orders");
    expect(() => new LevelModel(1, fiveOrders, 0)).toThrow("Invalid pass requirement");
    expect(() => new LevelModel(1, fiveOrders, 6)).toThrow("Invalid pass requirement");
  });

  // Negative tries, negative points, or half points shouldn't be accepted
  it("should reject invalid attempts or points", () => {
    const level = new LevelModel(1, fiveOrders);

    expect(() => level.recordCorrectOrder(-1, 100)).toThrow("Invalid incorrect attempts");
    expect(() => level.recordCorrectOrder(0, -100)).toThrow("Invalid points earned");
    expect(() => level.recordCorrectOrder(0, 2.5)).toThrow("Invalid points earned");
  });
});
