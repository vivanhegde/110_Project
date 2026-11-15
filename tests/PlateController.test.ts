import { describe, it, expect, vi } from "vitest";
import { PlateModel } from "../src/features/plate/PlateModel";
import { PlateController } from "../src/features/plate/PlateController";
import type { PlateView } from "../src/features/plate/PlateView";

// Stand-in for PlateView so the tests run without Konva or a canvas.
// Each method records how it was called.
function makeFakeView() {
    return {
        drawOrder: vi.fn(),
        showFraction: vi.fn(),
        showTrayText: vi.fn(),
        snapToPlateSlot: vi.fn(),
        snapToTraySlot: vi.fn(),
        setController: vi.fn(),
    };
}

function setup(denominator: number) {
    const model = new PlateModel(denominator);
    const view = makeFakeView();
    const controller = new PlateController();
    controller.setModel(model);
    controller.setView(view as unknown as PlateView);
    controller.startOrder(denominator);
    return { model, view, controller };
}

describe("PlateController dropping slices on the plate", () => {
    it("places the slice and snaps it to the first plate slot", () => {
        const { model, view, controller } = setup(8);
        controller.sliceDroppedOnPlate(3, 8);
        expect(model.isOnPlate(3)).toBe(true);
        expect(view.snapToPlateSlot).toHaveBeenCalledWith(3, 0, 8);
    });

    it("updates the fraction after the drop", () => {
        const { view, controller } = setup(8);
        controller.sliceDroppedOnPlate(3, 8);
        controller.sliceDroppedOnPlate(5, 8);
        expect(view.showFraction).toHaveBeenLastCalledWith(2, 8);
    });

    it("does not double count a slice moved around on the plate", () => {
        const { controller, view } = setup(8);
        controller.sliceDroppedOnPlate(3, 8);
        controller.sliceDroppedOnPlate(3, 8);
        expect(controller.getSlicesOnPlate()).toBe(1);
        expect(view.snapToPlateSlot).toHaveBeenLastCalledWith(3, 0, 8);
    });
});

describe("PlateController dropping slices outside the plate", () => {
    it("removes a plated slice and snaps it back to its tray slot", () => {
        const { model, view, controller } = setup(8);
        controller.sliceDroppedOnPlate(3, 8);
        controller.sliceDroppedOutside(3, 8);
        expect(model.isOnPlate(3)).toBe(false);
        expect(view.snapToTraySlot).toHaveBeenCalledWith(3, 3, 8);
        expect(view.showFraction).toHaveBeenLastCalledWith(0, 8);
    });

    it("returns a tray slice to the tray without changing the count", () => {
        const { view, controller } = setup(8);
        controller.sliceDroppedOutside(4, 8);
        expect(controller.getSlicesOnPlate()).toBe(0);
        expect(view.snapToTraySlot).toHaveBeenCalledWith(4, 4, 8);
    });
});

describe("PlateController starting an order", () => {
    it("resets the plate when a new order begins", () => {
        const { controller } = setup(8);
        controller.sliceDroppedOnPlate(1, 8);
        controller.sliceDroppedOnPlate(2, 8);
        controller.startOrder(6);
        expect(controller.getSlicesOnPlate()).toBe(0);
    });
});

// Starts a cutting order: show 3/4 of a pizza using eighths.
function setupCutting() {
    const model = new PlateModel(4);
    const view = makeFakeView();
    const controller = new PlateController();
    controller.setModel(model);
    controller.setView(view as unknown as PlateView);
    controller.startCuttingOrder({ numerator: 3, denominator: 4, targetDenominator: 8 });
    return { model, view, controller };
}

// Puts the first `count` tray slices on the plate.
function placeSlices(controller: PlateController, count: number) {
    const denominator = controller.getDenominator();
    for (let sliceId = 0; sliceId < count; sliceId++) {
        controller.sliceDroppedOnPlate(sliceId, denominator);
    }
}

describe("PlateController cutting orders", () => {
    it("starts at the order's denominator with an empty plate", () => {
        const { controller, view } = setupCutting();
        expect(controller.getDenominator()).toBe(4);
        expect(controller.getSlicesOnPlate()).toBe(0);
        expect(view.drawOrder).toHaveBeenLastCalledWith(4);
    });

    it("throws when the target denominator cannot show the fraction", () => {
        const controller = new PlateController();
        controller.setModel(new PlateModel(4));
        controller.setView(makeFakeView() as unknown as PlateView);
        expect(() =>
            controller.startCuttingOrder({ numerator: 3, denominator: 4, targetDenominator: 6 })
        ).toThrow();
    });

    it("cuts into smaller slices one valid denominator at a time", () => {
        const { controller } = setupCutting();
        controller.stepDenominator(1);
        expect(controller.getDenominator()).toBe(8);
        controller.stepDenominator(1);
        expect(controller.getDenominator()).toBe(12);
    });

    it("does not cut past the largest or smallest valid denominator", () => {
        const { controller } = setupCutting();
        expect(controller.canStepDenominator(-1)).toBe(false);
        controller.stepDenominator(-1);
        expect(controller.getDenominator()).toBe(4);

        controller.stepDenominator(1);
        controller.stepDenominator(1);
        expect(controller.canStepDenominator(1)).toBe(false);
        controller.stepDenominator(1);
        expect(controller.getDenominator()).toBe(12);
    });

    it("returns every slice to the tray when the pizza is cut", () => {
        const { controller, view } = setupCutting();
        placeSlices(controller, 2);
        controller.stepDenominator(1);
        expect(controller.getSlicesOnPlate()).toBe(0);
        expect(view.drawOrder).toHaveBeenLastCalledWith(8);
    });

    it("notifies the page after a cut", () => {
        const { controller } = setupCutting();
        const onChanged = vi.fn();
        controller.setOnSliceCountChanged(onChanged);
        controller.stepDenominator(1);
        expect(onChanged).toHaveBeenCalledTimes(1);
    });

    it("accepts the right amount using the target denominator", () => {
        const { controller } = setupCutting();
        controller.stepDenominator(1);   // eighths
        placeSlices(controller, 6);
        expect(controller.isAnswerValid()).toBe(true);
    });

    it("rejects the wrong amount using the target denominator", () => {
        const { controller } = setupCutting();
        controller.stepDenominator(1);   // eighths
        placeSlices(controller, 5);
        expect(controller.isAnswerValid()).toBe(false);
    });

    it("rejects the right amount using a different denominator", () => {
        const { controller } = setupCutting();
        placeSlices(controller, 3);      // 3/4, not cut
        expect(controller.isAnswerValid()).toBe(false);

        controller.stepDenominator(1);
        controller.stepDenominator(1);   // twelfths
        placeSlices(controller, 9);      // 9/12
        expect(controller.isAnswerValid()).toBe(false);
    });

    it("ends the cutting order when a normal order starts", () => {
        const { controller } = setupCutting();
        controller.startOrder(8);
        expect(controller.canStepDenominator(1)).toBe(false);
        expect(controller.isAnswerValid()).toBe(false);
    });
});