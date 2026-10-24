const app = document.getElementById("app");

if (!app) {
  throw new Error("App container not found");
}

app.innerHTML = `
  <h1>Fraction Food Truck</h1>
  <p>Welcome to the pizza fraction game!</p>
`;
