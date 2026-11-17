import { ProgressModel } from "./progressStarsModel";
import { ProgressStorage } from "./progressStorage";
import { ProgressController } from "./progressStarsController";
import { ProgressView } from "./progressStarsView";
import { MAP_LOCATIONS } from "../map/locations";
import "./progress.css";

/*
  ProgressScreen connects the progress screen to the rest of the game.
  It loads saved progress, draws it, and calls onBack when Back is clicked.
  There is one level for every place on the map.
*/
export function startProgressScreen(app: HTMLElement, onBack: () => void): void {
    const controller = new ProgressController(
        new ProgressModel(MAP_LOCATIONS.length),
        new ProgressStorage()
    );
    const view = new ProgressView(app);

    view.render(
        controller.getCompletedLevels(),
        controller.getTotalStars(),
        controller.getPercentComplete(),
        onBack
    );
}