import type { PizzaOrder } from "../pizza/types";

//One place on the food truck map. Each place is one level.
export interface MapLocation
{
  //Levels are numbered 1, 2, 3... in the order they unlock
  levelNumber: number;

  //The name shown on the map, like "Pizza Park"
  name: string;

  //The pizza orders the student plays at this place
  orders: PizzaOrder[];
}

//What the map screen needs to know to draw one location
export interface LocationStatus
{
  levelNumber: number;
  name: string;

  //True if the student is allowed to play this level
  unlocked: boolean;

  //True if the student has already passed this level
  completed: boolean;
}

//Anything that can save and load text by a key.
//The browser's localStorage works here, and tests can pass in a simple fake one.
export interface SaveStorage
{
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}
