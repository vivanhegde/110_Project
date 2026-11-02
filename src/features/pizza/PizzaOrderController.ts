import { PizzaOrderModel } from "./PizzaOrderModel";
import type { AnswerResult, PizzaOrder } from "./types";

export class PizzaOrderController {
  private model: PizzaOrderModel;
  private orders: PizzaOrder[];

  private score = 0;
  private orderIndex = 0;
  private completed = false;

  public constructor(model: PizzaOrderModel, orders?: PizzaOrder[]) {
    this.model = model;

    //If orders are provided, use them, otherwise use the order from the model
    if (orders) {
      this.orders = [];

      for (const order of orders) {
        this.orders.push({ ...order });
      }
    } else {
      this.orders = [model.getOrder()];
    }

    //If there are no orders, throw an error
    if (this.orders.length === 0) {
      throw new Error("At least one order is required");
    }
  }
  
  //Called when a student changes their slice selection
  public selectSlice(count: number): void {

    //If the order is completed, throw an error
    if (this.completed) {
      throw new Error(
        "Cannot select slices after order is completed"
      );
    }
    //Changes the selected slices in the model to the count passed in
    this.model.selectSlice(count);
  }

  //Called when a student submits their answer
  public submitAnswer(): AnswerResult {
    const result = this.model.checkAnswer();

    //Award points only once for each completed order
    if (result.correct && !this.completed) {
      this.score += 100;
      this.completed = true;
    }

    //Checks the answer in the model and returns the result
    return result;
  }

  //Allows the UI to display the current order to the student
  public getSelectedSlices(): number {
    //Returns the selected slices from the model
    return this.model.getSelectedSlices();
  }

  //Allows the UI to display the current order to the student
  public getCurrentOrder(): PizzaOrder {
    return this.model.getOrder();
  }

  //Allows the UI to display the current score to the student
  public getScore(): number {
    return this.score;
  }

  //Allows the UI to display the current order index to the student
  public getOrderIndex(): number {
    return this.orderIndex;
  }

  //Allows the UI to display the total number of orders to the student
  public getTotalOrders(): number {
    return this.orders.length;
  }

  //Allows the UI to display whether the current order is completed to the student
  public isOrderCompleted(): boolean {
    return this.completed;
  }

  //Allows the UI to display whether the current order is the last order to the student
  public isLastOrder(): boolean {
    return this.orderIndex === this.orders.length - 1;
  }

  //Move to the next order after completing this one
  public nextOrder(): boolean {
    if (!this.completed || this.isLastOrder()) {
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