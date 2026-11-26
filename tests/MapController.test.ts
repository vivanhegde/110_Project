// The controller draws through MapView
// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { MapModel } from "../src/features/map/MapModel";
import { MapView } from "../src/features/map/MapView";
import { MapController } from "../src/features/map/MapController";
import type { MapLocation } from "../src/features/map/types";

/*
  Tests for MapController.

  These use the real MapModel and MapView together, the way MapScreen does.
  Instead of starting the real game, we pass a fake onStartLevel function
  that just remembers which location it was given.
*/

const threeLocations: MapLocation[] = [
  { levelNumber: 1, name: "Pizza Park", orders: [{ numerator: 1, denominator: 8 }, { numerator: 2, denominator: 8 }] },
  { levelNumber: 2, name: "Seaside Pier", orders: [{ numerator: 3, denominator: 8 }, { numerator: 4, denominator: 8 }] },
  { levelNumber: 3, name: "City Square", orders: [{ numerator: 5, denominator: 8 }, { numerator: 6, denominator: 8 }] },
];

// Builds a controller + a way to check which level was started.
// startedLevel() returns 0 if nothing was started.
function setup(): { controller: MapController; container: HTMLElement; startedLevel: () => number }
{
  const container = document.createElement("div");
  const model = new MapModel(threeLocations, null);
  const view = new MapView(container);

  let started = 0;
  function onStartLevel(location: MapLocation): void
  {
    started = location.levelNumber;
  }

  const controller = new MapController(model, view, onStartLevel);
  return { controller: controller, container: container, startedLevel: function () { return started; } };
}

describe("MapController", () => {
  // showMap should draw the map using the model's statuses
  it("should draw the map", () => {
    const test = setup();
    test.controller.showMap();

    const buttons = test.container.querySelectorAll(".map-location");
    expect(buttons.length).toBe(3);
    expect(buttons[0].getAttribute("aria-label")).toBe("Level 1: Pizza Park (Open)");
  });

  // Choosing an unlocked place starts that level
  it("should start an unlocked level", () => {
    const test = setup();
    test.controller.showMap();

    expect(test.controller.selectLocation(1)).toBe(true);
    expect(test.startedLevel()).toBe(1);
  });

  // Choosing a locked place should not start it and should explain why
  it("should not start a locked level and should show a message", () => {
    const test = setup();
    test.controller.showMap();

    expect(test.controller.selectLocation(2)).toBe(false);
    expect(test.startedLevel()).toBe(0);

    const message = test.container.querySelector(".map-message") as HTMLElement;
    expect(message.textContent).toBe("This place is locked. Pass the level before it to unlock it.");
  });

  // Clicking the button on the page should start the level too
  it("should start a level when its button is clicked", () => {
    const test = setup();
    test.controller.showMap();

    const firstButton = test.container.querySelector(".map-location") as HTMLButtonElement;
    firstButton.click();

    expect(test.startedLevel()).toBe(1);
  });

  // Passing a level and coming back to the map should show the next place open
  it("should unlock the next place after a level is passed", () => {
    const test = setup();
    test.controller.levelPassed(1);
    test.controller.showMap();

    const buttons = test.container.querySelectorAll(".map-location");
    expect(buttons[0].getAttribute("aria-label")).toBe("Level 1: Pizza Park (Completed)");
    expect(buttons[1].getAttribute("aria-label")).toBe("Level 2: Seaside Pier (Open)");
    expect(test.controller.selectLocation(2)).toBe(true);
    expect(test.startedLevel()).toBe(2);
  });

  // The controller passes onBackToMenu to the view, so the button goes back to the menu
  it("should go back to the menu when Back to Menu is clicked", () => {
    const container = document.createElement("div");
    const model = new MapModel(threeLocations, null);
    const view = new MapView(container);

    let wentBack = false;
    function onBackToMenu(): void
    {
      wentBack = true;
    }

    const controller = new MapController(model, view, function () {}, onBackToMenu);
    controller.showMap();

    const backButton = container.querySelector(".map-back-button") as HTMLButtonElement;
    backButton.click();
    expect(wentBack).toBe(true);
  });
});
