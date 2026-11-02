import { PizzaOrderModel } from "./PizzaOrderModel";
import type { AnswerResult } from "./types";

export class PizzaOrderController {
  private model: PizzaOrderModel;

  public constructor(model: PizzaOrderModel) {
    this.model = model;
  }
  
  //Called when a student changes their slice selection
  public selectSlice(count: number): void {
    //Changes the selected slices in the model to the count passed in
    this.model.selectSlice(count);
  }

  //Called when a student submits their answer
  public submitAnswer(): AnswerResult {
    //Checks the answer in the model and returns the result
    return this.model.checkAnswer();
  }

  //Allows the UI to display the current order to the student
  public getSelectedSlices(): number {
    //Returns the selected slices from the model
    return this.model.getSelectedSlices();
  }

}