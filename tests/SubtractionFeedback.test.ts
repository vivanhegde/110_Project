// Import test utilities.
import { describe, it, expect } from "vitest";

// Import subtraction order creation.
import { createSubtractionOrder } from "../src/features/pizza/CreateSubtractionOrder";

// Import the subtraction slice model.
import { SubtractionOrderModel } from "../src/features/pizza/SubtractionOrderModel";

// Import the existing feedback modules.
import { FeedbackModel } from "../src/features/feedback/FeedbackModel";
import { FeedbackController } from "../src/features/feedback/FeedbackController";

// Test subtraction answer checking and feedback.
describe("Subtraction feedback", () => {
  // Accept the correct remaining amount.
  it("should accept 3 slices for 5/8 - 2/8", () => {
    const order = createSubtractionOrder(5, 2, 8); // Target is 3/8.
    const model = new SubtractionOrderModel(order); // Start with 5 slices.
    const feedback = new FeedbackController(new FeedbackModel()); // Create feedback.

    // Remove two slices to reach the target.
    model.removeSlice();
    model.removeSlice();

    // Check the answer and generate feedback.
    const result = model.checkAnswer(); // Answer checking result.
    const response = feedback.showFeedback(
      model.getOrder(),
      model.getSelectedSlices(),
      result,
    ); // Generated feedback.

    // Verify the correct-answer state.
    expect(model.getSelectedSlices()).toBe(3);
    expect(result.correct).toBe(true);
    expect(response.type).toBe("correct");
    expect(response.pointsEarned).toBe(100);
    expect(response.actionLabel).toBe("Next Order");
    expect(response.message).toContain("3/8");
  });

  // Detect too many remaining slices.
  it("should show tooMany when 4 slices remain", () => {
    const order = createSubtractionOrder(5, 2, 8); // Target is 3/8.
    const model = new SubtractionOrderModel(order); // Start with 5 slices.
    const feedback = new FeedbackController(new FeedbackModel()); // Create feedback.

    // Remove only one slice.
    model.removeSlice();

    // Generate feedback for the remaining amount.
    const response = feedback.showFeedback(
      model.getOrder(),
      model.getSelectedSlices(),
      model.checkAnswer(),
    ); // Generated feedback.

    // Verify the incorrect-answer state.
    expect(model.getSelectedSlices()).toBe(4);
    expect(response.type).toBe("tooMany");
    expect(response.pointsEarned).toBe(0);
    expect(response.actionLabel).toBe("Try Again");
    expect(response.message).toContain("Take away 1 slice");
  });

  // Detect too few remaining slices.
  it("should show tooFew when 2 slices remain", () => {
    const order = createSubtractionOrder(5, 2, 8); // Target is 3/8.
    const model = new SubtractionOrderModel(order); // Start with 5 slices.
    const feedback = new FeedbackController(new FeedbackModel()); // Create feedback.

    // Remove three slices instead of two.
    model.removeSlice();
    model.removeSlice();
    model.removeSlice();

    // Generate feedback for the remaining amount.
    const response = feedback.showFeedback(
      model.getOrder(),
      model.getSelectedSlices(),
      model.checkAnswer(),
    ); // Generated feedback.

    // Verify the incorrect-answer state.
    expect(model.getSelectedSlices()).toBe(2);
    expect(response.type).toBe("tooFew");
    expect(response.pointsEarned).toBe(0);
    expect(response.actionLabel).toBe("Try Again");
    expect(response.message).toContain("Add 1 more slice");
  });

  // Preserve the plate and allow a corrected answer.
  it("should allow retrying without resetting the plate", () => {
    const order = createSubtractionOrder(5, 2, 8); // Target is 3/8.
    const model = new SubtractionOrderModel(order); // Start with 5 slices.
    const feedback = new FeedbackController(new FeedbackModel()); // Create feedback.

    // Remove one slice and submit an incorrect answer.
    model.removeSlice();
    feedback.showFeedback(
      model.getOrder(),
      model.getSelectedSlices(),
      model.checkAnswer(),
    );

    // Close feedback without changing the plate.
    feedback.closeFeedback();

    // Verify that retry preserves the current state.
    expect(feedback.getCurrentFeedback()).toBeNull();
    expect(model.getSelectedSlices()).toBe(4);
    expect(feedback.getIncorrectAttempts()).toBe(1);

    // Remove one more slice to correct the answer.
    model.removeSlice();
    const response = feedback.showFeedback(
      model.getOrder(),
      model.getSelectedSlices(),
      model.checkAnswer(),
    ); // Feedback for the corrected answer.

    // Verify that the corrected answer is accepted.
    expect(model.getSelectedSlices()).toBe(3);
    expect(response.type).toBe("correct");
    expect(feedback.getIncorrectAttempts()).toBe(1);
  });
});
