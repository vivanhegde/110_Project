// @vitest-environment jsdom

import { describe, it, expect } from "vitest";
import { FeedbackView } from "../src/features/feedback/FeedbackView";
import { FeedbackModel } from "../src/features/feedback/FeedbackModel";
import { PizzaOrderModel } from "../src/features/pizza/PizzaOrderModel";
import { SubtractionOrderModel } from "../src/features/pizza/SubtractionOrderModel";
import { createSubtractionOrder } from "../src/features/pizza/CreateSubtractionOrder";

function getText(container: HTMLElement, selector: string): string {
    const element = container.querySelector(selector) as HTMLElement;
    return element.textContent as string;
}

describe("FeedbackView", () => {

    it("should start hidden", () => {
        const panel = document.createElement("div");
        new FeedbackView(panel);
        expect(panel.hidden).toBe(true);
    });

    it("should show the title, message, and Next Order for a correct addition order", () => {
        const order = new PizzaOrderModel({ numerator: 5, denominator: 8 });
        order.selectSlice(5);
        const feedback = new FeedbackModel().createFeedback(order.getOrder(), 5, order.checkAnswer());

        const panel = document.createElement("div");
        const view = new FeedbackView(panel);
        view.show(feedback, order.getOrder(), function () {});

        expect(panel.hidden).toBe(false);
        expect(panel.dataset.result).toBe("correct");
        expect(getText(panel, ".feedback-title")).toBe("Perfect pizza, chef!");
        expect(getText(panel, ".feedback-message")).toBe("You made 5/8. That's just right! +100 points");
        expect(getText(panel, ".feedback-equation")).toBe("5/8");
        expect(getText(panel, ".feedback-action")).toBe("Next Order");
    });

    it("should show the full equation for a correct subtraction order", () => {
        const model = new SubtractionOrderModel(createSubtractionOrder(6, 2, 8));
        model.removeSlice();
        model.removeSlice();
        const feedback = new FeedbackModel().createFeedback(model.getOrder(), model.getSelectedSlices(), model.checkAnswer());

        const panel = document.createElement("div");
        const view = new FeedbackView(panel);
        view.show(feedback, model.getOrder(), function () {});

        expect(getText(panel, ".feedback-equation")).toBe("6/8 − 2/8 = 4/8");
    });

    it("should show Try Again and no equation for an incorrect order", () => {
        const order = new PizzaOrderModel({ numerator: 5, denominator: 8 });
        order.selectSlice(4);
        const feedback = new FeedbackModel().createFeedback(order.getOrder(), 4, order.checkAnswer());

        const panel = document.createElement("div");
        const view = new FeedbackView(panel);
        view.show(feedback, order.getOrder(), function () {});

        expect(panel.dataset.result).toBe("tooFew");
        expect(getText(panel, ".feedback-title")).toBe("A little more pizza, please!");
        expect(getText(panel, ".feedback-message")).toContain("Add 1 more slice");
        expect(getText(panel, ".feedback-action")).toBe("Try Again");
        expect(panel.querySelector(".feedback-equation")).toBeNull();
    });

    it("should replace the old feedback instead of adding a second one", () => {
        const order = new PizzaOrderModel({ numerator: 5, denominator: 8 });
        const model = new FeedbackModel();
        const panel = document.createElement("div");
        const view = new FeedbackView(panel);

        order.selectSlice(4);
        view.show(model.createFeedback(order.getOrder(), 4, order.checkAnswer()), order.getOrder(), function () {});
        order.selectSlice(5);
        view.show(model.createFeedback(order.getOrder(), 5, order.checkAnswer()), order.getOrder(), function () {});

        expect(panel.querySelectorAll(".feedback-title").length).toBe(1);
        expect(getText(panel, ".feedback-title")).toBe("Perfect pizza, chef!");
    });

    it("should call onAction when the button is pressed", () => {
        const order = new PizzaOrderModel({ numerator: 5, denominator: 8 });
        order.selectSlice(5);
        const feedback = new FeedbackModel().createFeedback(order.getOrder(), 5, order.checkAnswer());

        const panel = document.createElement("div");
        const view = new FeedbackView(panel);

        let clicks = 0;
        view.show(feedback, order.getOrder(), function () {
            clicks = clicks + 1;
        });
        const button = panel.querySelector(".feedback-action") as HTMLButtonElement;
        button.click();

        expect(clicks).toBe(1);
    });

    it("should hide and clear the feedback box", () => {
        const order = new PizzaOrderModel({ numerator: 5, denominator: 8 });
        order.selectSlice(5);
        const feedback = new FeedbackModel().createFeedback(order.getOrder(), 5, order.checkAnswer());

        const panel = document.createElement("div");
        const view = new FeedbackView(panel);
        view.show(feedback, order.getOrder(), function () {});
        view.hide();

        expect(panel.hidden).toBe(true);
        expect(panel.children.length).toBe(0);
    });
});