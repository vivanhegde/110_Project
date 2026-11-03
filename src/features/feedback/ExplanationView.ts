import type { Explanation, PizzaDiagram } from "./Explanation";

/** Render teaching pizzas */
export function renderExplanation(container: HTMLElement, explanation?: Explanation): void {
  container.replaceChildren();
  container.hidden = !explanation;
  if (!explanation) return;

  const heading = document.createElement("h3");
  heading.textContent = "Let's solve it step by step";
  const steps = document.createElement("ol");
  for (const text of explanation.steps) {
    const step = document.createElement("li");
    step.textContent = text;
    steps.append(step);
  }
  const diagrams = document.createElement("div");
  diagrams.className = "explanation-pizzas";
  function renderPizza(pizza: PizzaDiagram): HTMLElement {
    const figure = document.createElement("figure");
    const visual = document.createElement("div");
    visual.className = "explanation-pizza";
    visual.setAttribute("role", "img");
    visual.setAttribute("aria-label", `${pizza.label}: ${pizza.filledSlices} of ${pizza.denominator} equal slices${pizza.fadedSlices ? `; ${pizza.fadedSlices} slices moving, shown faded` : ""}`);
    const degrees = 360 / pizza.denominator;
    const stops = Array.from({ length: pizza.denominator }, (_, index) => {
      const start = index * degrees;
      const end = (index + 1) * degrees;
      const color = index < pizza.filledSlices ? "#f4bd55"
        : index < pizza.filledSlices + (pizza.fadedSlices ?? 0) ? "rgba(244, 189, 85, 0.22)" : "#fff8ec";
      return `${color} ${start}deg ${end}deg`;
    });
    visual.style.background = `conic-gradient(${stops.join(", ")})`;
    const svgNamespace = "http://www.w3.org/2000/svg";
    const dividers = document.createElementNS(svgNamespace, "svg");
    dividers.setAttribute("viewBox", "0 0 120 120");
    dividers.setAttribute("aria-hidden", "true");
    dividers.classList.add("explanation-dividers");
    for (let index = 0; index < pizza.denominator; index++) {
      const angle = index * 2 * Math.PI / pizza.denominator - Math.PI / 2;
      const line = document.createElementNS(svgNamespace, "line");
      line.setAttribute("x1", "60");
      line.setAttribute("y1", "60");
      line.setAttribute("x2", String(60 + 60 * Math.cos(angle)));
      line.setAttribute("y2", String(60 + 60 * Math.sin(angle)));
      line.setAttribute("stroke", "#4a2e1f");
      line.setAttribute("stroke-width", "1");
      line.setAttribute("vector-effect", "non-scaling-stroke");
      dividers.append(line);
    }
    visual.append(dividers);
    const caption = document.createElement("figcaption");
    caption.textContent = pizza.fadedSlices !== undefined
      ? `${pizza.label}: ${pizza.filledSlices}/${pizza.denominator}, ${pizza.fadedSlices} slices moving`
      : `${pizza.label}: ${pizza.filledSlices}/${pizza.denominator}`;
    figure.append(visual, caption);
    return figure;
  }
  if (explanation.rows) {
    diagrams.classList.add("explanation-matrix");
    for (const row of explanation.rows) {
      const section = document.createElement("section");
      section.className = "explanation-row";
      const title = document.createElement("h4");
      title.textContent = row.label;
      const pair = document.createElement("div");
      pair.className = "explanation-pair";
      const operator = document.createElement("span");
      operator.className = "explanation-operator";
      operator.textContent = row.operator;
      if (row.operator) operator.setAttribute("aria-label", "move slices to return plate");
      else operator.setAttribute("aria-hidden", "true");
      pair.append(renderPizza(row.pizzas[0]), operator, renderPizza(row.pizzas[1]));
      section.append(title, pair);
      diagrams.append(section);
    }
  } else {
    for (const pizza of explanation.pizzas) diagrams.append(renderPizza(pizza));
  }
  container.append(heading, steps, diagrams);
}

