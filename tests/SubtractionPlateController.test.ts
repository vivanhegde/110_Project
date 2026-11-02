// Import test utilities and the shared plate components.
import { describe, it, expect, vi } from "vitest";
import { PlateModel } from "../src/features/plate/PlateModel";
import { PlateController } from "../src/features/plate/PlateController";
import type { PlateView } from "../src/features/plate/PlateView";

// Import subtraction creation and shared feedback.
import { createSubtractionOrder } from "../src/features/pizza/CreateSubtractionOrder";
import { FeedbackModel } from "../src/features/feedback/FeedbackModel";
import { FeedbackController } from "../src/features/feedback/FeedbackController";

// Connect real models to a canvas-free view.
function setup() {
  const plate = new PlateModel(8); // Authoritative slice state.
  const view = {
    setSubtractionMode: vi.fn(), // Record mode changes.
    drawOrder: vi.fn(), // Record starting slice creation.
    showFraction: vi.fn(), // Record visible amounts.
    showTrayText: vi.fn(), // Record tray instructions.
    snapToPlateSlot: vi.fn(), // Record pizza placement.
    snapToTraySlot: vi.fn(), // Record original tray placement.
  };
  const controller = new PlateController(); // Real drag controller.
  controller.setModel(plate);
  controller.setView(view as unknown as PlateView);
  controller.startSubtractionOrder(createSubtractionOrder(5, 2, 8));
  return { plate, view, controller };
}

// Validate subtraction using the shared drag controller.
describe("Subtraction plate integration", () => {
  // Draw only the slices belonging to the starting amount.
  it("starts with five tray slices and an empty order plate", () => {
    const { plate, view, controller } = setup(); // Connected order.
    expect(plate.getSlicesOnPlate()).toBe(0);
    expect(controller.getRemainingSlices()).toBe(5);
    expect(view.drawOrder).toHaveBeenCalledWith(8, 5);
    expect(view.snapToPlateSlot).not.toHaveBeenCalled();
    expect(view.showFraction).toHaveBeenLastCalledWith(0, 8);
    expect(controller.submitSubtractionAnswer().correct).toBe(false);
  });

  // Keep a tray slice unchanged when it misses the order plate.
  it("snaps an invalid drop back without removing the slice", () => {
    const { plate, view, controller } = setup(); // Connected order.
    controller.sliceDroppedOutside(2, 8);
    expect(plate.isOnPlate(2)).toBe(false);
    expect(controller.getRemainingSlices()).toBe(5);
    expect(view.snapToTraySlot).toHaveBeenLastCalledWith(2, 2, 8);
  });

  // Count each slice only once when moving it onto the order plate.
  it("takes away one slice without double counting repeated drops", () => {
    const { plate, view, controller } = setup(); // Connected order.
    controller.sliceDroppedOnPlate(2, 8);
    controller.sliceDroppedOnPlate(2, 8);
    expect(plate.isOnPlate(2)).toBe(true);
    expect(controller.getSlicesOnPlate()).toBe(1);
    expect(controller.getRemainingSlices()).toBe(4);
    expect(view.snapToPlateSlot).toHaveBeenLastCalledWith(2, 0, 8);
    expect(view.showFraction).toHaveBeenLastCalledWith(1, 8);
  });

  // Preserve the teammate's original return-to-tray behavior.
  it("restores an order-plate slice to its original tray position", () => {
    const { plate, view, controller } = setup(); // Connected order.
    controller.sliceDroppedOnPlate(1, 8);
    controller.sliceDroppedOutside(1, 8);
    expect(plate.isOnPlate(1)).toBe(false);
    expect(controller.getSlicesOnPlate()).toBe(0);
    expect(controller.getRemainingSlices()).toBe(5);
    expect(view.snapToTraySlot).toHaveBeenLastCalledWith(1, 1, 8);
  });

  // Allow students to undo a removal.
  it("does not double count repeated restoration to the tray", () => {
    const { plate, view, controller } = setup(); // Connected order.
    controller.sliceDroppedOnPlate(3, 8);
    controller.sliceDroppedOutside(3, 8);
    controller.sliceDroppedOutside(3, 8);
    expect(plate.isOnPlate(3)).toBe(false);
    expect(controller.getRemainingSlices()).toBe(5);
    expect(view.showFraction).toHaveBeenLastCalledWith(0, 8);
  });

  // Preserve clockwise placement using the first available plate slot.
  it("uses the original first-empty-slot rule regardless of slice ID", () => {
    const { plate, view, controller } = setup(); // Connected order.
    controller.sliceDroppedOnPlate(4, 8);
    expect(view.snapToPlateSlot).toHaveBeenLastCalledWith(4, 0, 8);
    controller.sliceDroppedOnPlate(1, 8);
    expect(view.snapToPlateSlot).toHaveBeenLastCalledWith(1, 1, 8);
    controller.sliceDroppedOutside(4, 8);
    controller.sliceDroppedOnPlate(3, 8);
    expect(view.snapToPlateSlot).toHaveBeenLastCalledWith(3, 0, 8);
    expect(plate.getSlot(1)).toBe(1);
    expect(controller.getRemainingSlices()).toBe(3);
  });

  // Prevent adding slices that did not exist in the starting amount.
  it("rejects an extra slice from outside the order", () => {
    const { controller } = setup(); // Connected order.
    expect(() => controller.sliceDroppedOnPlate(7, 8)).toThrow("Invalid subtraction slice");
    expect(controller.getSlicesOnPlate()).toBe(0);
    expect(controller.getRemainingSlices()).toBe(5);
  });

  // Submit actual drag results to the existing feedback module.
  it("supports feedback and retry using the same plate state", () => {
    const { controller } = setup(); // Connected order.
    const order = createSubtractionOrder(5, 2, 8); // Target fraction.
    const feedback = new FeedbackController(new FeedbackModel()); // Feedback state.
    controller.sliceDroppedOnPlate(0, 8);
    const wrong = feedback.showFeedback(
      order, controller.getRemainingSlices(), controller.submitSubtractionAnswer(),
    ); // Feedback after one removal.
    expect(wrong.type).toBe("tooMany");
    expect(wrong.pointsEarned).toBe(0);
    feedback.closeFeedback();
    expect(controller.getRemainingSlices()).toBe(4);
    controller.sliceDroppedOnPlate(1, 8);
    const correct = feedback.showFeedback(
      order, controller.getRemainingSlices(), controller.submitSubtractionAnswer(),
    ); // Feedback after correcting the plate.
    expect(correct.type).toBe("correct");
    expect(feedback.getIncorrectAttempts()).toBe(1);
  });

  // Support taking away the entire starting amount.
  it("accepts a zero result after all tray slices move right", () => {
    const { view, controller } = setup(); // Connected order.
    controller.startSubtractionOrder(createSubtractionOrder(3, 3, 6));
    for (let sliceId = 0; sliceId < 3; sliceId++) {
      controller.sliceDroppedOnPlate(sliceId, 6);
    }
    expect(controller.getSlicesOnPlate()).toBe(3);
    expect(controller.getRemainingSlices()).toBe(0);
    expect(controller.submitSubtractionAnswer().correct).toBe(true);
    expect(view.showFraction).toHaveBeenLastCalledWith(3, 6);
  });

  // Discard previous placements when a new order starts.
  it("resets slices and denominator for the next subtraction order", () => {
    const { plate, view, controller } = setup(); // Connected order.
    controller.sliceDroppedOnPlate(0, 8);
    controller.startSubtractionOrder(createSubtractionOrder(3, 1, 6));
    expect(plate.getDenominator()).toBe(6);
    expect(controller.getSlicesOnPlate()).toBe(0);
    expect(controller.getRemainingSlices()).toBe(3);
    expect(view.drawOrder).toHaveBeenLastCalledWith(6, 3);
    expect(view.showFraction).toHaveBeenLastCalledWith(0, 6);
  });

  // Keep the existing addition behavior available.
  it("switches back to addition with an empty plate", () => {
    const { view, controller } = setup(); // Connected order.
    controller.startOrder(8);
    expect(view.setSubtractionMode).toHaveBeenLastCalledWith(null);
    expect(controller.getSlicesOnPlate()).toBe(0);
    controller.sliceDroppedOnPlate(6, 8);
    expect(controller.getSlicesOnPlate()).toBe(1);
    controller.sliceDroppedOutside(6, 8);
    expect(controller.getSlicesOnPlate()).toBe(0);
    expect(() => controller.submitSubtractionAnswer()).toThrow("No subtraction order is active");
  });
});
