import { describe, it, expect } from "vitest";
import { PlateModel } from "../src/features/plate/PlateModel";

describe("PlateModel adding slices", () => {
    it("starts with no slices on the plate", () => {
        const model = new PlateModel(8);
        expect(model.getSlicesOnPlate()).toBe(0);
    });

    it("places slices into slots in order", () => {
        const model = new PlateModel(8);
        expect(model.placeSlice(5)).toBe(0);
        expect(model.placeSlice(2)).toBe(1);
        expect(model.getSlicesOnPlate()).toBe(2);
        expect(model.isOnPlate(5)).toBe(true);
        expect(model.isOnPlate(2)).toBe(true);
    });

    it("throws when the same slice is placed twice", () => {
        const model = new PlateModel(8);
        model.placeSlice(3);
        expect(() => model.placeSlice(3)).toThrow();
        expect(model.getSlicesOnPlate()).toBe(1);
    });

    it("throws when the plate is full", () => {
        const model = new PlateModel(2);
        model.placeSlice(0);
        model.placeSlice(1);
        expect(() => model.placeSlice(2)).toThrow();
    });
});

describe("PlateModel removing slices", () => {
    it("removes a slice and lowers the count", () => {
        const model = new PlateModel(8);
        model.placeSlice(4);
        model.placeSlice(6);
        model.removeSlice(4);
        expect(model.getSlicesOnPlate()).toBe(1);
        expect(model.isOnPlate(4)).toBe(false);
        expect(model.isOnPlate(6)).toBe(true);
    });

    it("reuses the freed slot for the next slice", () => {
        const model = new PlateModel(8);
        model.placeSlice(1); // slot 0
        model.placeSlice(2); // slot 1
        model.removeSlice(1);
        expect(model.placeSlice(7)).toBe(0);
    });

    it("throws when removing a slice that is not on the plate", () => {
        const model = new PlateModel(8);
        expect(() => model.removeSlice(3)).toThrow();
    });

    it("reset empties the plate", () => {
        const model = new PlateModel(8);
        model.placeSlice(0);
        model.placeSlice(1);
        model.reset(4);
        expect(model.getSlicesOnPlate()).toBe(0);
        expect(model.getDenominator()).toBe(4);
    });
});