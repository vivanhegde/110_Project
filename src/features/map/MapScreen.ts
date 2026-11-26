import { MapModel } from "./MapModel";
import { MapView } from "./MapView";
import { MapController } from "./MapController";
import { MAP_LOCATIONS } from "./locations";
import type { MapLocation, SaveStorage } from "./types";
import { startGame } from "../game/GameScreen";
import "./Map.css";

/*
  MapScreen connects the map to the rest of the game.
  The main menu's Play button calls startMapScreen(app, onBackToMenu).
  main.ts also calls startMapScreen(app) directly for ?mode=map.

  The flow:
    1. The map is drawn. Only unlocked places can be clicked.
    2. Clicking a place starts the game with that place's orders (startGame).
    3. If the student passes, the game calls levelPassed, which unlocks the next place.
    4. "Back to Map" on the results screen draws the map again, now with the new place open.
    5. "Back to Menu" on the map goes back to the main menu (only if onBackToMenu is given).

  The model is created only once, so progress is kept while playing,
  and it's also saved to localStorage so it's kept after closing the game.
*/
export function startMapScreen(app: HTMLElement, onBackToMenu?: () => void): void
{
  const model = new MapModel(MAP_LOCATIONS, getBrowserStorage());
  const view = new MapView(app);
  const controller = new MapController(model, view, playLevel, onBackToMenu);

  // Starts the game for the place the student picked
  function playLevel(location: MapLocation): void
  {
    startGame(app, location.levelNumber, location.orders, levelPassed, backToMap);
  }

  // The game calls this when the student passes the level
  function levelPassed(levelNumber: number): void
  {
    controller.levelPassed(levelNumber);
  }

  // The game calls this when the student clicks "Back to Map"
  function backToMap(): void
  {
    controller.showMap();
  }

  controller.showMap();
}

// Gets the browser's localStorage, or null if the browser blocks it.
// With null, the map still works, it just won't remember progress after closing.
function getBrowserStorage(): SaveStorage | null
{
  try
  {
    return window.localStorage;
  }
  catch (error)
  {
    return null;
  }
}
