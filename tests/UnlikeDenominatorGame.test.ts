// Use a DOM while keeping real order and plate logic.
// @vitest-environment jsdom
import { beforeEach, afterEach, describe, expect, it, vi } from "vitest";
import { PlateView } from "../src/features/plate/PlateView";
import type { PlateController } from "../src/features/plate/PlateController";
import { createUnlikeDenominatorOrder } from "../src/features/pizza/CreateUnlikeDenominatorOrder";
import { generateUnlikeDenominatorOrder } from "../src/features/pizza/GenerateUnlikeDenominatorOrder";
import { startUnlikeDenominatorGame } from "../src/features/pizza/UnlikeDenominatorGame";

// Replace only canvas drawing; retain actual movement handling.
vi.mock("../src/features/plate/PlateView", () => ({
  PlateView: vi.fn(class {
    controller!: PlateController; // Real shared drag controller.
    setController(controller: PlateController) { this.controller = controller; }
    setSubtractionMode = vi.fn();
    setInteractionEnabled = vi.fn();
    drawOrder = vi.fn();
    showFraction = vi.fn();
    showTrayText = vi.fn();
    snapToPlateSlot = vi.fn();
    snapToTraySlot = vi.fn();
  }),
}));

// Supply deterministic questions for page transitions.
vi.mock("../src/features/pizza/GenerateUnlikeDenominatorOrder", () => ({
  generateUnlikeDenominatorOrder: vi.fn(),
}));

let root: HTMLElement; // Mounted practice page.
const originalScroll = Object.getOwnPropertyDescriptor(HTMLElement.prototype, "scrollIntoView"); // DOM method snapshot.

// Read page controls and displayed values.
function node<T extends HTMLElement = HTMLElement>(id: string): T {
  return root.querySelector<T>(`#${id}`)!;
}
function click(id: string): void { node<HTMLButtonElement>(id).click(); }
function dragController(): PlateController {
  return (vi.mocked(PlateView).mock.instances.at(-1) as unknown as {
    controller: PlateController;
  }).controller;
}

// Move from thirds through the real US10 sequence to twelfths.
function confirmCuts(): void {
  click("more-cuts");
  click("more-cuts");
  click("more-cuts");
  click("confirm-cuts");
}

beforeEach(() => {
  vi.clearAllMocks();
  Object.defineProperty(HTMLElement.prototype, "scrollIntoView", {
    configurable: true, value: vi.fn(), // Supply the missing browser method.
  });
  vi.mocked(generateUnlikeDenominatorOrder).mockReturnValue(
    createUnlikeDenominatorOrder("addition", 1, 3, 1, 4),
  );
  document.body.innerHTML = '<div id="app"></div>';
  root = document.getElementById("app")!;
});

afterEach(() => {
  vi.restoreAllMocks();
  if (originalScroll) Object.defineProperty(HTMLElement.prototype, "scrollIntoView", originalScroll);
  else Reflect.deleteProperty(HTMLElement.prototype, "scrollIntoView");
});

describe("UnlikeDenominatorGame", () => {
  // Block answering until both fractions use the least common denominator.
  it("connects cutting controls and keeps fraction conversion in the text hint", () => {
    startUnlikeDenominatorGame(root);
    expect(node("order-equation").textContent).toBe("1/3 + 1/4 = ?");
    expect(node<HTMLButtonElement>("confirm-cuts").disabled).toBe(false);
    expect(node<HTMLButtonElement>("check-order").disabled).toBe(true);
    click("confirm-cuts");
    expect(node("cut-feedback").hidden).toBe(false);
    expect(node("cut-feedback").textContent).toContain("3 is not a common denominator");
    expect(node("stage-title").textContent).toBe("Choose your cuts");
    click("more-cuts");
    expect(node("cut-status").textContent).toContain("6");
    expect(node("cut-feedback").hidden).toBe(true);
    expect(node<HTMLButtonElement>("confirm-cuts").disabled).toBe(false);
    click("confirm-cuts");
    expect(node("cut-feedback").textContent).toContain("6 is not a common denominator");
    expect(node<HTMLButtonElement>("check-order").disabled).toBe(true);
    click("more-cuts");
    click("more-cuts");
    expect(node("hint-conversion").textContent).toContain("1/3 = 4/12");
    expect(node("hint-conversion").textContent).toContain("1/4 = 3/12");
    expect(node<HTMLButtonElement>("confirm-cuts").disabled).toBe(false);
    click("confirm-cuts");
    expect(node("live-fraction").textContent).toBe("On your plate: 0/12");
    expect(node("cut-feedback").hidden).toBe(true);
    expect(node<HTMLButtonElement>("check-order").disabled).toBe(false);
  });

  // Distinguish a usable common denominator from the least common denominator.
  it("hints at fewer slices for a nonminimal common denominator", () => {
    vi.mocked(generateUnlikeDenominatorOrder).mockReturnValue(
      createUnlikeDenominatorOrder("addition", 1, 2, 1, 3),
    );
    startUnlikeDenominatorGame(root);
    // Reach twelve through the shared cutting controls.
    for (let step = 0; step < 5; step++) click("more-cuts");
    expect(dragController().getDenominator()).toBe(12);
    expect(node<HTMLButtonElement>("confirm-cuts").disabled).toBe(false);
    click("confirm-cuts");
    expect(node("cut-feedback").textContent).toContain("12 is a common denominator, but it is not the smallest");
    expect(node("stage-title").textContent).toBe("Choose your cuts");
    expect(node<HTMLButtonElement>("check-order").disabled).toBe(true);
    click("hint-button");
    expect(node("cut-feedback").hidden).toBe(false);
    click("reset-order");
    expect(node("cut-feedback").hidden).toBe(true);
    expect(node("cut-feedback").textContent).toBe("");
    click("more-cuts");
    click("more-cuts");
    click("confirm-cuts");
    expect(node("stage-title").textContent).toBe("Complete the order");
    expect(node("live-fraction").textContent).toBe("On your plate: 0/6");
  });

  // Preserve actual slices through feedback, hints, and retry.
  it("keeps an incorrect answer intact and shows conversion help after two attempts", () => {
    startUnlikeDenominatorGame(root);
    confirmCuts();
    dragController().sliceDroppedOnPlate(0, 12);
    click("check-order");
    expect(node("order-feedback").hidden).toBe(false);
    expect(node<HTMLButtonElement>("change-cuts").disabled).toBe(true);
    click("feedback-action");
    expect(node("order-feedback").hidden).toBe(true);
    expect(node("live-fraction").textContent).toBe("On your plate: 1/12");
    click("check-order");
    expect(node("conversion-hint").hidden).toBe(false);
    expect(node("hint-conversion").textContent).toContain("1/3 = 4/12");
    expect(node("live-fraction").textContent).toBe("On your plate: 1/12");
  });

  // Restore cutting only after every moved slice has returned.
  it("locks cuts during placement and resets the same question", () => {
    startUnlikeDenominatorGame(root);
    confirmCuts();
    const plate = dragController(); // Actual placement state.
    plate.sliceDroppedOnPlate(0, 12);
    plate.sliceDroppedOnPlate(1, 12);
    expect(node<HTMLButtonElement>("change-cuts").disabled).toBe(true);
    plate.sliceDroppedOutside(0, 12);
    expect(node<HTMLButtonElement>("change-cuts").disabled).toBe(true);
    plate.sliceDroppedOutside(1, 12);
    expect(node<HTMLButtonElement>("change-cuts").disabled).toBe(false);
    click("change-cuts");
    expect(node("stage-title").textContent).toBe("Choose your cuts");
    confirmCuts();
    plate.sliceDroppedOnPlate(0, 12);
    click("reset-order");
    expect(plate.getSlicesOnPlate()).toBe(0);
    expect(node("order-equation").textContent).toBe("1/3 + 1/4 = ?");
    expect(node("stage-title").textContent).toBe("Choose your cuts");
    expect(generateUnlikeDenominatorOrder).toHaveBeenCalledTimes(1);
  });

  // Generate a new question only when the completed order is continued.
  it("checks the live answer and starts the next order with clean state", () => {
    startUnlikeDenominatorGame(root);
    confirmCuts();
    const plate = dragController(); // Real drag handler.
    for (let index = 0; index < 7; index++) plate.sliceDroppedOnPlate(index, 12);
    click("check-order");
    expect(node("order-feedback").dataset.result).toBe("correct");
    expect(node("solved-equation").textContent).toBe("1/3 + 1/4 = 7/12");
    vi.mocked(generateUnlikeDenominatorOrder).mockReturnValue(
      createUnlikeDenominatorOrder("subtraction", 3, 4, 1, 6),
    );
    click("feedback-action");
    expect(node("order-equation").textContent).toBe("3/4 − 1/6 = ?");
    expect(node("order-feedback").hidden).toBe(true);
    expect(plate.getSlicesOnPlate()).toBe(0);
    expect(node("stage-title").textContent).toBe("Choose your cuts");
  });

  // Count remaining slices and restore them through the shared subtraction flow.
  it("checks subtraction and lets students restore removed slices", () => {
    vi.mocked(generateUnlikeDenominatorOrder).mockReturnValue(
      createUnlikeDenominatorOrder("subtraction", 3, 4, 1, 2),
    );
    startUnlikeDenominatorGame(root);
    click("confirm-cuts");
    const plate = dragController(); // Real subtraction handler.
    plate.sliceDroppedOnPlate(0, 4);
    expect(node("live-fraction").textContent).toBe("Slices left: 2/4");
    plate.sliceDroppedOutside(0, 4);
    expect(node("live-fraction").textContent).toBe("Slices left: 3/4");
    plate.sliceDroppedOnPlate(0, 4);
    plate.sliceDroppedOnPlate(1, 4);
    click("hint-button");
    expect(node("conversion-hint").hidden).toBe(false);
    expect(plate.getRemainingSlices()).toBe(1);
    click("check-order");
    expect(node("order-feedback").dataset.result).toBe("correct");
    expect(node("solved-equation").hidden).toBe(false);
  });
});
