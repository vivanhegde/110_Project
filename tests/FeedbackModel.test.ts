import { describe, it, expect } from "vitest";
import { FeedbackModel } from "../src/features/feedback/FeedbackModel";
import { PizzaOrderModel } from "../src/features/pizza/PizzaOrderModel";

describe("FeedbackModel", () => {
    it("should give correct feedback with 100 points when the answer matches", () => {
        const order = new PizzaOrderModel({ numerator: 5, denominator: 8 });
        const feedback = new FeedbackModel();
        order.selectSlice(5);
        const result = feedback.createFeedback(order.getOrder(), 5, order.checkAnswer());

        expect(result.type).toBe("correct");
        expect(result.pointsEarned).toBe(100);
        expect(result.actionLabel).toBe("Next Order");
        expect(result.message).toBe("You made 5/8. That's just right! +100 points");
    });

    it("should use a custom points value for a correct answer", () => {
        const order = new PizzaOrderModel({ numerator: 3, denominator: 4 });
        const feedback = new FeedbackModel(50);
        order.selectSlice(3);
        const result = feedback.createFeedback(order.getOrder(), 3, order.checkAnswer());

        expect(result.pointsEarned).toBe(50);
        expect(result.message).toContain("+50 points");
    });

    it("should tell the student to add slices when there are too few", () => {
        const order = new PizzaOrderModel({ numerator: 5, denominator: 8 });
        const feedback = new FeedbackModel();
        order.selectSlice(4);
        const result = feedback.createFeedback(order.getOrder(), 4, order.checkAnswer());

        expect(result.type).toBe("tooFew");
        expect(result.pointsEarned).toBe(0);
        expect(result.actionLabel).toBe("Try Again");
        expect(result.message).toBe("Not quite — you made 4/8. The order needs 5/8. Add 1 more slice. Your score stays the same.");
    });

    it("should tell the student to take away slices when there are too many", () => {
        const order = new PizzaOrderModel({ numerator: 5, denominator: 8 });
        const feedback = new FeedbackModel();
        order.selectSlice(7);
        const result = feedback.createFeedback(order.getOrder(), 7, order.checkAnswer());

        expect(result.type).toBe("tooMany");
        expect(result.pointsEarned).toBe(0);
        expect(result.actionLabel).toBe("Try Again");
        expect(result.message).toContain("Take away 2 slices");
    });

    it("should use 'slice' for one and 'slices' for more than one", () => {
        const order = new PizzaOrderModel({ numerator: 5, denominator: 8 });
        const feedback = new FeedbackModel();

        order.selectSlice(4);
        expect(feedback.createFeedback(order.getOrder(), 4, order.checkAnswer()).message).toContain("Add 1 more slice.");

        order.selectSlice(2);
        expect(feedback.createFeedback(order.getOrder(), 2, order.checkAnswer()).message).toContain("Add 3 more slices.");
    });

    it("should treat any slices on a zero order as too many", () => {
        const order = new PizzaOrderModel({ numerator: 0, denominator: 8 });
        const feedback = new FeedbackModel();
        order.selectSlice(1);
        const result = feedback.createFeedback(order.getOrder(), 1, order.checkAnswer());

        expect(result.type).toBe("tooMany");
        expect(result.message).toContain("Take away 1 slice.");
    });

    it("should count incorrect attempts but not correct ones", () => {
        const order = new PizzaOrderModel({ numerator: 3, denominator: 8 });
        const feedback = new FeedbackModel();

        order.selectSlice(2);
        feedback.createFeedback(order.getOrder(), 2, order.checkAnswer());
        order.selectSlice(5);
        feedback.createFeedback(order.getOrder(), 5, order.checkAnswer());
        expect(feedback.getIncorrectAttempts()).toBe(2);

        order.selectSlice(3);
        feedback.createFeedback(order.getOrder(), 3, order.checkAnswer());
        expect(feedback.getIncorrectAttempts()).toBe(2);
    });

    it("should have no current feedback before an answer is checked", () => {
        const feedback = new FeedbackModel();
        expect(feedback.getCurrentFeedback()).toBeNull();
        expect(feedback.getIncorrectAttempts()).toBe(0);
    });

    it("should store the most recent feedback as the current feedback", () => {
        const order = new PizzaOrderModel({ numerator: 3, denominator: 8 });
        const feedback = new FeedbackModel();
        order.selectSlice(2);
        const result = feedback.createFeedback(order.getOrder(), 2, order.checkAnswer());

        expect(feedback.getCurrentFeedback()).toEqual(result);
    });

    it("should clear the current feedback but keep the attempt count", () => {
        const order = new PizzaOrderModel({ numerator: 3, denominator: 8 });
        const feedback = new FeedbackModel();
        order.selectSlice(2);
        feedback.createFeedback(order.getOrder(), 2, order.checkAnswer());

        feedback.clearFeedback();
        expect(feedback.getCurrentFeedback()).toBeNull();
        expect(feedback.getIncorrectAttempts()).toBe(1);
    });

    it("should reset the feedback and attempt count for a new order", () => {
        const order = new PizzaOrderModel({ numerator: 3, denominator: 8 });
        const feedback = new FeedbackModel();
        order.selectSlice(2);
        feedback.createFeedback(order.getOrder(), 2, order.checkAnswer());

        feedback.reset();
        expect(feedback.getCurrentFeedback()).toBeNull();
        expect(feedback.getIncorrectAttempts()).toBe(0);
    });

    it("should reject invalid points values", () => {
        expect(() => new FeedbackModel(-10)).toThrow("Invalid points value");
        expect(() => new FeedbackModel(2.5)).toThrow("Invalid points value");
    });
});