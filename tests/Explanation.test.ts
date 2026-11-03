import { describe, expect, it } from "vitest";
import { FeedbackController } from "../src/features/feedback/FeedbackController";
import { FeedbackModel } from "../src/features/feedback/FeedbackModel";
import { createExplanation } from "../src/features/feedback/Explanation";
import { createSubtractionOrder } from "../src/features/pizza/CreateSubtractionOrder";

const wrong = { correct: false, message: "Try again" };
const right = { correct: true, message: "Correct" };

describe("Detailed explanations", () => {
  it("unlocks on the second mistake and remains available on later mistakes", () => {
    const controller = new FeedbackController(new FeedbackModel());
    const order = createSubtractionOrder(5, 2, 8);
    expect(controller.showFeedback(order, 4, wrong).explanation).toBeUndefined();
    controller.closeFeedback();
    const explanation = controller.showFeedback(order, 2, wrong).explanation;
    expect(explanation?.steps).toContain(
      "Subtract the slice counts: 5 − 2 = 3. Keep the denominator 8 because the slices stay the same size.",
    );
    expect(explanation?.rows?.[0].pizzas.map(pizza => pizza.filledSlices)).toEqual([5, 0]);
    expect(explanation?.rows?.[2].pizzas.map(pizza => pizza.label)).toEqual(["Slice tray", "Return plate"]);
    expect(explanation?.rows?.map(row => row.pizzas.length)).toEqual([2, 2, 2]);
    expect(explanation?.rows?.[1].pizzas[0]).toMatchObject({ filledSlices: 3, fadedSlices: 2 });
    expect(explanation?.rows?.[2].pizzas.map(pizza => pizza.filledSlices)).toEqual([3, 2]);
    expect(explanation?.pizzas.map(pizza => pizza.filledSlices)).toEqual([5, 2, 3]);
    controller.closeFeedback();
    expect(controller.showFeedback(order, 5, wrong).explanation).toEqual(explanation);
    expect(controller.getIncorrectAttempts()).toBe(3);
  });

  it("does not show an explanation for success and resets for the next order", () => {
    const controller = new FeedbackController(new FeedbackModel());
    const order = createSubtractionOrder(5, 2, 8);
    controller.showFeedback(order, 4, wrong);
    controller.closeFeedback();
    controller.showFeedback(order, 4, wrong);
    controller.closeFeedback();
    expect(controller.showFeedback(order, 3, right).explanation).toBeUndefined();
    expect(controller.getIncorrectAttempts()).toBe(2);
    controller.startNewOrder();
    expect(controller.getCurrentFeedback()).toBeNull();
    expect(controller.getIncorrectAttempts()).toBe(0);
    expect(controller.showFeedback(createSubtractionOrder(3, 1, 4), 3, wrong).explanation).toBeUndefined();
  });

  it("explains a zero remainder and represents empty pizza accurately", () => {
    const explanation = createExplanation(createSubtractionOrder(3, 3, 4));
    expect(explanation.rows?.[1].pizzas[0]).toMatchObject({ filledSlices: 0, fadedSlices: 3 });
    expect(explanation.steps.at(-1)).toContain("3/4 − 3/4 = 0/4");
    expect(explanation.pizzas.at(-1)).toEqual({ label: "Left in the tray", filledSlices: 0, denominator: 4 });
  });

  it("supports plain fraction orders without inventing subtraction operands", () => {
    const explanation = createExplanation({ numerator: 3, denominator: 4 });
    expect(explanation.steps.at(-1)).toBe("Place 3 slices on the plate to make 3/4.");
    expect(explanation.pizzas.map(pizza => pizza.filledSlices)).toEqual([4, 3]);
  });
});
