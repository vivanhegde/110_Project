
import { describe, it, expect } from "vitest";
import { PizzaOrderModel } from "../src/features/pizza/PizzaOrderModel";

describe("Pizza order fraction addition", () => {
  const order = {
    customerName: "Alex",
    firstNumerator: 2,
    secondNumerator: 3,
    numerator: 5,
    denominator: 8,
    request: "I want 2/8 plus 3/8 of a pizza",
  };

  it("stores the customer information", () => {
    const model = new PizzaOrderModel(order);

    expect(model.getOrder().customerName).toBe("Alex");
  });

  it("accepts a correct fraction addition answer", () => {
    const model = new PizzaOrderModel(order);

    model.selectSlice(5);

    expect(model.checkAnswer().correct).toBe(true);
  });

  it("rejects an incorrect answer", () => {
    const model = new PizzaOrderModel(order);

    model.selectSlice(4);

    expect(model.checkAnswer().correct).toBe(false);
  });

  it("rejects an incorrect addition total", () => {
    expect(() =>
      new PizzaOrderModel({
        ...order,
        numerator: 6,
      })
    ).toThrow("Invalid fraction addition");
  });

  it("rejects selecting more slices than available", () => {
    const model = new PizzaOrderModel(order);

    expect(() => model.selectSlice(9)).toThrow(
      "Invalid slice selection"
    );
  });
});
