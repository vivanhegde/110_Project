
import { describe, it, expect } from "vitest";
import { PizzaOrderModel } from "../src/features/pizza/PizzaOrderModel";
import { PizzaOrderController } from "../src/features/pizza/PizzaOrderController";

const orders = [
  {
    customerName: "Alex",
    firstNumerator: 2,
    secondNumerator: 3,
    numerator: 5,
    denominator: 8,
    request: "I want 2/8 plus 3/8 pizza",
  },
  {
    customerName: "Maya",
    firstNumerator: 1,
    secondNumerator: 2,
    numerator: 3,
    denominator: 6,
    request: "I want 1/6 plus 2/6 pizza",
  },
];

function createGame() {
  return new PizzaOrderController(
    new PizzaOrderModel(orders[0]),
    orders
  );
}

describe("Pizza order gameplay", () => {
  it("starts with zero points", () => {
    expect(createGame().getScore()).toBe(0);
  });

  it("awards 100 points for a correct answer", () => {
    const game = createGame();

    game.selectSlice(5);
    expect(game.submitAnswer().correct).toBe(true);
    expect(game.getScore()).toBe(100);
  });

  it("does not award points for an incorrect answer", () => {
    const game = createGame();

    game.selectSlice(4);
    expect(game.submitAnswer().correct).toBe(false);
    expect(game.getScore()).toBe(0);
  });

  it("does not award points twice", () => {
    const game = createGame();

    game.selectSlice(5);
    game.submitAnswer();
    game.submitAnswer();

    expect(game.getScore()).toBe(100);
  });

  it("moves to the next order after a correct answer", () => {
    const game = createGame();

    game.selectSlice(5);
    game.submitAnswer();

    expect(game.nextOrder()).toBe(true);
    expect(game.getCurrentOrder().customerName).toBe("Maya");
    expect(game.getSelectedSlices()).toBe(0);
  });

  it("does not advance after an incorrect answer", () => {
    const game = createGame();

    game.selectSlice(4);
    game.submitAnswer();

    expect(game.nextOrder()).toBe(false);
  });

  it("prevents selecting slices after completing an order", () => {
    const game = createGame();

    game.selectSlice(5);
    game.submitAnswer();

    expect(() => game.selectSlice(4)).toThrow();
  });
});
