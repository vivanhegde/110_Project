# Fraction Food Truck

Fraction Food Truck is an educational web game that helps fifth-grade students practice fractions through food truck orders.

Students drive a food truck across a map of locations. At each location they fill customer pizza orders by moving slices, checking their answers, and getting feedback. Passing a level unlocks the next location and earns stars. Separate practice modes cover unlike denominators, cutting pizzas into equal slices, scaling recipes, and dividing food into equal portions.

## Features

### Main Menu and Progress
- The game opens on a main menu that shows the student's total stars.
- **Play** opens the food truck map.
- **My Progress** shows the stars earned on each level.

### Food Truck Map
- The map shows three locations: Pizza Park (Level 1), Seaside Pier (Level 2), and City Square (Level 3).
- Each location is shown as Completed, Open, or Locked.
- Only open and completed locations can be played. Locked locations unlock one at a time as levels are passed.
- Map progress is saved in the browser, so it is kept after closing the game.
- **Back to Menu** returns to the main menu.

### Pizza Orders
- Solve fraction addition and subtraction problems.
- Move pizza slices with a drag and drop interface.
- Submit answers with the **Check Order** button.
- Get feedback on correct and incorrect answers.

### Feedback, Hints, and Explanations
- Retry incorrect answers without losing the current order.
- Get a step-by-step explanation after repeated incorrect attempts.
- Use **Hint** to open a worked example (or a written hint on word problems).

### Worked Examples
- A guided example is shown before Levels 1 and 2 start.
- Step through the example one instruction at a time.

### Word Problems
- Level 3 (City Square) uses food-related word problems, such as sharing a pizza or a cake.
- Students read the problem and use the pizza slices to solve it.

### Levels, Scoring, and Stars
- Each level has five orders.
- Each correct order earns 100 points, even after a retry.
- The header shows the level number, the current order, a progress bar, and the score.
- The results screen shows the score, the solved equations, and the stars earned. It offers **Play Again** (or **Retry Level** if the level was not passed) and **Back to Map**.

## Technology Stack

| Technology | Purpose |
|---|---|
| TypeScript | Application logic and MVC components |
| HTML and CSS | User interface |
| Vite | Development server and frontend build |
| Konva | Interactive pizza graphics and dragging |
| Vitest and jsdom | Automated unit and integration testing |
| localStorage | Saving map unlocks and stars in the browser |
| GitHub Actions | Continuous integration |

## Installation

### Requirements

- Node.js 26
- npm
- A modern web browser

### Setup

Clone the repository:

```bash
git clone https://github.com/vivanhegde/110_Project.git
cd 110_Project
```

Install dependencies:

```bash
npm ci
```

Start the development server:

```bash
npx vite
```

Open the local URL printed in the terminal, usually:

http://localhost:5173/

Press `Control + C` in the terminal to stop the server.

## How to Play

1. Open the game and click **Play** on the main menu.
2. Pick an open location on the food truck map. At the start only Pizza Park is open.
3. Review the worked example, then read the customer's order.
4. For addition orders, drag slices onto the plate to make the requested fraction.
5. For subtraction orders, drag slices off the starting pizza onto the return plate.
6. Click **Check Order**. If the answer is wrong, read the feedback and try again.
7. After a correct answer, click **Next Order**.
8. After all five orders, the results screen shows your score and stars.
9. If you passed, click **Back to Map** to see the next location unlocked.

### Levels

| Level | Location | Orders |
|---|---|---|
| 1 | Pizza Park | 3 addition and 2 subtraction orders, all in eighths |
| 2 | Seaside Pier | 3 addition and 2 subtraction orders, all in eighths |
| 3 | City Square | 5 word problems with denominators of 4, 6, and 8 |

### Passing and Stars

A student passes a level by answering all but one of the orders correctly on the first try (four out of five).

Score and passing are separate. A student can earn all 500 points and still not pass if they needed too many retries.

| Stars | How to earn them |
|---|---|
| ⭐⭐⭐ | Every order correct on the first try |
| ⭐⭐ | Passed the level |
| ⭐ | Finished the level without passing |

### Resetting Saved Progress

Map unlocks and stars are saved in the browser's localStorage. To start over, open the browser's developer tools, go to the Console, and run:

```js
localStorage.clear()
```

Then reload the page.

## Game Modes

The main game starts from the main menu. Each route below can also be opened directly by adding it to the local URL.

| Route | Description |
|---|---|
| `/` | Main menu (Play opens the map, My Progress shows stars) |
| `/?mode=map` | Food truck map, skipping the main menu |
| `/?mode=game` | Level 1, skipping the menu and the map |
| `/?mode=progress` | My Progress screen |
| `/?mode=addition` | Standalone addition practice |
| `/?mode=subtraction` | Standalone subtraction practice |
| `/?practice=unlike` | Adding and subtracting fractions with unlike denominators |
| `/?mode=cutting` | Cutting pizzas into smaller equal slices |
| `/?mode=recipe` | Scaling recipes with measuring cups (multiplying a fraction by a whole number) |
| `/?mode=division` | Dividing food into equal portions, with feedback and hints |
| `/?mode=demo` | Pizza plate demonstration |
| `/division.html` | Standalone page that loads only the division feature |

### Division Practice

Division practice is also linked from the food truck map. It does not change map unlocks or stars.

1. Read the total amount of pizza and the portion size.
2. Use **Make a Portion**, or click a pizza, to serve one portion.
3. Click a portion or **Return a Portion** to undo it.
4. Click **Check Order** to submit the number of portions. A wrong answer gives a grouping hint, and **Hint** gives help before submitting.
5. Finish all six orders, or use **Play Again** for new orders.

Problems start with whole numbers divided by unit fractions and move on to fractions divided by unit fractions. Every answer is a whole number of portions from 1 to 12.

## Project Structure

```text
110_Project/
├── .github/
│   └── workflows/
│       └── ci.yml            # CI: tests and TypeScript check
├── docs/
│   └── division/             # Division feature architecture and notes
├── src/
│   ├── features/
│   │   ├── mainMenu/         # Main menu (Play, My Progress)
│   │   ├── map/              # Food truck map and level unlocking
│   │   ├── game/             # GameScreen: connects all parts of a level
│   │   ├── level/            # Level order sequence, score, and passing
│   │   ├── pizza/            # Pizza orders, addition, subtraction, unlike denominators
│   │   ├── plate/            # Drag and drop plate and pizza cutting
│   │   ├── feedback/         # Feedback, attempt tracking, explanations
│   │   ├── workedExamples/   # Step-by-step worked examples
│   │   ├── wordProblems/     # Word problems used in Level 3
│   │   ├── progressStars/    # Stars and the My Progress screen
│   │   ├── recipe/           # Recipe scaling practice
│   │   └── division/         # Division into equal portions
│   ├── shared/               # Shared fraction helpers
│   └── main.ts               # Entry point that picks the screen from the URL
├── tests/                    # Vitest unit and integration tests
├── architecture.md           # Architecture and design decisions
├── stories.md                # User stories and sprint plans
├── division.html
├── index.html
├── package.json
└── tsconfig.json
```

Each feature follows the MVC pattern: models hold the rules and data, views only draw the screen, and controllers connect the two. See `architecture.md` for details.

## Running Tests

Run the complete automated test suite:

```bash
npm test
```

Run tests in watch mode:

```bash
npm run test:watch
```

Check TypeScript:

```bash
npx tsc --noEmit
```

Check the frontend build:

```bash
npx vite build
```

The tests cover every feature's models, controllers, and views, including fraction checking, slice movement, feedback, level scoring and passing, worked examples, map unlocking and saving, stars, word problems, recipes, and division. Tests that build the page use jsdom, so they need `// @vitest-environment jsdom` at the top of the file.

Manual testing is still needed to check the full drag and drop gameplay in a browser.

## Continuous Integration

The repository uses GitHub Actions to run automated checks.

The workflow is defined in `.github/workflows/ci.yml` and runs on pushes, pull requests, and manual dispatch.

The CI workflow:

1. Checks out the repository.
2. Sets up Node.js 26.
3. Installs dependencies using `npm ci`.
4. Runs the automated tests using `npm test`.
5. Checks TypeScript using `npx --no-install tsc --noEmit`.
