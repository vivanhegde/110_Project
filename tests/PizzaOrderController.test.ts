import { describe, it, expect } from "vitest";
import { PizzaOrderModel } from "../src/features/pizza/PizzaOrderModel";
import { PizzaOrderController } from "../src/features/pizza/PizzaOrderController";


describe("PizzaOrderController", () => {

    it("should update the model when slices are selected", () => {
        const model = new PizzaOrderModel({ numerator: 3, denominator: 8 });
        const controller = new PizzaOrderController(model);
        controller.selectSlice(3);
        expect(model.getSelectedSlices()).toBe(3);
    });    

    it("should return the correct result when the answer matches", () => {
        const model = new PizzaOrderModel({ numerator: 3, denominator: 8 });
        const controller = new PizzaOrderController(model);
        controller.selectSlice(3);
        const result = controller.submitAnswer();
        expect(result.correct).toBe(true);
    });

    it("should an incorrect result when the answer does not match", () => {
        const model = new PizzaOrderModel({ numerator: 3, denominator: 8 });
        const controller = new PizzaOrderController(model);
        controller.selectSlice(2);
        const result = controller.submitAnswer();
        expect(result.correct).toBe(false);
    });

    it("should use the most recent slice selection when checking the answer", () => {
        const model = new PizzaOrderModel({ numerator: 3, denominator: 8 });
        const controller = new PizzaOrderController(model);

        controller.selectSlice(2);
        expect(controller.submitAnswer().correct).toBe(false);

        controller.selectSlice(3);
        expect(controller.submitAnswer().correct).toBe(true);
    });

    it("should reject invalid slice selections", () => {
        const model = new PizzaOrderModel({ numerator: 3, denominator: 8 });
        const controller = new PizzaOrderController(model);

        expect(() => controller.selectSlice(-1)).toThrow("Invalid slice selection");
        expect(() => controller.selectSlice(9)).toThrow("Invalid slice selection");
        expect(() => controller.selectSlice(2.5)).toThrow("Invalid slice selection");
    });
});