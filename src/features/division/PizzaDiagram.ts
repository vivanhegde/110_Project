// SVG diagrams follow PlateView's palette and ExplanationView's rendering approach.
const SVG_NAMESPACE = "http://www.w3.org/2000/svg";

function svgElement<K extends keyof SVGElementTagNameMap>(
  tag: K, attributes: Record<string, string | number>,
): SVGElementTagNameMap[K] {
  const element = document.createElementNS(SVG_NAMESPACE, tag);
  for (const [key, value] of Object.entries(attributes)) {
    element.setAttribute(key, String(value));
  }
  return element;
}

function wedgePath(radius: number, start: number, end: number): string {
  const x = (angle: number) => 120 + radius * Math.cos(angle);
  const y = (angle: number) => 120 + radius * Math.sin(angle);
  // Two arcs are needed for a whole pizza: one SVG arc cannot close a circle.
  if (end - start >= Math.PI * 2 - 0.000001) {
    const middle = start + Math.PI;
    return `M ${x(start)} ${y(start)} A ${radius} ${radius} 0 1 1 ${x(middle)} ${y(middle)} ` +
      `A ${radius} ${radius} 0 1 1 ${x(end)} ${y(end)} Z`;
  }
  return `M 120 120 L ${x(start)} ${y(start)} ` +
    `A ${radius} ${radius} 0 ${end - start > Math.PI ? 1 : 0} 1 ${x(end)} ${y(end)} Z`;
}

export function createPizzaDiagram(
  denominator: number, slices: number, served: number, label: string,
  supply: boolean = false,
): SVGSVGElement {
  const pizza = svgElement("svg", { viewBox: "0 0 240 240", role: "img", "aria-label": label });
  pizza.classList.add("division-pizza-diagram");
  pizza.append(
    svgElement("circle", { cx: 120, cy: 120, r: 116, fill: "#FFF8EC", stroke: "#EADBC8", "stroke-width": 3 }),
    svgElement("circle", { cx: 120, cy: 120, r: 108, fill: "#FFF8EC", stroke: "#EADBC8", "stroke-width": 3 }),
  );

  for (let index = 0; index < slices; index++) {
    const start = index * 2 * Math.PI / denominator - Math.PI / 2;
    const end = (index + 1) * 2 * Math.PI / denominator - Math.PI / 2;
    const slice = svgElement("g", {});
    if (supply) slice.classList.add("division-slice");
    if (index < served) slice.classList.add("served");
    slice.append(
      svgElement("path", { d: wedgePath(94, start, end), fill: "#C8803F", stroke: "#FFF8EC", "stroke-width": 3 }),
      svgElement("path", { d: wedgePath(94 * 0.88, start, end), fill: "#FFD66B" }),
    );
    for (const [fraction, distance, radius] of [[1 / 3, 0.7, 0.04], [1 / 2, 0.55, 0.07]]) {
      const angle = start + (end - start) * fraction;
      slice.appendChild(svgElement("circle", {
        cx: 120 + Math.cos(angle) * 94 * distance,
        cy: 120 + Math.sin(angle) * 94 * distance,
        r: 94 * radius, fill: "#D9453B", stroke: "#AD3426", "stroke-width": 1,
      }));
    }
    pizza.appendChild(slice);
  }
  return pizza;
}
