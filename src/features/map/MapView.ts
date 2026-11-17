import type { LocationStatus } from "./types";

/*
  MapView

  This class only draws the map screen. It looks like this:

    [ 🍕 Fraction Food Truck                 1 of 3 places completed ]

                         Food Truck Map
          Pick a place to park your food truck...

       (⭐)  - - - - - -  (🚚)  - - - - - -  (🔒)
      Level 1            Level 2            Level 3
     Pizza Park        Seaside Pier       City Square
     Completed            Open              Locked

  Each place is a button. The dashed "road" between them is drawn by CSS.
  The icon shows the state of the place:
    ⭐ = already passed, 🚚 = open (your truck can go here), 🔒 = locked

  It doesn't decide what is locked. It's handed a list of LocationStatus
  objects and draws each one. Locked places get the "locked" class (so CSS can
  gray them out) and are disabled, so they can't be clicked.

  Same idea as LevelView: we build elements with createElement and set the text
  with textContent instead of writing an HTML string.
*/
export class MapView
{
  private container: HTMLElement; // where the whole map gets drawn
  private message: HTMLElement | null = null; // the message line

  public constructor(container: HTMLElement)
  {
    this.container = container;
  }

  // Draws the whole map screen.
  // onSelect is a function given by the controller. When an unlocked place is clicked
  // we call it with that place's level number. The view doesn't start the level.
  public render(statuses: LocationStatus[], onSelect: (levelNumber: number) => void): void
  {
    // Clear whatever was on the screen before (the game or an older map)
    this.container.innerHTML = "";

    const page = document.createElement("div");
    page.className = "map-page";

    page.appendChild(this.createHeader(statuses));

    const main = document.createElement("main");
    main.className = "map-main";

    const title = document.createElement("h1");
    title.className = "map-title";
    title.textContent = "Food Truck Map";

    const subtitle = document.createElement("p");
    subtitle.className = "map-subtitle";
    subtitle.textContent = "Pick a place to park your food truck. Pass a level to unlock the next place!";

    // The board is the light card the road and places sit on
    const board = document.createElement("section");
    board.className = "map-board";

    // An ordered list, because the places go in order along the road
    const list = document.createElement("ol");
    list.className = "map-locations";

    for (let i = 0; i < statuses.length; i++)
    {
      const item = document.createElement("li");
      item.className = "map-stop";
      item.appendChild(this.createLocationButton(statuses[i], onSelect));
      list.appendChild(item);
    }

    board.appendChild(list);

    // Empty at first. showMessage() fills it in.
    const message = document.createElement("p");
    message.className = "map-message";
    this.message = message;

    main.appendChild(title);
    main.appendChild(subtitle);
    main.appendChild(board);
    const divisionLink = document.createElement("a");
    divisionLink.className = "map-division-link";
    divisionLink.href = "?mode=division";
    divisionLink.textContent = "Practice dividing food into equal portions";
    const practice = document.createElement("p");
    practice.appendChild(divisionLink);
    main.appendChild(practice);
    main.appendChild(message);
    page.appendChild(main);

    this.container.appendChild(page);
  }

  // Shows a short message under the map
  public showMessage(text: string): void
  {
    if (this.message !== null)
    {
      this.message.textContent = text;
    }
  }

  // The bar at the top, matching the game's header: logo on the left, progress on the right
  private createHeader(statuses: LocationStatus[]): HTMLElement
  {
    const header = document.createElement("header");
    header.className = "map-header";

    const logo = document.createElement("span");
    logo.className = "map-logo";
    logo.textContent = "🍕 Fraction Food Truck";

    // Count how many places are done, for "1 of 3 places completed"
    let completedCount = 0;
    for (let i = 0; i < statuses.length; i++)
    {
      if (statuses[i].completed)
      {
        completedCount = completedCount + 1;
      }
    }

    const progress = document.createElement("span");
    progress.className = "map-progress";
    progress.textContent = completedCount + " of " + statuses.length + " places completed";

    header.appendChild(logo);
    header.appendChild(progress);
    return header;
  }

  // Makes the button for one place: an icon, "Level 2", the name, and its state
  private createLocationButton(status: LocationStatus, onSelect: (levelNumber: number) => void): HTMLButtonElement
  {
    const button = document.createElement("button");
    button.classList.add("map-location");

    // Pick the state word and icon. Completed is checked first, because a completed place is also unlocked.
    let label = "Locked";
    let icon = "🔒";
    if (status.completed)
    {
      label = "Completed";
      icon = "⭐";
    }
    else if (status.unlocked)
    {
      label = "Open";
      icon = "🚚";
    }

    const iconCircle = document.createElement("span");
    iconCircle.className = "map-icon";
    iconCircle.textContent = icon;

    const level = document.createElement("span");
    level.className = "map-level";
    level.textContent = "Level " + status.levelNumber;

    const name = document.createElement("span");
    name.className = "map-name";
    name.textContent = status.name;

    const state = document.createElement("span");
    state.className = "map-status";
    state.textContent = label;

    button.appendChild(iconCircle);
    button.appendChild(level);
    button.appendChild(name);
    button.appendChild(state);

    // Screen readers read the attributes instead of the emoji, for example "Level 2: Seaside Pier (Open)".
    // Same thing for the tests
    button.setAttribute("aria-label", "Level " + status.levelNumber + ": " + status.name + " (" + label + ")");

    if (status.unlocked)
    {
      button.classList.add("unlocked");

      // Only unlocked places are clickable
      button.addEventListener("click", function ()
      {
        onSelect(status.levelNumber);
      });
    }
    else
    {
      // Locked places are grayed out by CSS and can't be clicked at all
      button.classList.add("locked");
      button.disabled = true;
    }

    if (status.completed)
    {
      button.classList.add("completed");
    }

    return button;
  }
}
