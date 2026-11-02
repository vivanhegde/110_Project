import { describe, it, expect } from "vitest";
import { WorkedExampleModel } from "../src/features/workedExamples/WorkedExampleModel";
import type { WorkedExample } from "../src/features/workedExamples/types";

// A 3-step addition example used by every test
const example: WorkedExample = {
    type: "Addition",
    steps: [
        { explanation: "The customer wants 2/8 plus 3/8.", pizzas: [{ numerator: 2, denominator: 8 }, { numerator: 3, denominator: 8 }] },
        { explanation: "Put all the slices on one pizza.", pizzas: [{ numerator: 5, denominator: 8 }] },
        { explanation: "Count the slices: 5 out of 8!", pizzas: [{ numerator: 5, denominator: 8 }] },
    ],
};

const emptyExample: WorkedExample = {
    type: "Subtraction",
    steps: [],
};

describe("WorkedExampleModel", () => {
    it("should start on the first step", () => {
        const model = new WorkedExampleModel(example);
        expect(model.getCurrentStep().explanation).toBe("The customer wants 2/8 plus 3/8.");
    });

    it("should move to the next step", () => {
        const model = new WorkedExampleModel(example);
        model.nextStep();
        expect(model.getCurrentStep().explanation).toBe("Put all the slices on one pizza.");
    });

    it("should not go past the last step", () => {
        const model = new WorkedExampleModel(example);
        model.nextStep();
        model.nextStep();
        model.nextStep();
        model.nextStep();
        expect(model.getCurrentStep().explanation).toBe("Count the slices: 5 out of 8!");
        expect(model.isLastStep()).toBe(true);
    });

    it("should go back to the previous step", () => {
        const model = new WorkedExampleModel(example);
        model.nextStep();
        model.prevStep();
        expect(model.getCurrentStep().explanation).toBe("The customer wants 2/8 plus 3/8.");
    });

    it("should not go before the first step", () => {
        const model = new WorkedExampleModel(example);
        model.prevStep();
        model.prevStep();
        model.prevStep();
        expect(model.getCurrentStep().explanation).toBe("The customer wants 2/8 plus 3/8.");
    });

    it("should know when it is on the last step", () => {
        const model = new WorkedExampleModel(example);
        model.nextStep();
        expect(model.isLastStep()).toBe(false);
        model.nextStep();
        expect(model.isLastStep()).toBe(true);
    });

    it("should go back to the first step on restart", () => {
        const model = new WorkedExampleModel(example);
        model.nextStep();
        model.restart();
        expect(model.getCurrentStep().explanation).toBe("The customer wants 2/8 plus 3/8.");
    });

    it("should throw an error if the example has no steps", () => {
        expect(() => new WorkedExampleModel(emptyExample)).toThrow("Example needs at least one step.")
    });
});