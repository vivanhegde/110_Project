import { describe, it, expect } from "vitest";
import { MapModel } from "../src/features/map/MapModel";
import { MAP_LOCATIONS } from "../src/features/map/locations";
import type { MapLocation, SaveStorage } from "../src/features/map/types";

/*
  Unit tests for MapModel.

  These test the unlocking rules and the saving/loading by themselves.
  Instead of the real browser localStorage, we use a fake storage object
  (just a plain object holding the saved text), so we can see exactly what was saved.
*/

// Three simple places. The orders don't matter for the map, so they're tiny.
const threeLocations: MapLocation[] = [
  { levelNumber: 1, name: "Pizza Park", orders: [{ numerator: 1, denominator: 8 }, { numerator: 2, denominator: 8 }] },
  { levelNumber: 2, name: "Seaside Pier", orders: [{ numerator: 3, denominator: 8 }, { numerator: 4, denominator: 8 }] },
  { levelNumber: 3, name: "City Square", orders: [{ numerator: 5, denominator: 8 }, { numerator: 6, denominator: 8 }] },
];

// A fake storage that remembers what was saved, like localStorage does.
// savedText starts as whatever we pass in (null means nothing saved yet).
function makeFakeStorage(savedText: string | null): { storage: SaveStorage; saved: () => string | null }
{
  let value = savedText;

  const storage: SaveStorage = {
    getItem: function (key: string): string | null
    {
      return value;
    },
    setItem: function (key: string, newValue: string): void
    {
      value = newValue;
    },
  };

  // saved() lets the test look at what's in storage right now
  return { storage: storage, saved: function () { return value; } };
}

describe("MapModel", () => {
  // A brand new student can only play the first place
  it("should unlock only level 1 at the start", () => {
    const map = new MapModel(threeLocations, null);

    expect(map.isUnlocked(1)).toBe(true);
    expect(map.isUnlocked(2)).toBe(false);
    expect(map.isUnlocked(3)).toBe(false);
    expect(map.isCompleted(1)).toBe(false);
  });

  // Passing level 1 should open level 2 but not level 3
  it("should unlock the next level after passing one", () => {
    const map = new MapModel(threeLocations, null);
    map.completeLevel(1);

    expect(map.isCompleted(1)).toBe(true);
    expect(map.isUnlocked(2)).toBe(true);
    expect(map.isUnlocked(3)).toBe(false);
  });

  // Passing the last level marks it completed and doesn't break anything
  it("should mark every level completed after passing them all", () => {
    const map = new MapModel(threeLocations, null);
    map.completeLevel(1);
    map.completeLevel(2);
    map.completeLevel(3);

    expect(map.isCompleted(3)).toBe(true);
    expect(map.isUnlocked(3)).toBe(true);
  });

  // Replaying an earlier level shouldn't lock later levels again
  it("should not go backward when an earlier level is replayed", () => {
    const map = new MapModel(threeLocations, null);
    map.completeLevel(1);
    map.completeLevel(2);
    map.completeLevel(1); // replay level 1

    expect(map.isUnlocked(3)).toBe(true);
  });

  // You can't pass a level you weren't allowed to enter
  it("should not let a locked level be completed", () => {
    const map = new MapModel(threeLocations, null);

    expect(() => map.completeLevel(3)).toThrow("That level is still locked");
  });

  // The statuses list is what the view draws, so check every field
  it("should give the right status for every location", () => {
    const map = new MapModel(threeLocations, null);
    map.completeLevel(1);
    const statuses = map.getStatuses();

    expect(statuses.length).toBe(3);
    expect(statuses[0]).toEqual({ levelNumber: 1, name: "Pizza Park", unlocked: true, completed: true });
    expect(statuses[1]).toEqual({ levelNumber: 2, name: "Seaside Pier", unlocked: true, completed: false });
    expect(statuses[2]).toEqual({ levelNumber: 3, name: "City Square", unlocked: false, completed: false });
  });

  // getLocation gives back the place with its orders, so the game can start it
  it("should return the location for a level number", () => {
    const map = new MapModel(threeLocations, null);

    expect(map.getLocation(2).name).toBe("Seaside Pier");
    expect(map.getLocation(2).orders.length).toBe(2);
  });

  // Asking about a level that doesn't exist should fail clearly
  it("should reject level numbers that don't exist", () => {
    const map = new MapModel(threeLocations, null);

    expect(() => map.getLocation(0)).toThrow("There is no location for that level");
    expect(() => map.getLocation(4)).toThrow("There is no location for that level");
    expect(() => map.isUnlocked(1.5)).toThrow("There is no location for that level");
  });

  // Passing a level should save the progress number
  it("should save progress when a level is passed", () => {
    const fake = makeFakeStorage(null);
    const map = new MapModel(threeLocations, fake.storage);
    map.completeLevel(1);

    expect(fake.saved()).toBe("1");
  });

  // This is the "remains unlocked after restarting" requirement:
  // a new MapModel (like reopening the game) should load what was saved
  it("should keep unlocked levels after the game is restarted", () => {
    const fake = makeFakeStorage(null);
    const firstVisit = new MapModel(threeLocations, fake.storage);
    firstVisit.completeLevel(1);
    firstVisit.completeLevel(2);

    const secondVisit = new MapModel(threeLocations, fake.storage);

    expect(secondVisit.isUnlocked(3)).toBe(true);
    expect(secondVisit.isCompleted(2)).toBe(true);
  });

  // Broken saved data should be ignored instead of crashing the game
  it("should start fresh if the saved data is broken", () => {
    const map1 = new MapModel(threeLocations, makeFakeStorage("abc").storage);
    const map2 = new MapModel(threeLocations, makeFakeStorage("-2").storage);
    const map3 = new MapModel(threeLocations, makeFakeStorage("1.5").storage);

    expect(map1.isUnlocked(2)).toBe(false);
    expect(map2.isUnlocked(2)).toBe(false);
    expect(map3.isUnlocked(2)).toBe(false);
  });

  // If the save says more levels were passed than exist, cap it at the last level
  it("should cap saved progress at the number of locations", () => {
    const map = new MapModel(threeLocations, makeFakeStorage("10").storage);

    expect(map.isCompleted(3)).toBe(true);
  });

  // If storage throws (like a browser in private mode), the map still works
  it("should still work if storage throws errors", () => {
    const brokenStorage: SaveStorage = {
      getItem: function (key: string): string | null { throw new Error("blocked"); },
      setItem: function (key: string, value: string): void { throw new Error("blocked"); },
    };
    const map = new MapModel(threeLocations, brokenStorage);
    map.completeLevel(1);

    expect(map.isUnlocked(2)).toBe(true);
  });

  // resetProgress locks everything except level 1 and saves that
  it("should lock everything again after a reset", () => {
    const fake = makeFakeStorage("2");
    const map = new MapModel(threeLocations, fake.storage);
    map.resetProgress();

    expect(map.isUnlocked(2)).toBe(false);
    expect(fake.saved()).toBe("0");
  });

  // Bad setups should fail right away
  it("should reject an empty map or levels that are out of order", () => {
    const outOfOrder = [threeLocations[1], threeLocations[0]];

    expect(() => new MapModel([], null)).toThrow("The map needs at least one location");
    expect(() => new MapModel(outOfOrder, null)).toThrow("Locations must be numbered 1, 2, 3... in order");
  });

  // The real game's location list should be valid too
  it("should accept the real game locations", () => {
    const map = new MapModel(MAP_LOCATIONS, null);

    expect(map.getStatuses().length).toBe(MAP_LOCATIONS.length);
    expect(map.isUnlocked(1)).toBe(true);
  });
});
