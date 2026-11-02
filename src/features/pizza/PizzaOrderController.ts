import { PizzaOrderModel } from "./PizzaOrderModel";
import type { PizzaOrder, AnswerResult } from "./types";

export class PizzaOrderController {
  private model: PizzaOrderModel;
  private score = 0;
  private orderIndex = 0;
  private orders: PizzaOrder[];
  private completed = false;

  public constructor(model: PizzaOrderModel, orders?: PizzaOrder[]) {
    this.model = model;
    this.orders = orders ?? [model.getOrder()];
  }
  
  //Called when a student changes their slice selection
  public selectSlice(count: number): void {

    if (this.completed){
      throw new Error("Cannot select slices after order is completed");
    }
    //Changes the selected slices in the model to the count passed in
    this.model.selectSlice(count);
  }

  //Called when a student submits their answer
  public submitAnswer(): AnswerResult {
    //Checks the answer in the model and returns the result\
    const result = this.model.checkAnswer();

    //Awards points if the answer is correct and the order has not been completed yet
    if (result.correct&&!this.completed){
      this.score+=100;
      this.completed = true;
    }
    
    return result;
  }

  //Allows the UI to display the current order to the student
  public getSelectedSlices(): number {
    //Returns the selected slices from the model
    return this.model.getSelectedSlices();
  }

  //Allows the UI to display the current order to the student
  public getCurrentOrder(): PizzaOrder {
    //Returns the current order from the model
    return this.model.getOrder();
  }

  //Allows the UI to display the current score to the student
  public getScore(): number {
    //Returns the current score
    return this.score;
  }

  //Allows the UI to display whether the order has been completed
  public isOrderCompleted(): boolean {
    //Returns whether the order has been completed
    return this.completed;
  }

  //Allows the UI to move to the next order if there is one
  public nextOrder(): boolean {
    if (!this.completed) {
      return false;
    }

    if (this.orderIndex + 1 >= this.orders.length) {
      return false;
    }

    this.orderIndex++;
    this.model = new PizzaOrderModel(
      this.orders[this.orderIndex]
    );
    this.completed = false;

    return true;
  }

}