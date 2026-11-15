import { MapModel } from "./MapModel";
import { MapView } from "./MapView";
import type { MapLocation } from "./types";

/*
  MapController

  The controller between the map and the rest of the game:
    - showMap() asks the model for the latest statuses and tells the view to draw them
    - selectLocation() runs when a place is clicked and starts that level if it's unlocked
    - levelPassed() runs when the student passes a level, so the next place unlocks

  onStartLevel is a function given to us by MapScreen. The controller doesn't know
  how to start the game. It just calls this function with the chosen location.
*/
export class MapController
{
  private model: MapModel;
  private view: MapView;
  private onStartLevel: (location: MapLocation) => void;

  public constructor(model: MapModel, view: MapView, onStartLevel: (location: MapLocation) => void)
  {
    this.model = model;
    this.view = view;
    this.onStartLevel = onStartLevel;
  }

  // Draws the map using the model's current statuses
  public showMap(): void
  {
    // When a place is clicked, the view calls this arrow function to pass the level number on to selectLocation()
    this.view.render(this.model.getStatuses(), (levelNumber: number) =>
    {
      this.selectLocation(levelNumber);
    });
  }

  // Called when a place on the map is chosen.
  // Returns true if the level started, false if it was locked.
  public selectLocation(levelNumber: number): boolean
  {
    // Double-check with the model, even though locked buttons are already disabled.
    // The rules live in the model, not in the view.
    if (!this.model.isUnlocked(levelNumber))
    {
      this.view.showMessage("This place is locked. Pass the level before it to unlock it.");
      return false;
    }

    this.onStartLevel(this.model.getLocation(levelNumber));
    return true;
  }

  // Called by the game when the student PASSES a level
  public levelPassed(levelNumber: number): void
  {
    this.model.completeLevel(levelNumber);
  }
}
