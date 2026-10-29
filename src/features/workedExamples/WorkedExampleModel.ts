import { ExampleStep, WorkedExample } from "./types";

export class WorkedExampleModel {
    private example: WorkedExample;
    private stepNum: number = 0;

    constructor( example: WorkedExample ){
        if(example.steps.length === 0){
            throw new Error("Example needs at least one step.");
        }
        this.example = example;
    }

    //returns the current step (which has the explanation and pizza order)
    public getCurrentStep(): ExampleStep { 
        return this.example.steps[this.stepNum];
    }

    //moves to the next step
    public nextStep(): void {
        if(this.stepNum + 1 < this.example.steps.length){
            this.stepNum++;
        }
    }

    //goes back to the previous step
    public prevStep(): void {
        if(this.stepNum - 1 >= 0){
            this.stepNum--;
        }
    }

    //checks if we are on the last step
    public isLastStep(): boolean {
        return this.stepNum === this.example.steps.length - 1;
    }

    //restarts and goes back to the first step
    public restart(): void {
        this.stepNum = 0;
    }

}