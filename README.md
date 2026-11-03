# Fraction Food Truck

Fraction Food Truck is an educational web game that is designed to help fifth-grade students practice fraction addition and subtraction through interactive pizza orders.

Players help customers complete pizza orders by dragging slices, checking their answers, and receiving feedback. The game also includes worked examples, explanations, scoring, and level progression.

## Features

### Pizza Orders
- Solve fraction addition and subtraction problems.
- Interact with pizza slices through a drag and drop interface.
- Submit answers using the Check Order button.
- Receive feedback on correct and incorrect answers.

### Feedback and Explanations
- Receive feedback after submitting an answer.
- Retry incorrect answers without losing the current order.
- Generate step-by-step explanations after repeated incorrect attempts.

### Worked Examples
- Review guided fraction examples.
- Navigate through instructional steps.
- Access additional help while solving orders.

### Level Progression
- Complete five pizza orders in Level 1.
- Earn points for correctly completed orders.
- Track progress and first-attempt accuracy.
- View final results and restart the level.

## Technology Stack

| Technology | Purpose |
|---|---|
| TypeScript | Application logic and MVC components |
| HTML and CSS | User interface |
| Vite | Development server and frontend build |
| Konva | Interactive pizza graphics and dragging |
| Vitest | Automated unit testing |
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

## How to Play

1. Open the game and review the introductory worked example.
2. Read the customer's pizza order.
3. For addition problems, drag slices onto the plate to create the requested fraction.
4. For subtraction problems, remove slices from the starting pizza.
5. Click **Check Order** to submit an answer.
6. If the answer is incorrect, review the feedback and try again.
7. Continue to the next order after answering correctly.
8. Complete all five orders to view the level results.

Level 1 contains three addition problems and two subtraction problems, all using eighths.

### Scoring and Passing

Each correctly completed order awards 100 points.

A student must answer at least four of the five orders correctly on the first attempt to pass Level 1.

The maximum score is 500 points. A student may earn all 500 points but still fail the level if they required too many retries.

## Game Modes

| Route | Description |
|---|---|
| `/` | Unified game with five orders |
| `/?mode=addition` | Standalone addition practice |
| `/?mode=subtraction` | Standalone subtraction practice |
| `/?mode=demo` | Pizza plate demonstration |

## Project Structure

```text
110_Project/
├── .github/
│   └── workflows/
│       └── ci.yml
├── docs/
│   └── ARCHITECTURE.md
├── src/
│   ├── features/
│   │   ├── pizza/
│   │   ├── plate/
│   │   ├── feedback/
│   │   ├── level/
│   │   ├── workedExamples/
│   │   └── game/
│   ├── shared/
│   └── main.ts
├── tests/
├── index.html
├── package.json
└── tsconfig.json
```

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

The test suite covers fraction validation, pizza interactions, feedback, level progression, worked examples, and feature integration logic.

Manual testing is also necessary to verify the complete drag-and-drop gameplay experience.

## Continuous Integration

The repository uses GitHub Actions to run automated checks.

The workflow is defined in `.github/workflows/ci.yml` and runs on pushes, pull requests, and manual dispatch.

The CI workflow:

1. Checks out the repository.
2. Sets up Node.js 26.
3. Installs dependencies using `npm ci`.
4. Runs automated unit tests using `npm test`.
5. Checks TypeScript using `npx --no-install tsc --noEmit`.
