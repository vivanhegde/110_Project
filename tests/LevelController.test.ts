import { describe, it, expect } from "vitest";
import { LevelModel } from "../src/features/level/LevelModel";
import { LevelController } from "../src/features/level/LevelController";
import { PizzaOrderModel } from "../src/features/pizza/PizzaOrderModel";
import { PizzaOrderController } from "../src/features/pizza/PizzaOrderController";
import { FeedbackModel } from "../src/features/feedback/FeedbackModel";
import { FeedbackController } from "../src/features/feedback/FeedbackController";
import type { PizzaOrder } from "../src/features/pizza/types";

const twoOrders: PizzaOrder[] = [
  { numerator: 3, denominator: 8 },
  { numerator: 5, denominator: 8 },
];

//Plays one order the way the game will: wrong answers first, then the right one
function playOrder(level: LevelController, feedback: FeedbackController, wrongAnswers: number[]): void {
  const pizzaModel = new PizzaOrderModel(level.getCurrentOrder());
  const pizza = new PizzaOrderController(pizzaModel);
  feedback.startNewOrder();

  for (const wrong of wrongAnswers) {
    pizza.selectSlice(wrong);
    feedback.showFeedback(pizzaModel.getOrder(), wrong, pizza.submitAnswer());
    feedback.closeFeedback();
  }

  pizza.selectSlice(pizzaModel.getOrder().numerator);
  const correct = feedback.showFeedback(pizzaModel.getOrder(), pizza.getSelectedSlices(), pizza.submitAnswer());
  level.completeOrder(feedback.getIncorrectAttempts(), correct.pointsEarned);
}

describe("LevelController", () => {
  it("should give the current order to the pizza feature", () => {
    const level = new LevelController(new LevelModel(1, twoOrders));
    expect(level.getCurrentOrder()).toEqual({ numerator: 3, denominator: 8 });
  });

  it("should pass a level when every order is right on the first try", () => {
    const level = new LevelController(new LevelModel(1, twoOrders));
    const feedback = new FeedbackController(new FeedbackModel());
    playOrder(level, feedback, []);
    playOrder(level, feedback, []);
    expect(level.isLevelComplete()).toBe(true);
    expect(level.getResult().passed).toBe(true);
    expect(level.getResult().score).toBe(200);
  });

  it("should not pass when an order needed a retry in a two order level", () => {
    const level = new LevelController(new LevelModel(1, twoOrders));
    const feedback = new FeedbackController(new FeedbackModel());
    playOrder(level, feedback, [2]);
    playOrder(level, feedback, []);
    expect(level.getResult().firstTryCorrectCount).toBe(1);
    expect(level.getResult().passed).toBe(false);
  });

  it("should update progress after each order", () => {
    const level = new LevelController(new LevelModel(1, twoOrders));
    const feedback = new FeedbackController(new FeedbackModel());
    playOrder(level, feedback, []);
    expect(level.getProgress().currentOrderNumber).toBe(2);
    expect(level.getProgress().score).toBe(100);
    expect(level.isLevelComplete()).toBe(false);
  });

  it("should restart the level at order 1", () => {
    const level = new LevelController(new LevelModel(1, twoOrders));
    const feedback = new FeedbackController(new FeedbackModel());
    playOrder(level, feedback, []);
    playOrder(level, feedback, []);
    level.restartLevel();
    expect(level.getProgress().currentOrderNumber).toBe(1);
    expect(level.getProgress().score).toBe(0);
  });
});
