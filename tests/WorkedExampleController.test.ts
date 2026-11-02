import { describe, it, expect } from "vitest";
import { WorkedExampleModel } from "../src/features/workedExamples/WorkedExampleModel";
import type { WorkedExample } from "../src/features/workedExamples/types";
import { WorkedExampleController } from "../src/features/workedExamples/WorkedExampleController";

// A 3-step addition example used by every test
const example: WorkedExample = {
    type: "Addition",
    steps: [
        { explanation: "The customer wants 2/8 plus 3/8.", pizzas: [{ numerator: 2, denominator: 8 }, { numerator: 3, denominator: 8 }] },
        { explanation: "Put all the slices on one pizza.", pizzas: [{ numerator: 5, denominator: 8 }] },
        { explanation: "Count the slices: 5 out of 8!", pizzas: [{ numerator: 5, denominator: 8 }] },
    ],
};

describe("WorkedExampleController", () => {

    //visibility status
    it("should be closed before the level starts", () => {
        const controller = new WorkedExampleController(new WorkedExampleModel(example));
        expect(controller.isVisible()).toBe(false);
    });

    it("should be open when the level starts", () => {
        const controller = new WorkedExampleController(new WorkedExampleModel(example));
        controller.openExample();
        expect(controller.isVisible()).toBe(true);
    });

    //step navigation
    it("should start on the first step", () => {
        const controller = new WorkedExampleController(new WorkedExampleModel(example));
        controller.openExample();
        expect(controller.getCurrentStep().explanation).toBe("The customer wants 2/8 plus 3/8.");
    });

    it("should be able to move to the next step", () => {
        const controller = new WorkedExampleController(new WorkedExampleModel(example));
        controller.openExample();
        controller.nextStep();
        expect(controller.getCurrentStep().explanation).toBe("Put all the slices on one pizza.");
    })

    it("should be able to move to the previous step", () => {
        const controller = new WorkedExampleController(new WorkedExampleModel(example));
        controller.openExample();
        controller.nextStep();
        controller.prevStep();
        expect(controller.getCurrentStep().explanation).toBe("The customer wants 2/8 plus 3/8.");
    })

    //done with example
    it("if on the last step the student can start the level", () => {
        const controller = new WorkedExampleController(new WorkedExampleModel(example));
        controller.openExample();
        controller.nextStep();
        controller.nextStep();
        expect(controller.canStartLevel()).toBe(true);
    })

    it("if on the not last step the student can't start the level", () => {
        const controller = new WorkedExampleController(new WorkedExampleModel(example));
        controller.openExample();
        controller.nextStep();
        expect(controller.canStartLevel()).toBe(false);
    })

    //close example
    it("should be able to close example", () => {
        const controller = new WorkedExampleController(new WorkedExampleModel(example));
        controller.openExample();
        controller.nextStep();
        controller.closeExample();
        expect(controller.isVisible()).toBe(false);
    })

})