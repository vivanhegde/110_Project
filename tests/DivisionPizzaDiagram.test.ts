// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import { createPizzaDiagram } from "../src/features/division/PizzaDiagram";

describe("Division pizza diagram", () => {
  it("draws only the supplied amount and describes it for screen readers", () => {
    const pizza = createPizzaDiagram(8, 6, 3, "Three quarters of a pizza", true);
    expect(pizza.getAttribute("role")).toBe("img");
    expect(pizza.getAttribute("aria-label")).toBe("Three quarters of a pizza");
    expect(pizza.querySelectorAll(".division-slice")).toHaveLength(6);
    expect(pizza.querySelectorAll(".served")).toHaveLength(3);
    expect(pizza.querySelector('path[fill="#C8803F"]')).not.toBeNull();
    expect(pizza.querySelector('path[fill="#FFD66B"]')).not.toBeNull();
  });

  it("draws a whole pizza using closed arcs instead of a zero-area wedge", () => {
    const pizza = createPizzaDiagram(1, 1, 0, "One whole pizza", true);
    const crust = pizza.querySelector('path[fill="#C8803F"]')!;
    const path = crust.getAttribute("d")!;
    expect(path.match(/ A /g)).toHaveLength(2);
    expect(path.endsWith("Z")).toBe(true);
    expect(path).not.toMatch(/NaN|Infinity/);
  });

  it("draws an empty plate with no invented food", () => {
    const pizza = createPizzaDiagram(4, 0, 0, "Empty plate");
    expect(pizza.querySelectorAll("circle")).toHaveLength(2);
    expect(pizza.querySelectorAll("path")).toHaveLength(0);
  });
});
