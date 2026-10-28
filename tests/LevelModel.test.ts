import { describe, it, expect } from "vitest";
import { LevelModel } from "../src/features/level/LevelModel";
import type { PizzaOrder } from "../src/features/pizza/types";

//Five sample orders used by most tests
const fiveOrders: PizzaOrder[] = [
  { numerator: 5, denominator: 8 },
  { numerator: 3, denominator: 8 },
  { numerator: 4, denominator: 8 },
  { numerator: 6, denominator: 8 },
  { numerator: 2, denominator: 8 },
];

//Solves every order: the first `wrongCount` orders took one retry, the rest were first try
function finishLevel(level: LevelModel, wrongCount: number): void {
  for (let i = 0; i < 5; i++) {
    level.recordCorrectOrder(i < wrongCount ? 1 : 0, 100);
  }
}

describe("LevelModel", () => {
  it("should start on order 1 with a score of 0", () => {
    const level = new LevelModel(1, fiveOrders);
    expect(level.getProgress()).toEqual({
      levelNumber: 1,
      currentOrderNumber: 1,
      totalOrders: 5,
      completedOrders: 0,
      score: 0,
      isComplete: false,
    });
    expect(level.getCurrentOrder()).toEqual({ numerator: 5, denominator: 8 });
  });

  it("should move to the next order and add points after a correct order", () => {
    const level = new LevelModel(1, fiveOrders);
    level.recordCorrectOrder(0, 100);
    expect(level.getProgress().currentOrderNumber).toBe(2);
    expect(level.getProgress().completedOrders).toBe(1);
    expect(level.getProgress().score).toBe(100);
    expect(level.getCurrentOrder()).toEqual({ numerator: 3, denominator: 8 });
  });

  it("should be complete after the last order and keep showing the last order number", () => {
    const level = new LevelModel(1, fiveOrders);
    finishLevel(level, 0);
    expect(level.isComplete()).toBe(true);
    expect(level.getProgress().currentOrderNumber).toBe(5);
    expect(level.getProgress().completedOrders).toBe(5);
  });

  it("should pass with 4 of 5 first try correct", () => {
    const level = new LevelModel(1, fiveOrders);
    finishLevel(level, 1);
    const result = level.getResult();
    expect(result.passed).toBe(true);
    expect(result.firstTryCorrectCount).toBe(4);
    expect(result.requiredToPass).toBe(4);
  });

  it("should not pass with 3 of 5 first try correct", () => {
    const level = new LevelModel(1, fiveOrders);
    finishLevel(level, 2);
    expect(level.getResult().passed).toBe(false);
    expect(level.getResult().firstTryCorrectCount).toBe(3);
  });

  it("should still add points for an order solved after a retry", () => {
    const level = new LevelModel(1, fiveOrders);
    finishLevel(level, 5);
    expect(level.getResult().score).toBe(500);
    expect(level.getResult().passed).toBe(false);
  });

  it("should record each order and whether it was first try", () => {
    const level = new LevelModel(1, fiveOrders);
    finishLevel(level, 1);
    const records = level.getResult().records;
    expect(records).toHaveLength(5);
    expect(records[0]).toEqual({ order: fiveOrders[0], firstTryCorrect: false, pointsEarned: 100 });
    expect(records[1].firstTryCorrect).toBe(true);
  });

  it("should require both orders in a two order level", () => {
    const level = new LevelModel(1, fiveOrders.slice(0, 2));
    expect(level.getProgress().totalOrders).toBe(2);
    level.recordCorrectOrder(0, 100);
    level.recordCorrectOrder(1, 100);
    expect(level.getResult().requiredToPass).toBe(2);
    expect(level.getResult().passed).toBe(false);
  });

  it("should use a custom pass requirement", () => {
    const level = new LevelModel(1, fiveOrders, 2);
    finishLevel(level, 3);
    expect(level.getResult().passed).toBe(true);
  });

  it("should reset score and progress to order 1 on restart", () => {
    const level = new LevelModel(1, fiveOrders);
    finishLevel(level, 0);
    level.restart();
    expect(level.isComplete()).toBe(false);
    expect(level.getProgress().currentOrderNumber).toBe(1);
    expect(level.getProgress().score).toBe(0);
    expect(level.getCurrentOrder()).toEqual(fiveOrders[0]);
  });

  it("should not give results before the level is complete", () => {
    const level = new LevelModel(1, fiveOrders);
    level.recordCorrectOrder(0, 100);
    expect(() => level.getResult()).toThrow("Level is not complete yet");
  });

  it("should not record or return orders after the level is complete", () => {
    const level = new LevelModel(1, fiveOrders);
    finishLevel(level, 0);
    expect(() => level.recordCorrectOrder(0, 100)).toThrow("Level is already complete");
    expect(() => level.getCurrentOrder()).toThrow("Level is already complete");
  });

  it("should not change when the original order list is changed", () => {
    const orders = [...fiveOrders];
    const level = new LevelModel(1, orders);
    orders.pop();
    expect(level.getProgress().totalOrders).toBe(5);
  });

  it("should reject invalid setup values", () => {
    expect(() => new LevelModel(0, fiveOrders)).toThrow("Invalid level number");
    expect(() => new LevelModel(1.5, fiveOrders)).toThrow("Invalid level number");
    expect(() => new LevelModel(1, [])).toThrow("A level needs at least one order");
    expect(() => new LevelModel(1, fiveOrders, 0)).toThrow("Invalid pass requirement");
    expect(() => new LevelModel(1, fiveOrders, 6)).toThrow("Invalid pass requirement");
  });

  it("should reject invalid attempts or points", () => {
    const level = new LevelModel(1, fiveOrders);
    expect(() => level.recordCorrectOrder(-1, 100)).toThrow("Invalid incorrect attempts");
    expect(() => level.recordCorrectOrder(0, -100)).toThrow("Invalid points earned");
    expect(() => level.recordCorrectOrder(0, 2.5)).toThrow("Invalid points earned");
  });
});
