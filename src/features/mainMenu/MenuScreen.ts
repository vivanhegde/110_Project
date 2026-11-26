import { MenuView } from "./MenuView";
import { startMapScreen } from "../map/MapScreen";
import { startProgressScreen } from "../progressStars/progressStarsScreen";
import { ProgressModel } from "../progressStars/progressStarsModel";
import { ProgressStorage } from "../progressStars/progressStorage";
import { ProgressController } from "../progressStars/progressStarsController";
import { MAP_LOCATIONS } from "../map/locations";
import "./Menu.css";

/*
  menuScreen connects the main menu to the rest of the game.
  main.ts calls startMenuScreen(app) when the game opens.

  The flow:
    1. The menu is drawn, showing the student's total stars.
    2. Play opens the food truck map. The map's Back to Menu button returns here.
    3. My Progress opens the progress screen. Its Back button returns here.
*/
export function startMenuScreen(app: HTMLElement): void
{
  // Loads saved progress so the menu can show the total stars
  const progress = new ProgressController(
    new ProgressModel(MAP_LOCATIONS.length),
    new ProgressStorage()
  );

  const view = new MenuView(app);

  view.render(
    progress.getTotalStars(),
    () => startMapScreen(app, () => startMenuScreen(app)),
    () => startProgressScreen(app, () => startMenuScreen(app))
  );
}