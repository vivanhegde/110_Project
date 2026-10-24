import { describe, it, expect } from "vitest";
import { PizzaOrderModel } from "../src/features/pizza/PizzaOrderModel";

describe("PizzaOrderModel", () => {
    it("should accept a correct fraction answer", () => {
        const order = new PizzaOrderModel({ numerator: 3, denominator: 8 });
        order.selectSlice(3);
        const result = order.checkAnswer();
        expect(result.correct).toBe(true);
    });

    it("should reject an incorrect fraction answer", () => {
        const order = new PizzaOrderModel({ numerator: 3, denominator: 8 });
        order.selectSlice(5);
        const result = order.checkAnswer();
        expect(result.correct).toBe(false);
    });

    it("should reject an invalid number of slices selected if its more than available", () => {
        const order = new PizzaOrderModel({ numerator: 3, denominator: 8 });
        expect(() => order.selectSlice(9)).toThrow("Invalid slice selection");
    });

    it("should accept zero slices selected if the order is for a zero fraction", () => {
        const order = new PizzaOrderModel({ numerator: 0, denominator: 8 });
        order.selectSlice(0);
        const result = order.checkAnswer();
        expect(result.correct).toBe(true);
    });

    it("should reject negative slices selected", () => {
        const order = new PizzaOrderModel({ numerator: 3, denominator: 8 });
        expect(() => order.selectSlice(-1)).toThrow("Invalid slice selection");
    });

    it("should reject non-integer slices selected", () => {
        const order = new PizzaOrderModel({ numerator: 3, denominator: 8 });
        expect(() => order.selectSlice(2.5)).toThrow("Invalid slice selection");
    });

    it("should reject a zero denominator in the order", () => {
        expect(() => new PizzaOrderModel({ numerator: 3, denominator: 0 })).toThrow("Invalid pizza order");
    });

    it("should reject a negative denominator in the order", () => {
        expect(() => new PizzaOrderModel({ numerator: 3, denominator: -8 })).toThrow("Invalid pizza order");
    });

    it("should accept all slices when the order is for a whole pizza", () => {
        const order = new PizzaOrderModel({ numerator: 8, denominator: 8});
        order.selectSlice(8);
        expect(order.checkAnswer().correct).toBe(true);
    });

    it("should update the selected slices when a new selection is made", () => {
        const order = new PizzaOrderModel({ numerator: 3, denominator: 8});
        
        order.selectSlice(5);
        expect(order.checkAnswer().correct).toBe(false);

        order.selectSlice(3);
        expect(order.checkAnswer().correct).toBe(true);
    });
});