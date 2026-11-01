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