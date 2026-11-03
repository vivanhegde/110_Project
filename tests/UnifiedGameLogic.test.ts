import { describe, expect, it } from "vitest";

import { LEVEL_ORDERS } from "../src/features/game/orders";
import { LevelModel } from "../src/features/level/LevelModel";
import { FeedbackModel } from "../src/features/feedback/FeedbackModel";
import { PizzaOrderModel } from "../src/features/pizza/PizzaOrderModel";
import { PlateModel } from "../src/features/plate/PlateModel";
import { SubtractionOrderModel } from "../src/features/pizza/SubtractionOrderModel";

import type { SubtractionOrder } from "../src/features/pizza/types";

describe("Unified level rules", () => {
  it("has five valid orders with addition and subtraction", () => {
    expect(LEVEL_ORDERS).toHaveLength(5);

    for (const order of LEVEL_ORDERS) {
      expect(
        () => new PizzaOrderModel(order)
      ).not.toThrow();
    }

    const subtractionOrders = LEVEL_ORDERS.filter(
      order => "initialNumerator" in order
    );

    expect(subtractionOrders).toHaveLength(2);
  });

  it("records points and first-try results", () => {
    const level = new LevelModel(1, LEVEL_ORDERS);
    const feedback = new FeedbackModel();

    for (let i = 0; i < LEVEL_ORDERS.length; i++) {
      const order = level.getCurrentOrder();

      feedback.reset();

      // Simulate one incorrect attempt on order two.
      if (i === 1) {
        feedback.createFeedback(
          order,
          0,
          {
            correct: false,
            message: "Try again!"
          }
        );
      }

      const response = feedback.createFeedback(
        order,
        order.numerator,
        {
          correct: true,
          message: "Correct!"
        }
      );

      level.recordCorrectOrder(
        feedback.getIncorrectAttempts(),
        response.pointsEarned
      );
    }

    const result = level.getResult();

    expect(result.score).toBe(500);
    expect(result.firstTryCorrectCount).toBe(4);
    expect(result.passed).toBe(true);
  });

  it("checks the remaining slices for subtraction", () => {
    const order = LEVEL_ORDERS[1] as SubtractionOrder;

    const plate = new PlateModel(order.denominator);

    const subtraction = new SubtractionOrderModel(
      order,
      plate
    );

    subtraction.removeSlice(0);
    subtraction.removeSlice(1);

    expect(subtraction.getSelectedSlices()).toBe(4);

    expect(
      subtraction.checkAnswer().correct
    ).toBe(true);
  });
});
