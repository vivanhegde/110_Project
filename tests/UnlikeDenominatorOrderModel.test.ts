// Import test utilities.
import { describe, it, expect } from "vitest";

// Import the model and order creation.
import {
  UnlikeDenominatorOrderModel,
} from "../src/features/pizza/UnlikeDenominatorOrderModel";
import {
  createUnlikeDenominatorOrder,
} from "../src/features/pizza/CreateUnlikeDenominatorOrder";

// Test order adaptation and shared answer checking.
describe("UnlikeDenominatorOrderModel", () => {
  // Preserve the original question and conversion data.
  it("stores the validated order", () => {
    const order = createUnlikeDenominatorOrder(
      "addition", 1, 3, 1, 4,
    );
    const model = new UnlikeDenominatorOrderModel(order);

    expect(model.getOrder()).toEqual(order);
  });

  // Adapt addition operands to the common denominator.
  it("provides a converted addition order", () => {
    const order = createUnlikeDenominatorOrder(
      "addition", 1, 3, 1, 4,
    );
    const model = new UnlikeDenominatorOrderModel(order);

    expect(model.getCommonOrder()).toEqual({
      numerator: 7,
      denominator: 12,
      firstNumerator: 4,
      secondNumerator: 3,
      unlikeOrder: order,
    });
  });

  // Preserve converted starting and removal amounts.
  it("provides a converted subtraction order", () => {
    const order = createUnlikeDenominatorOrder(
      "subtraction", 3, 4, 1, 6,
    );
    const model = new UnlikeDenominatorOrderModel(order);

    expect(model.getCommonOrder()).toEqual({
      numerator: 7,
      denominator: 12,
      initialNumerator: 9,
      subtractNumerator: 2,
      unlikeOrder: order,
    });
  });

  // Check correct, too few, and too many slices.
  it("checks addition answers using the common denominator", () => {
    const order = createUnlikeDenominatorOrder(
      "addition", 1, 3, 1, 4,
    );
    const model = new UnlikeDenominatorOrderModel(order);

    expect(model.checkAnswer(7, 12)).toEqual({
      correct: true,
      message: "Correct!",
    });

    expect(model.checkAnswer(6, 12).correct).toBe(false);
    expect(model.checkAnswer(8, 12).correct).toBe(false);
  });

  // Subtraction checks remaining slices rather than removed slices.
  it("checks the remaining amount for subtraction", () => {
    const order = createUnlikeDenominatorOrder(
      "subtraction", 3, 4, 1, 6,
    );
    const model = new UnlikeDenominatorOrderModel(order);

    expect(model.checkAnswer(7, 12).correct).toBe(true);
    expect(model.checkAnswer(2, 12).correct).toBe(false);
    expect(model.checkAnswer(6, 12).correct).toBe(false);
    expect(model.checkAnswer(8, 12).correct).toBe(false);
  });

  // Accept zero when the two fractions are equivalent.
  it("accepts a zero subtraction result", () => {
    const order = createUnlikeDenominatorOrder(
      "subtraction", 1, 2, 2, 4,
    );
    const model = new UnlikeDenominatorOrderModel(order);

    expect(model.checkAnswer(0, 4).correct).toBe(true);
    expect(model.checkAnswer(1, 4).correct).toBe(false);
  });

  // Accept exactly one whole pizza.
  it("accepts an answer of one whole pizza", () => {
    const order = createUnlikeDenominatorOrder(
      "addition", 1, 2, 2, 4,
    );
    const model = new UnlikeDenominatorOrderModel(order);

    expect(model.checkAnswer(4, 4).correct).toBe(true);
  });

  // Require conversion to the planned denominator.
  it("rejects a mismatched slice denominator", () => {
    const order = createUnlikeDenominatorOrder(
      "addition", 1, 3, 1, 4,
    );
    const model = new UnlikeDenominatorOrderModel(order);

    expect(() => model.checkAnswer(7, 6)).toThrow(
      "Slice denominator must match the common denominator",
    );
  });

  // Reject invalid denominator values.
  it.each([0, 5, NaN, Infinity])(
    "rejects an invalid current denominator: %s",
    denominator => {
      const order = createUnlikeDenominatorOrder(
        "addition", 1, 3, 1, 4,
      );
      const model = new UnlikeDenominatorOrderModel(order);

      expect(() => model.checkAnswer(7, denominator)).toThrow(
        "Slice denominator must match the common denominator",
      );
    },
  );

  // Reuse the shared checker's slice-count validation.
  it.each([-1, 0.5, 13, NaN, Infinity])(
    "rejects an invalid slice count: %s",
    count => {
      const order = createUnlikeDenominatorOrder(
        "addition", 1, 3, 1, 4,
      );
      const model = new UnlikeDenominatorOrderModel(order);

      expect(() => model.checkAnswer(count, 12))
        .toThrow("Invalid slice selection");
    },
  );

  // Validate original inputs when constructing the model.
  it("rejects invalid original fractions", () => {
    const order = createUnlikeDenominatorOrder(
      "addition", 1, 3, 1, 4,
    );

    order.firstNumerator = 4;

    expect(() => new UnlikeDenominatorOrderModel(order))
      .toThrow("Invalid first fraction");
  });

  // Recalculate derived values instead of trusting supplied values.
  it("recalculates conversion data from the original fractions", () => {
    const order = createUnlikeDenominatorOrder(
      "addition", 1, 3, 1, 4,
    );
    const expected = { ...order }; // Validated data before external changes.

    order.commonDenominator = 6;
    order.convertedFirstNumerator = 99;
    order.convertedSecondNumerator = 88;
    order.resultNumerator = 999;

    const model = new UnlikeDenominatorOrderModel(order);

    expect(model.getCommonOrder()).toEqual({
      numerator: 7,
      denominator: 12,
      firstNumerator: 4,
      secondNumerator: 3,
      unlikeOrder: expected,
    });
    expect(model.checkAnswer(7, 12).correct).toBe(true);
  });

  // Protect the model from changes to the supplied object.
  it("does not retain mutable input data", () => {
    const order = createUnlikeDenominatorOrder(
      "addition", 1, 3, 1, 4,
    );
    const model = new UnlikeDenominatorOrderModel(order);

    order.firstNumerator = 0;

    expect(model.getOrder().firstNumerator).toBe(1);
    expect(model.getCommonOrder().unlikeOrder?.firstNumerator).toBe(1);
    expect(model.checkAnswer(7, 12).correct).toBe(true);
  });

  // Protect internal data returned through getters.
  it.each(["addition", "subtraction"] as const)("returns independent copies of %s order data", operation => {
    const order = createUnlikeDenominatorOrder(
      operation, 1, 3, 1, 4,
    );
    const model = new UnlikeDenominatorOrderModel(order);

    const original = model.getOrder();
    const converted = model.getCommonOrder();
    const another = model.getCommonOrder(); // Independent conversion result.

    expect(converted.unlikeOrder).toEqual(order);
    expect(converted.unlikeOrder).not.toBe(another.unlikeOrder);

    original.resultNumerator = 0;
    converted.numerator = 0;
    converted.unlikeOrder!.firstNumerator = 0;
    converted.unlikeOrder!.resultNumerator = 0;

    expect(model.getOrder()).toEqual(order);
    expect(model.getCommonOrder().numerator).toBe(order.resultNumerator);
    expect(model.getCommonOrder().unlikeOrder).toEqual(order);
    expect(another.unlikeOrder).toEqual(order);
    expect(model.checkAnswer(order.resultNumerator, 12).correct).toBe(true);
  });
});
