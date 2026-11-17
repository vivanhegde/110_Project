// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from "vitest";
import { MapView } from "../src/features/map/MapView";

const starts = vi.hoisted(() => ({
  addition: vi.fn(), subtraction: vi.fn(), unlike: vi.fn(), recipe: vi.fn(),
  cutting: vi.fn(), division: vi.fn(), progress: vi.fn(), game: vi.fn(), map: vi.fn(),
}));

vi.mock("../src/features/pizza/AdditionGame", () => ({ startAdditionGame: starts.addition }));
vi.mock("../src/features/pizza/SubtractionGame", () => ({ startSubtractionGame: starts.subtraction }));
vi.mock("../src/features/pizza/UnlikeDenominatorGame", () => ({ startUnlikeDenominatorGame: starts.unlike }));
vi.mock("../src/features/recipe/RecipeGame", () => ({ startRecipeGame: starts.recipe }));
vi.mock("../src/features/plate/cuttingGame", () => ({ startCuttingGame: starts.cutting }));
vi.mock("../src/features/division/DivisionGame", () => ({ startDivisionGame: starts.division }));
vi.mock("../src/features/progressStars/progressStarsScreen", () => ({ startProgressScreen: starts.progress }));
vi.mock("../src/features/game/GameScreen", () => ({ startGame: starts.game }));
vi.mock("../src/features/map/MapScreen", () => ({ startMapScreen: starts.map }));

const plate = vi.hoisted(() => ({
  setModel: vi.fn(), setView: vi.fn(), setController: vi.fn(), startOrder: vi.fn(),
}));
vi.mock("../src/features/plate/PlateModel", () => ({ PlateModel: class {} }));
vi.mock("../src/features/plate/PlateView", () => ({
  PlateView: class { setController = plate.setController; },
}));
vi.mock("../src/features/plate/PlateController", () => ({
  PlateController: class {
    setModel = plate.setModel;
    setView = plate.setView;
    startOrder = plate.startOrder;
  },
}));

beforeEach(() => {
  vi.resetModules();
  vi.clearAllMocks();
  document.body.innerHTML = '<div id="app"></div>';
  window.history.replaceState(null, "", "/");
});

describe("Division routing compatibility", () => {
  it.each([
    ["", "map"], ["?mode=unknown", "map"], ["?mode=addition", "addition"],
    ["?mode=subtraction", "subtraction"], ["?mode=recipe", "recipe"],
    ["?mode=cutting", "cutting"], ["?mode=division", "division"],
    ["?mode=game", "game"], ["?mode=progress", "progress"],
    ["?practice=unlike", "unlike"], ["?practice=unlike&mode=division", "unlike"],
  ] as const)("%s starts only %s", async (query, expected) => {
    window.history.replaceState(null, "", "/" + query);
    await import("../src/main");
    for (const [name, start] of Object.entries(starts)) {
      expect(start).toHaveBeenCalledTimes(name === expected ? 1 : 0);
    }
    expect(starts[expected].mock.calls[0][0]).toBe(document.getElementById("app"));
  });

  it("preserves the progress screen's return-to-map callback", async () => {
    window.history.replaceState(null, "", "/?mode=progress");
    await import("../src/main");
    const backToMap = starts.progress.mock.calls[0][1];
    expect(backToMap).toBeTypeOf("function");
    backToMap();
    expect(starts.map).toHaveBeenCalledWith(document.getElementById("app"));
  });

  it("preserves the demo plate setup", async () => {
    window.history.replaceState(null, "", "/?mode=demo");
    await import("../src/main");
    expect(document.getElementById("plate")).not.toBeNull();
    expect(plate.setModel).toHaveBeenCalledOnce();
    expect(plate.setView).toHaveBeenCalledOnce();
    expect(plate.setController).toHaveBeenCalledOnce();
    expect(plate.startOrder).toHaveBeenCalledWith(8);
    for (const start of Object.values(starts)) expect(start).not.toHaveBeenCalled();
  });

  it("adds the division link while keeping map selections and locks intact", () => {
    const app = document.getElementById("app")!;
    const onSelect = vi.fn();
    const statuses = [
      { levelNumber: 1, name: "Pizza Park", completed: false, unlocked: true },
      { levelNumber: 2, name: "Seaside Pier", completed: false, unlocked: false },
    ];
    const view = new MapView(app);
    view.render(statuses, onSelect);
    view.render(statuses, onSelect);
    expect(app.querySelectorAll('a[href="?mode=division"]')).toHaveLength(1);
    const buttons = app.querySelectorAll<HTMLButtonElement>(".map-location");
    expect(buttons).toHaveLength(2);
    expect(buttons[1].disabled).toBe(true);
    buttons[0].click();
    buttons[1].click();
    expect(onSelect).toHaveBeenCalledExactlyOnceWith(1);
  });
});
