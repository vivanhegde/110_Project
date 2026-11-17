import { describe, it, expect, vi, afterEach } from "vitest";
import { DivisionModel } from "../src/features/division/DivisionModel";
import { DivisionController } from "../src/features/division/DivisionController";
import { generateDivisionOrders } from "../src/features/division/orders";

const order = { food: "pizza", totalNumerator: 3, totalDenominator: 4,
  portionNumerator: 1, portionDenominator: 8 };

afterEach(() => vi.restoreAllMocks());

describe("DivisionModel", () => {
  it.each([
    [1, 1, 1, 4, 4], [2, 1, 1, 6, 12], [3, 4, 1, 8, 6],
    [2, 3, 1, 6, 4], [3, 4, 3, 8, 2], [2, 4, 1, 2, 1],
  ])("divides %i/%i by %i/%i into %i portions", (a, b, c, d, answer) => {
    const model = new DivisionModel({ food: "pizza", totalNumerator: a,
      totalDenominator: b, portionNumerator: c, portionDenominator: d });
    expect(model.getAnswer()).toBe(answer);
    for (let i = 0; i < answer; i++) model.addPortion();
    expect(model.checkAnswer().type).toBe("correct");
  });

  it("gives grouping hints and lets a student correct an answer", () => {
    const model = new DivisionModel(order);
    expect(model.checkAnswer()).toMatchObject({ type: "tooFew", hint: expect.stringContaining("6 slices") });
    for (let i = 0; i < 7; i++) model.addPortion();
    expect(model.checkAnswer()).toMatchObject({ type: "tooMany", hint: expect.stringContaining("Divide 6 by 1") });
    model.removePortion();
    expect(model.checkAnswer().type).toBe("correct");
  });

  it("keeps portion controls between zero and twelve", () => {
    const model = new DivisionModel(order);
    model.removePortion();
    expect(model.getPortions()).toBe(0);
    for (let i = 0; i < 20; i++) model.addPortion();
    expect(model.getPortions()).toBe(12);
  });

  it.each([0, -1, 1.5, NaN, Infinity, 13])("rejects invalid fraction components: %s", (value) => {
    for (const key of ["totalNumerator", "totalDenominator", "portionNumerator", "portionDenominator"]) {
      expect(() => new DivisionModel({ ...order, [key]: value })).toThrow();
    }
  });

  it("rejects incomplete portions and answers beyond the visual limit", () => {
    expect(() => new DivisionModel({ ...order, portionNumerator: 2, portionDenominator: 3 })).toThrow();
    expect(() => new DivisionModel({ ...order, totalNumerator: 12, totalDenominator: 1 })).toThrow();
  });

  it("protects the order from external changes", () => {
    const input = { ...order };
    const model = new DivisionModel(input);
    input.totalNumerator = 10;
    model.getOrder().portionNumerator = 10;
    expect(model.getAnswer()).toBe(6);
  });

  it.each([0, 0.499, 0.999])("generates six supported orders at random value %s", (random) => {
    vi.spyOn(Math, "random").mockReturnValue(random);
    const orders = generateDivisionOrders();
    expect(orders).toHaveLength(6);
    for (const generated of orders) {
      const answer = new DivisionModel(generated).getAnswer();
      expect(Number.isInteger(answer)).toBe(true);
      expect(answer).toBeGreaterThanOrEqual(1);
      expect(answer).toBeLessThanOrEqual(12);
    }
    expect(orders[0].totalNumerator).toBe(random < 0.5 ? 1 : 2);
  });
});

describe("DivisionController", () => {
  it("clears incorrect feedback on editing and locks solved orders", () => {
    const controller = new DivisionController(new DivisionModel(order));
    controller.checkAnswer();
    controller.addPortion();
    expect(controller.getResult()).toBeNull();
    for (let i = 1; i < 6; i++) controller.addPortion();
    controller.checkAnswer();
    controller.addPortion();
    controller.removePortion();
    expect(controller.getPortions()).toBe(6);
    expect(controller.getResult()?.type).toBe("correct");
  });
});
