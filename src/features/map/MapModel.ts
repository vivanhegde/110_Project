import type { MapLocation, LocationStatus, SaveStorage } from "./types";

//The name we save the student's progress under in the browser
const SAVE_KEY = "fraction-food-truck-highest-passed-level";

/*
  MapModel (the "M" in MVC for the map feature)

  This class keeps track of which places on the map are unlocked.
  It does NOT draw anything. Drawing is MapView's job.

  How unlocking works:
    - We only store ONE number: highestPassedLevel.
      It starts at 0, which means no levels have been passed yet.
    - A level is unlocked if it is at most one past the highest passed level.
      So with highestPassedLevel = 0, only level 1 is unlocked.
      After passing level 1, highestPassedLevel = 1, so levels 1 and 2 are unlocked.
    - A level is completed if it is at most highestPassedLevel.

  Saving:
    - Every time a new level is passed, we save highestPassedLevel to storage
      (the browser's localStorage in the real game).
    - When the model is created, it loads the saved number back.
      That's how unlocked places stay unlocked after closing the game.
*/
export class MapModel
{
  private locations: MapLocation[];
  private storage: SaveStorage | null; // null means "don't save anything"
  private highestPassedLevel = 0;

  public constructor(locations: MapLocation[], storage: SaveStorage | null)
  {
    if (locations.length === 0)
    {
      throw new Error("The map needs at least one location");
    }

    // Levels have to be numbered 1, 2, 3... in order.
    // That way level N is always at position N - 1 in the list, which keeps lookups simple.
    for (let i = 0; i < locations.length; i++)
    {
      if (locations[i].levelNumber !== i + 1)
      {
        throw new Error("Locations must be numbered 1, 2, 3... in order");
      }
    }

    // Keep our own copy of the list, like LevelModel does with its orders
    this.locations = [];
    for (let i = 0; i < locations.length; i++)
    {
      this.locations.push(locations[i]);
    }

    this.storage = storage;

    // Pick up where the student left off last time
    this.loadProgress();
  }

  // Gives back the location for a level number, or throws if there is no such level
  public getLocation(levelNumber: number): MapLocation
  {
    if (!Number.isInteger(levelNumber) || levelNumber < 1 || levelNumber > this.locations.length)
    {
      throw new Error("There is no location for that level");
    }

    return this.locations[levelNumber - 1];
  }

  // True if the student is allowed to play this level
  public isUnlocked(levelNumber: number): boolean
  {
    // Call getLocation first just to check the level exists
    this.getLocation(levelNumber);

    if (levelNumber <= this.highestPassedLevel + 1)
    {
      return true;
    }

    return false;
  }

  // True if the student already passed this level
  public isCompleted(levelNumber: number): boolean
  {
    this.getLocation(levelNumber);

    if (levelNumber <= this.highestPassedLevel)
    {
      return true;
    }

    return false;
  }

  // Builds the list the map screen draws: name, unlocked, and completed for every place
  public getStatuses(): LocationStatus[]
  {
    const statuses: LocationStatus[] = [];

    for (let i = 0; i < this.locations.length; i++)
    {
      const location = this.locations[i];

      const status: LocationStatus = {
        levelNumber: location.levelNumber,
        name: location.name,
        unlocked: this.isUnlocked(location.levelNumber),
        completed: this.isCompleted(location.levelNumber),
      };

      statuses.push(status);
    }

    return statuses;
  }

  // Called when the student PASSES a level. This is what unlocks the next place.
  public completeLevel(levelNumber: number): void
  {
    // You can't pass a level you weren't allowed to play
    if (!this.isUnlocked(levelNumber))
    {
      throw new Error("That level is still locked");
    }

    // Only move forward. Replaying an old level shouldn't lock anything again.
    if (levelNumber > this.highestPassedLevel)
    {
      this.highestPassedLevel = levelNumber;
      this.saveProgress();
    }
  }

  // Locks everything again except level 1. Handy for testing or for a new student.
  public resetProgress(): void
  {
    this.highestPassedLevel = 0;
    this.saveProgress();
  }

  // Writes the progress number into storage
  private saveProgress(): void
  {
    if (this.storage === null)
    {
      return;
    }

    // Some browsers block storage (like private mode).
    // If saving fails, the game should still work, it just won't remember progress.
    try
    {
      this.storage.setItem(SAVE_KEY, String(this.highestPassedLevel));
    }
    catch (error)
    {
      console.warn("Could not save map progress", error);
    }
  }

  // Reads the progress number back from storage, ignoring anything that looks wrong
  private loadProgress(): void
  {
    if (this.storage === null)
    {
      return;
    }

    let saved: string | null = null;

    try
    {
      saved = this.storage.getItem(SAVE_KEY);
    }
    catch (error)
    {
      console.warn("Could not load map progress", error);
      return;
    }

    // Nothing saved yet means a brand new student
    if (saved === null)
    {
      return;
    }

    const savedLevel = Number(saved);

    // Ignore broken data like "abc", "-2", or "1.5" and just start fresh
    if (!Number.isInteger(savedLevel) || savedLevel < 0)
    {
      return;
    }

    // If the save says more levels were passed than the map has
    // (for example a level was removed), cap it at the last level
    if (savedLevel > this.locations.length)
    {
      this.highestPassedLevel = this.locations.length;
    }
    else
    {
      this.highestPassedLevel = savedLevel;
    }
  }
}
