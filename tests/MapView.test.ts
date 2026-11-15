// The view uses document.createElement, so these tests need jsdom's fake browser page.
// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { MapView } from "../src/features/map/MapView";
import type { LocationStatus } from "../src/features/map/types";

/*
  Tests for MapView.

  The view only draws, so we hand it made-up statuses and check the page:
  the button text, which buttons are locked, and what happens on a click.
*/

// Level 1 passed, level 2 open, level 3 locked
const statuses: LocationStatus[] = [
  { levelNumber: 1, name: "Pizza Park", unlocked: true, completed: true },
  { levelNumber: 2, name: "Seaside Pier", unlocked: true, completed: false },
  { levelNumber: 3, name: "City Square", unlocked: false, completed: false },
];

// Does nothing. Used when a test doesn't care about clicks.
function ignoreClick(levelNumber: number): void
{
}

describe("MapView", () => 
{
  // Every place gets a button. aria-label is the full description of the button.
  it("should draw one button per location with its state", () => 
  {
    const container = document.createElement("div");
    const view = new MapView(container);
    view.render(statuses, ignoreClick);

    const buttons = container.querySelectorAll(".map-location");
    expect(buttons.length).toBe(3);
    expect(buttons[0].getAttribute("aria-label")).toBe("Level 1: Pizza Park (Completed)");
    expect(buttons[1].getAttribute("aria-label")).toBe("Level 2: Seaside Pier (Open)");
    expect(buttons[2].getAttribute("aria-label")).toBe("Level 3: City Square (Locked)");
  });

  // Inside each button: the icon, "Level 2", the name, and the state word
  it("should show the icon, level, name, and state inside each button", () => 
  {
    const container = document.createElement("div");
    const view = new MapView(container);
    view.render(statuses, ignoreClick);

    const buttons = container.querySelectorAll(".map-location");
    const open = buttons[1];

    expect((open.querySelector(".map-icon") as HTMLElement).textContent).toBe("🚚");
    expect((open.querySelector(".map-level") as HTMLElement).textContent).toBe("Level 2");
    expect((open.querySelector(".map-name") as HTMLElement).textContent).toBe("Seaside Pier");
    expect((open.querySelector(".map-status") as HTMLElement).textContent).toBe("Open");
    expect((buttons[0].querySelector(".map-icon") as HTMLElement).textContent).toBe("⭐");
    expect((buttons[2].querySelector(".map-icon") as HTMLElement).textContent).toBe("🔒");
  });

  // The header counts how many places are done
  it("should show how many places are completed in the header", () => 
  {
    const container = document.createElement("div");
    const view = new MapView(container);
    view.render(statuses, ignoreClick);

    const progress = container.querySelector(".map-progress") as HTMLElement;
    expect(progress.textContent).toBe("1 of 3 places completed");
  });

  // Locked places look different and can't be clicked
  it("should disable and mark locked locations", () => 
  {
    const container = document.createElement("div");
    const view = new MapView(container);
    view.render(statuses, ignoreClick);

    const buttons = container.querySelectorAll(".map-location");
    const lockedButton = buttons[2] as HTMLButtonElement;
    const openButton = buttons[1] as HTMLButtonElement;

    expect(lockedButton.disabled).toBe(true);
    expect(lockedButton.classList.contains("locked")).toBe(true);
    expect(openButton.disabled).toBe(false);
    expect(openButton.classList.contains("unlocked")).toBe(true);
  });

  // Clicking an open place sends its level number to onSelect
  it("should call onSelect with the level number when an open location is clicked", () => 
  {
    const container = document.createElement("div");
    const view = new MapView(container);

    let clickedLevel = 0;
    function onSelect(levelNumber: number): void
    {
      clickedLevel = levelNumber;
    }

    view.render(statuses, onSelect);
    const buttons = container.querySelectorAll(".map-location");
    (buttons[1] as HTMLButtonElement).click();

    expect(clickedLevel).toBe(2);
  });

  // Clicking a locked place should do nothing
  it("should not call onSelect when a locked location is clicked", () => 
  {
    const container = document.createElement("div");
    const view = new MapView(container);

    let clicks = 0;
    function onSelect(levelNumber: number): void
    {
      clicks = clicks + 1;
    }

    view.render(statuses, onSelect);
    const buttons = container.querySelectorAll(".map-location");
    (buttons[2] as HTMLButtonElement).click();

    expect(clicks).toBe(0);
  });

  // Drawing again should replace the old map, not add a second one
  it("should replace the old map when drawn again", () => 
  {
    const container = document.createElement("div");
    const view = new MapView(container);
    view.render(statuses, ignoreClick);
    view.render(statuses, ignoreClick);

    expect(container.querySelectorAll(".map-page").length).toBe(1);
  });

  // showMessage puts text in the message line
  it("should show a message", () => {
    const container = document.createElement("div");
    const view = new MapView(container);
    view.render(statuses, ignoreClick);
    view.showMessage("Hello");

    const message = container.querySelector(".map-message") as HTMLElement;
    expect(message.textContent).toBe("Hello");
  });
});
