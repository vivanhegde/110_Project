# Fraction Food Truck — Architecture Documentation

## 1. Overview

Fraction Food Truck is an interactive educational game designed to help fifth-grade students practice fraction arithmetic through visual, food-themed activities.

The application is developed using TypeScript and follows the Model-View-Controller (MVC) architecture. Each major feature is organized into separate components so team members can develop, test, and maintain features independently.

During Sprint 2, the project expanded beyond basic fraction addition and subtraction to include pizza cutting, unlike-denominator problems, recipe scaling, word problems, an interactive level map, and student progress tracking.

## 2. MVC Architecture

The project follows the MVC design pattern to separate application state, user interface rendering, and interaction logic.

### Model

Models store application state, perform calculations, and implement business rules.

Examples include:

- `PizzaOrderModel`: Stores fraction orders and validates answers.
- `PlateModel`: Maintains the current state of the pizza plate.
- `FeedbackModel`: Tracks incorrect attempts and generates feedback.
- `LevelModel`: Tracks scoring, progress, and level completion.
- `WorkedExampleModel`: Stores instructional examples.
- `MapModel`: Manages level unlocking and saved progression.
- `RecipeModel`: Tracks ingredient measurements and validates recipe scaling.

### View

Views display information and allow players to interact with the application.

Examples include:

- `PizzaOrderView`: Displays customer orders and gameplay controls.
- `PlateView`: Renders interactive pizza slices using Konva.
- `FeedbackView`: Displays answer feedback.
- `LevelView`: Displays progress, scores, and results.
- `WorkedExampleView`: Displays guided instructional examples.
- `MapView`: Displays available, completed, and locked locations.
- `RecipeView`: Displays the recipe-scaling interface and measuring cups.

### Controller

Controllers coordinate user interactions and communicate between models and views.

Examples include:

- `PizzaOrderController`: Handles pizza-order submissions.
- `PlateController`: Manages pizza slice interactions.
- `FeedbackController`: Coordinates feedback and incorrect-attempt tracking.
- `LevelController`: Manages scoring and level progression.
- `WorkedExampleController`: Handles instructional navigation.
- `MapController`: Coordinates level selection and unlocking.
- `RecipeController`: Processes recipe-scaling interactions.

This separation allows components to be developed independently while maintaining a consistent application structure.

## 3. Feature Organization

### Pizza Order Feature

Location: `src/features/pizza/`

Responsible for:

- Generating and displaying fraction orders.
- Validating addition and subtraction answers.
- Supporting interactive pizza gameplay.
- Providing standalone addition and subtraction practice.

Important files:

- `PizzaOrderModel.ts`
- `PizzaOrderController.ts`
- `PizzaOrderView.ts`
- `SubtractionOrderModel.ts`
- `AdditionGame.ts`
- `SubtractionGame.ts`

### Plate and Pizza Cutting Feature

Location: `src/features/plate/`

Responsible for:

- Maintaining pizza slice state.
- Supporting drag-and-drop interactions.
- Updating the displayed fraction.
- Providing reusable pizza interactions.
- Allowing students to cut pizzas into smaller equal slices.
- Validating equivalent fractions after cutting.

Important files:

- `PlateModel.ts`
- `PlateController.ts`
- `PlateView.ts`
- `cuttingGame.ts`

The pizza cutting feature, introduced during Sprint 2 as US-10, builds on the existing plate system. Students can change the denominator by dividing a pizza into equal slices and then construct an equivalent fraction.

### Feedback and Explanation Feature

Location: `src/features/feedback/`

Responsible for:

- Displaying correct and incorrect answer feedback.
- Tracking incorrect attempts.
- Providing retry functionality.
- Generating detailed explanations after repeated incorrect answers.
- Supporting educational hints.

Important files:

- `FeedbackModel.ts`
- `FeedbackController.ts`
- `FeedbackView.ts`
- `Explanation.ts`
- `ExplanationView.ts`
- `SubtractionFeedbackView.ts`

### Level Feature

Location: `src/features/level/`

Responsible for:

- Managing the current order.
- Tracking total scores.
- Recording first-attempt accuracy.
- Determining level completion.
- Displaying results and restart options.

Important files:

- `LevelModel.ts`
- `LevelController.ts`
- `LevelView.ts`

### Worked Examples Feature

Location: `src/features/workedExamples/`

Responsible for:

- Storing guided instructional examples.
- Displaying step-by-step explanations.
- Supporting navigation between instructional steps.
- Providing additional help when students need it.

Important files:

- `WorkedExampleModel.ts`
- `WorkedExampleController.ts`
- `WorkedExampleView.ts`

### Map and Level Unlocking Feature 

Location: `src/features/map/`

Responsible for:

- Displaying an interactive food truck map.
- Representing different locations as levels.
- Distinguishing completed, unlocked, and locked levels.
- Unlocking additional locations when the player passes a level.
- Saving progression using browser local storage.

Important files:

- `MapModel.ts`
- `MapView.ts`
- `MapController.ts`
- `MapScreen.ts`

The map provides a progression interface for the game. Players can select available locations, while locked locations remain inaccessible until the required progression conditions are satisfied.

### Unlike-Denominator Practice 

Location: `src/features/pizza/`

Responsible for:

- Generating addition and subtraction problems with different denominators.
- Supporting common denominators up to 12.
- Providing hints for finding common denominators.
- Displaying equivalent fraction representations.
- Reusing interactive pizza slices and feedback components.
- Supporting retries, resets, and additional orders.

Important file:

- `UnlikeDenominatorGame.ts`

This feature reuses existing pizza interactions to teach more advanced fraction operations without requiring an entirely separate interaction system.

The current implementation can be accessed through a standalone practice route. Integrating it into the main level progression system is a future development task.

### Recipe Scaling Feature 

Location: `src/features/recipe/`

Responsible for:

- Displaying recipes with fractional ingredient quantities.
- Allowing students to scale recipes by whole-number multipliers.
- Supporting interactive measuring-cup operations.
- Calculating expected ingredient amounts.
- Validating answers and generating feedback or hints.

Important files:

- `RecipeModel.ts`
- `RecipeController.ts`
- `RecipeView.ts`
- `RecipeGame.ts`

This feature uses MVC to separate mathematical calculations from visual interactions.

### Fraction Word Problems 

Responsible for:

- Presenting real-world, food-related fraction problems.
- Supporting addition and subtraction.
- Validating student responses.
- Accepting equivalent fractions where appropriate.
- Providing hints to help students solve problems.

This feature expands the game's educational content by allowing students to apply fraction concepts to written scenarios.

### Progress and Stars Feature 

Responsible for:

- Supporting student progress tracking.
- Representing earned stars.
- Providing components for displaying progress and achievement information.

The feature uses MVC components and is intended to complement the existing level results and progression system.

Further integration with the overall gameplay interface remains part of future development.

## 4. Unified Gameplay and Navigation

Location: `src/features/game/`

Important files:

- `GameScreen.ts`
- `GameScreen.css`
- `orders.ts`

`GameScreen.ts` coordinates the core gameplay components, including pizza interactions, answer validation, feedback, and level progression.

`orders.ts` defines the five Level 1 orders.

### Application Entry Point

The application entry point is `src/main.ts`.

It determines which screen or practice mode to display based on URL parameters.

Current supported routes include:

| Route | Function |
|---|---|
| `/` | Opens the food truck map |
| `/?mode=game` | Opens Level 1 directly |
| `/?mode=addition` | Opens addition practice |
| `/?mode=subtraction` | Opens subtraction practice |
| `/?mode=cutting` | Opens pizza cutting practice |
| `/?mode=recipe` | Opens recipe scaling |
| `/?practice=unlike` | Opens unlike-denominator practice |
| `/?mode=demo` | Opens the pizza plate demonstration |

Some Sprint 2 features currently operate as standalone practice modes rather than being fully integrated into the main level sequence.

### Gameplay Flow

```text
Start Application
       |
       v
Food Truck Map
       |
       v
Select Unlocked Level
       |
       v
Worked Example
       |
       v
Display Customer Order
       |
       v
Player Interacts with Pizza
       |
       v
Submit Answer
       |
       v
Validate Answer
       |
       +-- Incorrect --> Feedback --> Retry
       |
       +-- Correct --> Update Score
                              |
                              v
                        Next Order?
                         /      \
                       Yes       No
                        |         |
                        v         v
                   Next Order   Results
                                    |
                                    v
                            Evaluate Level Pass
                                    |
                                    v
                            Unlock Next Location
                                    |
                                    v
                               Return to Map
```

This diagram represents the intended overall progression architecture. Some navigation and activity integrations are still being completed.

## 5. Important Design Decisions

### Separation of Concerns

Using MVC keeps mathematical calculations separate from interface rendering and user interaction logic. This allows models and controllers to be tested independently.

### Reusing Existing Components

Several Sprint 2 features build on functionality implemented during Sprint 1.

For example, unlike-denominator practice reuses the pizza plate, drag-and-drop interactions, and feedback systems. Pizza cutting also builds on the existing plate architecture.

This reduces duplicated code and makes it easier to maintain consistent behavior.

### Modular Feature Development

Each feature is organized into its own module or feature directory.

This allows team members to develop different user stories independently and integrate functionality without rewriting the entire application.

### Centralized Gameplay Coordination

`GameScreen.ts` coordinates the main Level 1 experience, while `src/main.ts` handles routing between the map and standalone activity modes.

This separation avoids placing all gameplay functionality inside a single file.

### Persistent Level Progression

The map feature uses browser local storage to preserve unlocked locations.

This allows students to retain their progress when they reload or revisit the game in the same browser.

### Incremental Integration

New features can first be developed and tested independently before being connected to the full level progression system.

This approach helps isolate bugs and allows the team to validate individual components before completing broader integrations.

## 6. Testing Strategy

The project uses Vitest for automated testing.

Tests are organized primarily in the `tests/` directory.

Important testing areas include:

- Pizza order validation.
- Addition and subtraction calculations.
- Plate state and slice interactions.
- Answer feedback and incorrect-attempt tracking.
- Level scoring and progression.
- Worked-example navigation.
- Pizza cutting and equivalent fractions.
- Unlike-denominator operations.
- Recipe scaling calculations.
- Map unlocking and progression logic.
- Cross-feature integration behavior.

### Unit Testing

Unit tests verify individual models, controllers, and other application logic.

Run with:

```bash
npm test
```

### Type Checking

TypeScript helps detect incompatible data types and incorrect API usage.

Run with:

```bash
npx tsc --noEmit
```

### Manual Integration Testing

Manual testing is used for interactions that require visual or user-level verification, including:

- Dragging pizza slices between containers.
- Cutting pizzas into equal slices.
- Switching between game modes.
- Completing fraction orders.
- Displaying feedback and explanations.
- Selecting map locations.
- Checking level unlocking.
- Navigating between activities.
- Verifying responsive and consistent interfaces.

As the application grows, additional integration and browser-based tests will help verify that independently developed features work correctly together.

## 7. Continuous Integration

The project uses GitHub Actions to automatically validate code changes.

Workflow file:

`.github/workflows/ci.yml`

The workflow runs on pushes, pull requests, and manual dispatch.

It performs the following steps:

1. Checks out the repository.
2. Configures Node.js.
3. Installs dependencies using `npm ci`.
4. Runs automated unit tests using `npm test`.
5. Performs TypeScript checking using `npx --no-install tsc --noEmit`.

This provides a consistent way to identify unit-test failures and TypeScript errors during development.

CI workflow:

https://github.com/vivanhegde/110_Project/actions

