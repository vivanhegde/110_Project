import { WorkedExampleModel } from "./WorkedExampleModel";
import type { ExampleStep } from "./types";

export class WorkedExampleController {
    private model: WorkedExampleModel;
    private visible = false;

    public constructor(model: WorkedExampleModel) {
        this.model = model;
    }

    //called before a level starts, or when the student presses "show example"
    public openExample(): void {
        this.model.restart();
        this.visible = true;
    }

    //closes current example
    public closeExample(): void {
        this.visible = false;
    }

    //returns whether this example is open or not
    public isVisible(): boolean {
        return this.visible;
    }

    //moves to the next step
    public nextStep(): void {
        this.model.nextStep();
    }

    // moves to the previous step
    public prevStep(): void {
        this.model.prevStep();
    }

    //returns the current step
    public getCurrentStep(): ExampleStep {
        return this.model.getCurrentStep();
    }

    //returns if level can start (needs to be on last step)
    public canStartLevel(): boolean {
        return this.model.isLastStep();
    }

}