import { describe, it, expect } from "vitest";
import { FeedbackModel } from "../src/features/feedback/FeedbackModel";
import { FeedbackController } from "../src/features/feedback/FeedbackController";
import { PizzaOrderModel } from "../src/features/pizza/PizzaOrderModel";
import { PizzaOrderController } from "../src/features/pizza/PizzaOrderController";

describe("FeedbackController", () => {

    it("should show correct feedback after the pizza controller accepts an answer", () => {
        const pizzaModel = new PizzaOrderModel({ numerator: 3, denominator: 8 });
        const pizzaController = new PizzaOrderController(pizzaModel);
        const controller = new FeedbackController(new FeedbackModel());

        pizzaController.selectSlice(3);
        const result = pizzaController.submitAnswer();
        const feedback = controller.showFeedback(pizzaModel.getOrder(), pizzaController.getSelectedSlices(), result);

        expect(feedback.type).toBe("correct");
        expect(feedback.pointsEarned).toBe(100);
    });

    it("should show try again feedback after the pizza controller rejects an answer", () => {
        const pizzaModel = new PizzaOrderModel({ numerator: 3, denominator: 8 });
        const pizzaController = new PizzaOrderController(pizzaModel);
        const controller = new FeedbackController(new FeedbackModel());

        pizzaController.selectSlice(1);
        const result = pizzaController.submitAnswer();
        const feedback = controller.showFeedback(pizzaModel.getOrder(), pizzaController.getSelectedSlices(), result);

        expect(feedback.type).toBe("tooFew");
        expect(feedback.actionLabel).toBe("Try Again");
    });

    it("should update the model when feedback is shown", () => {
        const pizzaModel = new PizzaOrderModel({ numerator: 3, denominator: 8 });
        const model = new FeedbackModel();
        const controller = new FeedbackController(model);

        pizzaModel.selectSlice(5);
        controller.showFeedback(pizzaModel.getOrder(), 5, pizzaModel.checkAnswer());

        expect(model.getCurrentFeedback()?.type).toBe("tooMany");
        expect(model.getIncorrectAttempts()).toBe(1);
    });

    it("should close the feedback but keep attempts when the student tries again", () => {
        const pizzaModel = new PizzaOrderModel({ numerator: 3, denominator: 8 });
        const controller = new FeedbackController(new FeedbackModel());

        pizzaModel.selectSlice(2);
        controller.showFeedback(pizzaModel.getOrder(), 2, pizzaModel.checkAnswer());
        controller.closeFeedback();

        expect(controller.getCurrentFeedback()).toBeNull();
        expect(controller.getIncorrectAttempts()).toBe(1);
    });

    it("should reset everything when a new order starts", () => {
        const pizzaModel = new PizzaOrderModel({ numerator: 3, denominator: 8 });
        const controller = new FeedbackController(new FeedbackModel());

        pizzaModel.selectSlice(2);
        controller.showFeedback(pizzaModel.getOrder(), 2, pizzaModel.checkAnswer());
        controller.startNewOrder();

        expect(controller.getCurrentFeedback()).toBeNull();
        expect(controller.getIncorrectAttempts()).toBe(0);
    });

    it("should report zero incorrect attempts when the first try is correct", () => {
        const pizzaModel = new PizzaOrderModel({ numerator: 3, denominator: 8 });
        const controller = new FeedbackController(new FeedbackModel());

        pizzaModel.selectSlice(3);
        controller.showFeedback(pizzaModel.getOrder(), 3, pizzaModel.checkAnswer());

        expect(controller.getIncorrectAttempts()).toBe(0);
    });
});