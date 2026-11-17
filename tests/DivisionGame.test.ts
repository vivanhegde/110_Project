// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { startDivisionGame } from "../src/features/division/DivisionGame";
import { DivisionView } from "../src/features/division/DivisionView";

let root: HTMLElement;
function click(id: string): void {
  const button = root.querySelector<HTMLButtonElement>(`#${id}`);
  expect(button).not.toBeNull();
  button!.click();
}

beforeEach(() => {
  vi.spyOn(Math, "random").mockReturnValue(0);
  root = document.createElement("div");
  document.body.appendChild(root);
  startDivisionGame(root);
});
afterEach(() => { root.remove(); vi.restoreAllMocks(); });

describe("Division practice", () => {
  it("shows the supply, portion size, map link, and an optional hint", () => {
    expect(root.querySelector(".division-prompt")!.textContent).toContain("1/1 of a pizza");
    expect(root.querySelector(".division-prompt")!.textContent).toContain("1/2 of a pizza");
    expect(root.querySelectorAll(".division-slice")).toHaveLength(2);
    expect(root.querySelector("a")!.getAttribute("href")).toBe("./");
    expect(root.querySelector<HTMLButtonElement>("#division-remove")!.disabled).toBe(true);
    click("division-hint");
    expect(root.querySelector(".division-hint")!.textContent).toContain("groups of 1 fit into 2");
  });

  it("serves slices and lets the student return a portion by clicking it", () => {
    const add = root.querySelector<HTMLButtonElement>("#division-add")!;
    add.focus();
    click("division-add");
    expect(document.activeElement?.id).toBe("division-add");
    expect(root.querySelectorAll(".served")).toHaveLength(1);
    expect(root.querySelectorAll(".division-portion")).toHaveLength(1);
    click("division-portion-0");
    expect(root.querySelectorAll(".served")).toHaveLength(0);
    expect(root.querySelector(".division-count")!.textContent).toContain("0 portions");
  });

  it("serves a portion by clicking the pizza and fades the served supply slice", () => {
    const pizza = root.querySelector<HTMLButtonElement>("#division-serve-1")!;
    expect(pizza.querySelector('svg[role="img"]')).not.toBeNull();
    pizza.click();
    expect(root.querySelectorAll(".division-supply .served")).toHaveLength(1);
    expect(root.querySelectorAll(".division-portions svg")).toHaveLength(1);
    click("division-serve-1");
    expect(root.querySelector<HTMLButtonElement>("#division-serve-1")!.disabled).toBe(true);
    expect(root.querySelector(".division-count")!.textContent).toContain("2 portions");
    click("division-remove");
    expect(root.querySelector<HTMLButtonElement>("#division-serve-1")!.disabled).toBe(false);
  });

  it("shows excess portions as empty plates instead of adding pizza", () => {
    for (let i = 0; i < 3; i++) click("division-add");
    const overflow = root.querySelector(".division-overflow")!;
    expect(overflow.textContent).toContain("not enough food");
    expect(overflow.querySelectorAll("path")).toHaveLength(0);
    expect(overflow.querySelector('svg[aria-label^="Empty plate"]')).not.toBeNull();
  });

  it("preserves a whole pizza for every whole unit of food", () => {
    vi.mocked(Math.random).mockReturnValue(0.999);
    startDivisionGame(root);
    expect(root.querySelectorAll(".division-supply svg")).toHaveLength(2);
    expect(root.querySelectorAll(".division-supply .division-slice")).toHaveLength(4);
    for (let i = 0; i < 3; i++) click("division-add");
    const pizzas = root.querySelectorAll(".division-supply svg");
    expect(pizzas[0].querySelectorAll(".served")).toHaveLength(2);
    expect(pizzas[1].querySelectorAll(".served")).toHaveLength(1);
  });

  it("explains too few and too many portions, preserving the current order on retry", () => {
    click("division-check");
    expect(root.querySelector(".division-feedback")!.getAttribute("data-result")).toBe("tooFew");
    expect(root.querySelector(".division-hint")).not.toBeNull();
    expect(root.querySelector("#division-next")).toBeNull();
    for (let i = 0; i < 3; i++) click("division-add");
    expect(root.querySelectorAll(".division-overflow")).toHaveLength(1);
    expect(root.querySelectorAll(".served")).toHaveLength(2);
    click("division-check");
    expect(root.querySelector(".division-feedback")!.getAttribute("data-result")).toBe("tooMany");
    click("division-remove");
    click("division-check");
    expect(root.querySelector(".division-feedback")!.getAttribute("data-result")).toBe("correct");
    expect(root.querySelector("#division-add")).toBeNull();
    expect(document.activeElement?.id).toBe("division-next");
    expect(root.querySelector<HTMLButtonElement>(".division-portion")!.disabled).toBe(true);
  });

  it("keeps keyboard focus on the controls after returning the last portion", () => {
    click("division-add");
    root.querySelector<HTMLButtonElement>("#division-portion-0")!.focus();
    click("division-portion-0");
    expect(document.activeElement?.id).toBe("division-add");
    expect(root.querySelectorAll(".division-portion")).toHaveLength(0);
  });

  it("keeps keyboard focus on Return a Portion when the serving limit is reached", () => {
    root.querySelector<HTMLButtonElement>("#division-add")!.focus();
    for (let i = 0; i < 12; i++) click("division-add");
    expect(root.querySelector<HTMLButtonElement>("#division-add")!.disabled).toBe(true);
    expect(document.activeElement?.id).toBe("division-remove");
    click("division-remove");
    expect(root.querySelector<HTMLButtonElement>("#division-add")!.disabled).toBe(false);
    expect(root.querySelectorAll(".division-portion")).toHaveLength(11);
  });

  it("finishes all six orders and restarts with cleared portions and hints", () => {
    for (const answer of [2, 3, 4, 6, 3, 4]) {
      for (let i = 0; i < answer; i++) click("division-add");
      click("division-check");
      expect(root.querySelector(".division-feedback")!.getAttribute("data-result")).toBe("correct");
      click("division-next");
    }
    expect(root.querySelector("h1")!.textContent).toBe("All portions served!");
    click("division-restart");
    expect(root.querySelector(".division-progress")!.textContent).toBe("Order 1 of 6");
    expect(root.querySelector(".division-count")!.textContent).toContain("0 portions");
    expect(root.querySelector(".division-hint")).toBeNull();
  });

  it("renders groups of multiple slices with a partial pizza", () => {
    const noop = () => {};
    new DivisionView(root, { onAdd: noop, onRemove: noop, onCheck: noop, onHint: noop, onNext: noop })
      .render({ food: "pizza", totalNumerator: 3, totalDenominator: 4,
        portionNumerator: 3, portionDenominator: 8 }, 1, null, null, 1, 1);
    expect(root.querySelectorAll(".division-slice")).toHaveLength(6);
    expect(root.querySelectorAll(".served")).toHaveLength(3);
    expect(root.querySelector(".division-count")!.textContent).toContain("3 slices still available");
    expect(root.querySelector('.division-supply svg')!.getAttribute("aria-label")).toContain("6 of 8 equal slices");
    expect(root.querySelector('.division-portions svg')!.getAttribute("aria-label")).toContain("3/8");
  });
});
