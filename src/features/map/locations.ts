import type { SubtractionOrder } from "../pizza/types";
import type { MapLocation } from "./types";
import { LEVEL_ORDERS } from "../game/orders";

/*
  The places on the food truck map, in the order they unlock.

  Level 1 reuses the orders the game already had (LEVEL_ORDERS),
  so nothing changes for the first level.
  Levels 2 and 3 are new order lists.

  All pizzas use 8 slices because the game's plate is set up for eighths.
  To add a new place, add it to the end of this list with the next level number.
*/
export const MAP_LOCATIONS: MapLocation[] = [
  {
    levelNumber: 1,
    name: "Pizza Park",
    orders: LEVEL_ORDERS,
  },
  {
    levelNumber: 2,
    name: "Seaside Pier",
    orders: [
      { customerName: "Noah", denominator: 8, firstNumerator: 3, secondNumerator: 2, numerator: 5 },
      { customerName: "Zoe", denominator: 8, initialNumerator: 7, subtractNumerator: 4, numerator: 3 } as SubtractionOrder,
      { customerName: "Eli", denominator: 8, firstNumerator: 4, secondNumerator: 3, numerator: 7 },
      { customerName: "Lily", denominator: 8, initialNumerator: 5, subtractNumerator: 1, numerator: 4 } as SubtractionOrder,
      { customerName: "Max", denominator: 8, firstNumerator: 1, secondNumerator: 5, numerator: 6 },
    ],
  },
  {
    levelNumber: 3,
    name: "City Square",
    orders: [
      { customerName: "Ruby", denominator: 8, initialNumerator: 8, subtractNumerator: 3, numerator: 5 } as SubtractionOrder,
      { customerName: "Owen", denominator: 8, firstNumerator: 2, secondNumerator: 6, numerator: 8 },
      { customerName: "Ivy", denominator: 8, initialNumerator: 6, subtractNumerator: 5, numerator: 1 } as SubtractionOrder,
      { customerName: "Jack", denominator: 8, firstNumerator: 3, secondNumerator: 4, numerator: 7 },
      { customerName: "Nina", denominator: 8, initialNumerator: 8, subtractNumerator: 6, numerator: 2 } as SubtractionOrder,
    ],
  },
];
