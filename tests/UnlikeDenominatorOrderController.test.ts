// Import test utilities.
import { describe, it, expect, vi } from "vitest";

// Import real plate state and drag handling.
import { PlateModel } from "../src/features/plate/PlateModel";
import { PlateController } from "../src/features/plate/PlateController";
import type { PlateView } from "../src/features/plate/PlateView";

// Import US11 order creation and coordination.
import {
  createUnlikeDenominatorOrder,
} from "../src/features/pizza/CreateUnlikeDenominatorOrder";
import {
  UnlikeDenominatorOrderController,
} from "../src/features/pizza/UnlikeDenominatorOrderController";
import type { UnlikeDenominatorOrder } from "../src/features/pizza/types";

// Connect real controllers to a canvas-free view.
function setup(order?: UnlikeDenominatorOrder) {
  const plate = new PlateModel(2); // Shared slice state.
  const view = {
    setSubtractionMode: vi.fn(), // Record operation changes.
    setInteractionEnabled: vi.fn(), // Record dragging availability.
    drawOrder: vi.fn(), // Record slice creation.
    showFraction: vi.fn(), // Record fraction updates.
    showTrayText: vi.fn(), // Record tray instructions.
    snapToPlateSlot: vi.fn(), // Record right-plate placement.
    snapToTraySlot: vi.fn(), // Record slice restoration.
  };
  const plateController = new PlateController(); // Real US10 and drag controller.
  const plateView = view as unknown as PlateView; // Canvas-free view adapter.

  plateController.setModel(plate);
  plateController.setView(plateView);

  const controller = new UnlikeDenominatorOrderController(
    plateController,
    plateView,
  ); // US11 coordinator.

  if (order) controller.startOrder(order);

  return { plate, view, plateController, controller };
}

// Use the real US10 controls to reach the required denominator.
function beginAnswering(controller: UnlikeDenominatorOrderController): void {
  const target = controller.getOrder().commonDenominator; // Required slice unit.

  while (controller.getDenominator() !== target) {
    const direction = controller.getDenominator() < target ? 1 : -1;
    expect(controller.canStepDenominator(direction)).toBe(true);
    controller.stepDenominator(direction);
  }

  expect(controller.canConfirmCutting()).toBe(true);
  controller.confirmCutting();
}

// Move real slice IDs through the shared drag controller.
function placeSlices(controller: PlateController, count: number): void {
  const denominator = controller.getDenominator(); // Current slice size.

  for (let sliceId = 0; sliceId < count; sliceId++) {
    controller.sliceDroppedOnPlate(sliceId, denominator);
  }
}

// Test cutting stages and actual shared plate state.
describe("UnlikeDenominatorOrderController", () => {
  // Require a question before allowing game actions.
  it("rejects order actions before a question starts", () => {
    const { controller } = setup();

    expect(controller.getStage()).toBeNull();
    expect(controller.canStartCutting()).toBe(false);
    expect(controller.canStepDenominator(1)).toBe(false);
    expect(controller.canConfirmCutting()).toBe(false);
    expect(() => controller.getOrder()).toThrow("No unlike-denominator order is active");
    expect(() => controller.checkAnswer()).toThrow("No unlike-denominator order is active");
    expect(() => controller.resetOrder()).toThrow("No unlike-denominator order is active");
  });

  // Start from the first fraction and disable dragging during cutting.
  it("starts in cutting mode at the original denominator", () => {
    const order = createUnlikeDenominatorOrder("addition", 1, 3, 1, 4);
    const { controller, plate, view } = setup(order);

    expect(controller.getOrder()).toEqual(order);
    expect(controller.getStage()).toBe("cutting");
    expect(controller.getDenominator()).toBe(3);
    expect(plate.getSlicesOnPlate()).toBe(0);
    expect(controller.canStartCutting()).toBe(true);
    expect(controller.canConfirmCutting()).toBe(false);
    expect(view.drawOrder).toHaveBeenLastCalledWith(3, 1);
    expect(view.setInteractionEnabled).toHaveBeenLastCalledWith(false);
  });

  // Reuse US10's valid denominator sequence and both directions.
  it("changes cuts while keeping dragging disabled", () => {
    const order = createUnlikeDenominatorOrder("addition", 1, 3, 1, 4);
    const { controller, view } = setup(order);

    controller.stepDenominator(1);
    expect(controller.getDenominator()).toBe(6);
    expect(view.drawOrder).toHaveBeenLastCalledWith(6, 2);
    expect(controller.canConfirmCutting()).toBe(false);
    expect(view.setInteractionEnabled).toHaveBeenLastCalledWith(false);

    controller.stepDenominator(-1);
    expect(controller.getDenominator()).toBe(3);
    expect(view.drawOrder).toHaveBeenLastCalledWith(3, 1);
    expect(view.setInteractionEnabled).toHaveBeenLastCalledWith(false);
  });

  // Keep the same amount across all cuts, including reduction, zero, and a whole.
  it.each([
    ["addition", 1, 2, 1, 5],
    ["addition", 2, 4, 1, 8],
    ["addition", 2, 3, 1, 9],
    ["addition", 0, 5, 1, 10],
    ["subtraction", 5, 5, 1, 10],
  ] as const)("preserves the first amount in %s with %i/%i and %i/%i", (operation, n1, d1, n2, d2) => {
    const order = createUnlikeDenominatorOrder(operation, n1, d1, n2, d2); // Original question.
    const { controller, plate, view } = setup(order); // Actual cutting state.
    const checkAmount = () => {
      const [denominator, slices] = view.drawOrder.mock.calls.at(-1)!; // Current drawing request.
      expect(denominator).toBe(controller.getDenominator());
      expect(Number.isInteger(slices)).toBe(true);
      expect(slices * d1).toBe(n1 * denominator);
      expect(slices).toBeGreaterThanOrEqual(0);
      expect(slices).toBeLessThanOrEqual(denominator);
      expect(plate.getSlicesOnPlate()).toBe(0);
      expect(view.setInteractionEnabled).toHaveBeenLastCalledWith(false);
    };
    checkAmount();
    while (controller.canStepDenominator(-1)) {
      controller.stepDenominator(-1);
      checkAmount();
    }
    while (controller.canStepDenominator(1)) {
      controller.stepDenominator(1);
      checkAmount();
    }
    controller.resetOrder();
    expect(view.drawOrder).toHaveBeenLastCalledWith(d1, n1);
    checkAmount();
  });

  // Avoid stepping beyond the available US10 options.
  it("keeps the denominator unchanged at cutting boundaries", () => {
    const order = createUnlikeDenominatorOrder("addition", 1, 3, 1, 4);
    const { controller } = setup(order);

    expect(controller.canStepDenominator(-1)).toBe(false);
    controller.stepDenominator(-1);
    expect(controller.getDenominator()).toBe(3);

    controller.stepDenominator(1);
    controller.stepDenominator(1);
    controller.stepDenominator(1);
    expect(controller.getDenominator()).toBe(12);
    expect(controller.canStepDenominator(1)).toBe(false);
    controller.stepDenominator(1);
    expect(controller.getDenominator()).toBe(12);
  });

  // Block confirmation and answer checking before conversion is complete.
  it("requires the common denominator before answering", () => {
    const order = createUnlikeDenominatorOrder("addition", 1, 3, 1, 4);
    const { controller, view } = setup(order);

    expect(() => controller.confirmCutting())
      .toThrow("Choose the common denominator before answering");
    expect(() => controller.getSelectedSlices())
      .toThrow("Confirm cutting before answering");
    expect(() => controller.checkAnswer())
      .toThrow("Confirm cutting before answering");
    expect(controller.getStage()).toBe("cutting");
    expect(view.setInteractionEnabled).toHaveBeenLastCalledWith(false);
  });

  // Keep invalid choices in cutting mode and explain why they need changing.
  it("reports a denominator that is not common to both operands", () => {
    const order = createUnlikeDenominatorOrder("addition", 1, 3, 1, 4); // Twelfths required.
    const { controller, view } = setup(order);
    expect(controller.checkCutting()).toEqual({
      correct: false,
      message: "3 is not a common denominator of 3 and 4. Choose a multiple of both denominators.",
    });
    expect(controller.getStage()).toBe("cutting");
    expect(view.setInteractionEnabled).toHaveBeenLastCalledWith(false);
  });

  // A nonminimal common denominator is valid mathematically but needs a hint.
  it("distinguishes nonminimal common cuts from invalid cuts", () => {
    const order = createUnlikeDenominatorOrder("addition", 1, 2, 1, 3); // Sixths required.
    const { controller, view } = setup(order);
    for (let step = 0; step < 5; step++) controller.stepDenominator(1);
    expect(controller.getDenominator()).toBe(12);
    expect(controller.checkCutting()).toEqual({
      correct: false,
      message: "12 is a common denominator, but it is not the smallest. Try fewer slices.",
    });
    expect(controller.canConfirmCutting()).toBe(false);
    expect(controller.getStage()).toBe("cutting");
    expect(view.setInteractionEnabled).toHaveBeenLastCalledWith(false);
    for (let step = 0; step < 3; step++) controller.stepDenominator(-1);
    expect(controller.getDenominator()).toBe(6);
    expect(controller.checkCutting().correct).toBe(true);
    controller.confirmCutting();
    expect(controller.getStage()).toBe("answering");
    expect(() => controller.checkCutting()).toThrow("Choose cuts before confirming");
  });

  // Begin addition with an empty answer plate using the common unit.
  it("initializes addition after confirming the cuts", () => {
    const order = createUnlikeDenominatorOrder("addition", 1, 3, 1, 4);
    const { controller, view, plate } = setup(order);

    beginAnswering(controller);

    expect(controller.getStage()).toBe("answering");
    expect(controller.getDenominator()).toBe(12);
    expect(controller.getSelectedSlices()).toBe(0);
    expect(plate.getSlicesOnPlate()).toBe(0);
    expect(controller.getCommonOrder()).toEqual({
      numerator: 7,
      denominator: 12,
      firstNumerator: 4,
      secondNumerator: 3,
      unlikeOrder: order,
    });
    expect(view.drawOrder).toHaveBeenLastCalledWith(12);
    expect(view.setInteractionEnabled).toHaveBeenLastCalledWith(true);
    expect(controller.canConfirmCutting()).toBe(false);
  });

  // Initialize subtraction with the converted first amount.
  it("starts subtraction with the correct number of tray slices", () => {
    const order = createUnlikeDenominatorOrder("subtraction", 3, 4, 1, 6);
    const { controller, plateController, view } = setup(order);

    beginAnswering(controller);

    expect(controller.getSelectedSlices()).toBe(9);
    expect(plateController.getSlicesOnPlate()).toBe(0);
    expect(controller.getCommonOrder()).toEqual({
      numerator: 7,
      denominator: 12,
      initialNumerator: 9,
      subtractNumerator: 2,
      unlikeOrder: order,
    });
    expect(view.drawOrder).toHaveBeenLastCalledWith(12, 9);
    expect(controller.checkAnswer().correct).toBe(false);
  });

  // Read addition answers from real drag operations.
  it("checks too few, correct, and too many addition slices", () => {
    const order = createUnlikeDenominatorOrder("addition", 1, 3, 1, 4);
    const { controller, plateController } = setup(order);
    beginAnswering(controller);

    placeSlices(plateController, 6);
    expect(controller.getSelectedSlices()).toBe(6);
    expect(controller.checkAnswer().correct).toBe(false);

    plateController.sliceDroppedOnPlate(6, 12);
    expect(controller.checkAnswer().correct).toBe(true);

    plateController.sliceDroppedOnPlate(7, 12);
    expect(controller.checkAnswer().correct).toBe(false);
  });

  // Check remaining slices rather than the number removed.
  it("checks subtraction and supports restoring a removed slice", () => {
    const order = createUnlikeDenominatorOrder("subtraction", 3, 4, 1, 6);
    const { controller, plateController } = setup(order);
    beginAnswering(controller);

    placeSlices(plateController, 2);
    expect(plateController.getSlicesOnPlate()).toBe(2);
    expect(controller.getSelectedSlices()).toBe(7);
    expect(controller.checkAnswer().correct).toBe(true);

    plateController.sliceDroppedOutside(0, 12);
    expect(controller.getSelectedSlices()).toBe(8);
    expect(controller.checkAnswer().correct).toBe(false);
  });

  // Apply locking and restoration rules to both operations.
  it.each(["addition", "subtraction"] as const)(
    "locks cutting until every moved %s slice is returned",
    operation => {
      const order = createUnlikeDenominatorOrder(operation, 1, 3, 1, 4);
      const { controller, plateController, view } = setup(order);
      beginAnswering(controller);
      placeSlices(plateController, 2);

      expect(controller.canStartCutting()).toBe(false);
      expect(() => controller.startCutting())
        .toThrow("Return all slices before changing cuts");

      controller.stepDenominator(-1);
      expect(controller.getDenominator()).toBe(12);
      expect(plateController.getSlicesOnPlate()).toBe(2);

      plateController.sliceDroppedOutside(0, 12);
      expect(controller.canStartCutting()).toBe(false);

      plateController.sliceDroppedOutside(1, 12);
      expect(controller.canStartCutting()).toBe(true);
      expect(controller.getStage()).toBe("answering");

      controller.startCutting();
      expect(controller.getStage()).toBe("cutting");
      expect(controller.getDenominator()).toBe(3);
      expect(controller.getOrder()).toEqual(order);
      expect(view.drawOrder).toHaveBeenLastCalledWith(3, 1);
      expect(view.setInteractionEnabled).toHaveBeenLastCalledWith(false);

      beginAnswering(controller);
      expect(controller.getSelectedSlices()).toBe(
        operation === "addition" ? 0 : 4,
      );
    },
  );

  // Reset can clear a partial answer without returning each slice manually.
  it.each(["addition", "subtraction"] as const)(
    "resets the same %s question and allows cutting again",
    operation => {
      const order = createUnlikeDenominatorOrder(operation, 1, 3, 1, 4);
      const { controller, plateController, view } = setup(order);
      beginAnswering(controller);
      placeSlices(plateController, 2);

      controller.resetOrder();

      expect(controller.getOrder()).toEqual(order);
      expect(controller.getStage()).toBe("cutting");
      expect(controller.getDenominator()).toBe(3);
      expect(view.drawOrder).toHaveBeenLastCalledWith(3, 1);
      expect(plateController.getSlicesOnPlate()).toBe(0);
      expect(controller.canStartCutting()).toBe(true);
      expect(view.setInteractionEnabled).toHaveBeenLastCalledWith(false);

      beginAnswering(controller);
      expect(controller.getSelectedSlices()).toBe(
        operation === "addition" ? 0 : 4,
      );
    },
  );

  // An empty tray must not unlock cutting while removed slices remain.
  it("accepts zero remaining slices while keeping cutting locked", () => {
    const order = createUnlikeDenominatorOrder("subtraction", 1, 2, 2, 4);
    const { controller, plateController } = setup(order);
    beginAnswering(controller);
    placeSlices(plateController, 2);

    expect(controller.getSelectedSlices()).toBe(0);
    expect(controller.checkAnswer().correct).toBe(true);
    expect(controller.canStartCutting()).toBe(false);
  });

  // Accept exactly one pizza through the actual plate state.
  it("accepts a whole-pizza addition answer", () => {
    const order = createUnlikeDenominatorOrder("addition", 1, 2, 2, 4);
    const { controller, plateController } = setup(order);
    beginAnswering(controller);
    placeSlices(plateController, 4);

    expect(controller.getSelectedSlices()).toBe(4);
    expect(controller.checkAnswer().correct).toBe(true);
  });

  // Some original fractions already use the common denominator.
  it("allows confirmation without extra cuts when already at the target", () => {
    const order = createUnlikeDenominatorOrder("subtraction", 3, 4, 1, 2);
    const { controller, plateController } = setup(order);

    expect(controller.canConfirmCutting()).toBe(true);
    controller.confirmCutting();
    placeSlices(plateController, 2);

    expect(controller.getSelectedSlices()).toBe(1);
    expect(controller.checkAnswer().correct).toBe(true);
  });

  // A new question discards the previous question's placements and mode.
  it("starts a new addition question after a partial subtraction answer", () => {
    const order = createUnlikeDenominatorOrder("subtraction", 3, 4, 1, 6);
    const { controller, plateController, view } = setup(order);
    beginAnswering(controller);
    placeSlices(plateController, 2);

    const next = createUnlikeDenominatorOrder("addition", 1, 2, 1, 3);
    controller.startOrder(next);

    expect(controller.getOrder()).toEqual(next);
    expect(controller.getStage()).toBe("cutting");
    expect(controller.getDenominator()).toBe(2);
    expect(plateController.getSlicesOnPlate()).toBe(0);
    expect(view.setSubtractionMode).toHaveBeenLastCalledWith(null);

    beginAnswering(controller);
    expect(controller.getSelectedSlices()).toBe(0);
    placeSlices(plateController, 5);
    expect(controller.checkAnswer().correct).toBe(true);
  });

  // Verify that expanded orders work with the actual shared cutting feature.
  it.each([
    ["addition", 1, 5, 1, 10],
    ["addition", 1, 2, 1, 8],
    ["addition", 1, 3, 1, 9],
    ["subtraction", 4, 5, 1, 10],
    ["subtraction", 3, 4, 1, 8],
    ["subtraction", 2, 3, 1, 9],
  ] as const)("cuts and checks %s for %i/%i and %i/%i", (operation, n1, d1, n2, d2) => {
    const order = createUnlikeDenominatorOrder(operation, n1, d1, n2, d2); // Expanded question.
    const { controller, plateController } = setup(order); // Real cutting and plate logic.
    beginAnswering(controller);
    placeSlices(plateController, operation === "addition"
      ? order.resultNumerator : order.convertedSecondNumerator);
    expect(controller.getDenominator()).toBe(order.commonDenominator);
    expect(controller.getSelectedSlices()).toBe(order.resultNumerator);
    expect(controller.checkAnswer().correct).toBe(true);
  });

  // Notify the page after cuts, confirmation, dragging, restoration, and reset.
  it("reports state changes using the updated plate state", () => {
    const order = createUnlikeDenominatorOrder("addition", 1, 3, 1, 4);
    const { controller, plateController } = setup(order);
    const updates: { stage: string | null; canCut: boolean }[] = [];

    controller.setOnStateChanged(() => {
      updates.push({
        stage: controller.getStage(), // Updated interaction stage.
        canCut: controller.canStartCutting(), // Updated cutting availability.
      });
    });

    controller.stepDenominator(1);
    expect(updates.at(-1)).toEqual({ stage: "cutting", canCut: true });

    beginAnswering(controller);
    expect(updates.at(-1)).toEqual({ stage: "answering", canCut: true });

    plateController.sliceDroppedOnPlate(0, 12);
    expect(updates.at(-1)).toEqual({ stage: "answering", canCut: false });

    plateController.sliceDroppedOutside(0, 12);
    expect(updates.at(-1)).toEqual({ stage: "answering", canCut: true });

    controller.resetOrder();
    expect(updates.at(-1)).toEqual({ stage: "cutting", canCut: true });
  });

  // Read the live denominator rather than assuming it stayed unchanged.
  it("rejects checking when shared plate units no longer match the order", () => {
    const order = createUnlikeDenominatorOrder("addition", 1, 3, 1, 4);
    const { controller, plate } = setup(order);
    beginAnswering(controller);

    plate.reset(6);

    expect(() => controller.checkAnswer())
      .toThrow("Slice denominator must match the common denominator");
  });
});
