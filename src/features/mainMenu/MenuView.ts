/*
  MenuView
  This class only draws the main menu.
  Same style as MapView: we build elements with createElement and set the
  text with textContent instead of writing an HTML string.
*/
export class MenuView
{
  private container: HTMLElement; // where the menu gets drawn

  public constructor(container: HTMLElement)
  {
    this.container = container;
  }

  // Draws the whole menu.
  // totalStars is shown in the top corner so students see how they're doing.
  // onPlay and onProgress are called when those buttons are clicked.
  public render(totalStars: number, onPlay: () => void, onProgress: () => void): void
  {
    // Clear whatever was on the screen before
    this.container.innerHTML = "";

    const page = document.createElement("div");
    page.className = "menu-page";

    page.appendChild(this.createHeader(totalStars));

    const main = document.createElement("main");
    main.className = "menu-main";

    // The big round icon, same style as the places on the map
    const icon = document.createElement("div");
    icon.className = "menu-icon";
    icon.textContent = "🚚";

    const title = document.createElement("h1");
    title.className = "menu-title";
    title.textContent = "Fraction Food Truck";

    const subtitle = document.createElement("p");
    subtitle.className = "menu-subtitle";
    subtitle.textContent = "Help the Head Chef fill pizza orders using fractions!";

    // The light card the buttons sit on
    const card = document.createElement("section");
    card.className = "menu-card";

    const play = document.createElement("button");
    play.className = "menu-button menu-play";
    play.textContent = "Play";
    play.addEventListener("click", onPlay);

    const progress = document.createElement("button");
    progress.className = "menu-button menu-progress";
    progress.textContent = "My Progress";
    progress.addEventListener("click", onProgress);

    card.appendChild(play);
    card.appendChild(progress);

    main.appendChild(icon);
    main.appendChild(title);
    main.appendChild(subtitle);
    main.appendChild(card);

    page.appendChild(main);
    this.container.appendChild(page);
  }

  // The top bar: the game's name on the left and the student's stars on the right
  private createHeader(totalStars: number): HTMLElement
  {
    const header = document.createElement("header");
    header.className = "menu-header";

    const logo = document.createElement("div");
    logo.className = "menu-logo";
    logo.textContent = "🍕 Fraction Food Truck";

    const stars = document.createElement("div");
    stars.className = "menu-stars";
    stars.textContent = "⭐ " + totalStars + (totalStars === 1 ? " star" : " stars");

    header.appendChild(logo);
    header.appendChild(stars);
    return header;
  }
}