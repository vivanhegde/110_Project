import type { PizzaOrder } from "../pizza/types";
import type { LevelProgress, LevelResult, OrderRecord } from "./types";

//Share of orders that must be correct on the first try to pass (4 of 5 = 80%) y = x - 1 
const DEFAULT_PASS_RATE = 0.8;

export class LevelModel 
{
  private readonly levelNumber: number;
  private readonly orders: PizzaOrder[];
  private readonly requiredToPass: number;
  private currentIndex = 0;
  private score = 0;
  private records: OrderRecord[] = [];

  public constructor(levelNumber: number, orders: PizzaOrder[], requiredToPass?: number) 
  {
    //Level number must be a whole number starting at 1
    if (!Number.isInteger(levelNumber) || levelNumber < 1) 
    {
      throw new Error("Invalid level number");
    }
    //A level needs at least one order
    if (orders.length === 0) 
    {
      throw new Error("A level needs at least one order");
    }

    //If no pass requirement is given, use x - 1 
    const required = requiredToPass ?? orders.length - 1;

    //Pass requirement must be between 1 and the number of orders
    if (!Number.isInteger(required) || required < 1 || required > orders.length) 
    {
      throw new Error("Invalid pass requirement");
    }

    this.levelNumber = levelNumber;
    //Copy the list so outside code cannot change the level's orders
    this.orders = [...orders];
    this.requiredToPass = required;
  }

  //Returns the order the student is working on
  public getCurrentOrder(): PizzaOrder {
    if (this.isComplete()) {
      throw new Error("Level is already complete");
    }
    return this.orders[this.currentIndex];
  }

  //Called when the student gets the current order right, then moves to the next order
  public recordCorrectOrder(incorrectAttempts: number, pointsEarned: number): void {
    if (this.isComplete()) {
      throw new Error("Level is already complete");
    }
    if (!Number.isInteger(incorrectAttempts) || incorrectAttempts < 0) {
      throw new Error("Invalid incorrect attempts");
    }
    if (!Number.isInteger(pointsEarned) || pointsEarned < 0) {
      throw new Error("Invalid points earned");
    }

    //Save the result for the results screen
    this.records.push({
      order: this.orders[this.currentIndex],
      firstTryCorrect: incorrectAttempts === 0,
      pointsEarned,
    });

    this.score += pointsEarned;
    this.currentIndex++;
  }

  //True once every order has been solved
  public isComplete(): boolean {
    return this.currentIndex >= this.orders.length;
  }

  //Data for the header and progress bar
  public getProgress(): LevelProgress {
    return {
      levelNumber: this.levelNumber,
      //Stay on the last order number after finishing, instead of showing "Order 6 of 5"
      currentOrderNumber: Math.min(this.currentIndex + 1, this.orders.length),
      totalOrders: this.orders.length,
      completedOrders: this.currentIndex,
      score: this.score,
      isComplete: this.isComplete(),
    };
  }

  //Data for the results screen, only available after the last order
  public getResult(): LevelResult {
    if (!this.isComplete()) {
      throw new Error("Level is not complete yet");
    }

    const firstTryCorrectCount = this.records.filter((record) => record.firstTryCorrect).length;

    return {
      levelNumber: this.levelNumber,
      passed: firstTryCorrectCount >= this.requiredToPass,
      firstTryCorrectCount,
      requiredToPass: this.requiredToPass,
      totalOrders: this.orders.length,
      score: this.score,
      //Copy so the results screen cannot change the saved records
      records: [...this.records],
    };
  }

  //Used by Play Again and Retry Level: back to Order 1 with a score of 0
  public restart(): void {
    this.currentIndex = 0;
    this.score = 0;
    this.records = [];
  }
}
