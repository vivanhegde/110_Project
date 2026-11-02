import { describe, it, expect } from "vitest";
import { LevelModel } from "../src/features/level/LevelModel";
import { LevelController } from "../src/features/level/LevelController";
import { PizzaOrderModel } from "../src/features/pizza/PizzaOrderModel";
import { PizzaOrderController } from "../src/features/pizza/PizzaOrderController";
import { FeedbackModel } from "../src/features/feedback/FeedbackModel";
import { FeedbackController } from "../src/features/feedback/FeedbackController";
import type { PizzaOrder } from "../src/features/pizza/types";

/*
  Tests for LevelController.

  These are different from the LevelModel tests. Instead of faking the numbers,
  they use the real pizza and feedback features from our project, the same way
  the game will. This checks that the three features actually work together:
    - pizza checks if the answer is right
    - feedback counts the wrong tries and gives the points
    - level uses those two numbers to track progress and passing
*/

// A short level with two orders: 3/8 and 5/8
const twoOrders: PizzaOrder[] = [
  { numerator: 3, denominator: 8 },
  { numerator: 5, denominator: 8 },
];

// 1. Get the current order from the level
// 2. Try each wrong answer in wrongAnswers, then press Try Again
// 3. Give the right answer
// 4. Press Next Order, which tells the level how it went
// Example: playOrder(level, feedback, [2]) means one wrong answer (2 slices) before getting it right.
function playOrder(level: LevelController, feedback: FeedbackController, wrongAnswers: number[]): void
{
  const pizzaModel = new PizzaOrderModel(level.getCurrentOrder());
  const pizza = new PizzaOrderController(pizzaModel);
  const order = pizzaModel.getOrder();

  // 1. Each new order starts with 0 wrong tries
  feedback.startNewOrder();

  // 2. Wrong answers first. Each one adds 1 to the feedback's wrong-try count.
  for (let i = 0; i < wrongAnswers.length; i++)
  {
    pizza.selectSlice(wrongAnswers[i]);
    feedback.showFeedback(order, wrongAnswers[i], pizza.submitAnswer());
    feedback.closeFeedback(); // Try Again
  }

  // 3. Right answer: select correct numerator
  pizza.selectSlice(order.numerator);
  const correctFeedback = feedback.showFeedback(order, pizza.getSelectedSlices(), pizza.submitAnswer());

  // 4. Next Order: pass the wrong-try count and the points to the level
  level.completeOrder(feedback.getIncorrectAttempts(), correctFeedback.pointsEarned);
}

describe("LevelController", () => {
  // The pizza feature asks the level which order to show
  it("should give the current order to the pizza feature", () => {
    const level = new LevelController(new LevelModel(1, twoOrders));

    expect(level.getCurrentOrder()).toEqual({ numerator: 3, denominator: 8 });
  });

  // Perfect run: both orders right the first time
  it("should pass a level when every order is right on the first try", () => {
    const level = new LevelController(new LevelModel(1, twoOrders));
    const feedback = new FeedbackController(new FeedbackModel());
    playOrder(level, feedback, []);
    playOrder(level, feedback, []);

    expect(level.isLevelComplete()).toBe(true);
    expect(level.getResult().passed).toBe(true);
    expect(level.getResult().score).toBe(200);
  });

  // One mistake is allowed in a two-order level (2 - 1 = 1 needed)
  it("should still pass a two order level with one retry", () => {
    const level = new LevelController(new LevelModel(1, twoOrders));
    const feedback = new FeedbackController(new FeedbackModel());
    playOrder(level, feedback, [2]); // wrong once, then right
    playOrder(level, feedback, []);  // right the first time

    expect(level.getResult().firstTryCorrectCount).toBe(1);
    expect(level.getResult().passed).toBe(true);
  });

  // Mistakes on both orders means 0 first-try orders, so they don't pass
  it("should not pass a two order level when both orders needed a retry", () => {
    const level = new LevelController(new LevelModel(1, twoOrders));
    const feedback = new FeedbackController(new FeedbackModel());
    playOrder(level, feedback, [2]); // too few slices first
    playOrder(level, feedback, [7]); // too many slices first

    expect(level.getResult().firstTryCorrectCount).toBe(0);
    expect(level.getResult().passed).toBe(false);
  });

  // The header data should update after each order
  it("should update progress after each order", () => {
    const level = new LevelController(new LevelModel(1, twoOrders));
    const feedback = new FeedbackController(new FeedbackModel());
    playOrder(level, feedback, []);

    expect(level.getProgress().currentOrderNumber).toBe(2);
    expect(level.getProgress().score).toBe(100);
    expect(level.isLevelComplete()).toBe(false);
  });

  // Play Again / Retry Level goes back to the beginning
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
