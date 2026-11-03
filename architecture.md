# Fraction Food Truck — Architecture Documentation

## 1. Overview

Fraction Food Truck is an interactive educational game that teaches fraction addition and subtraction using pizza slices.

The application is written in TypeScript and uses the MVC architecture. Each major feature is organized into separate components so that the team can develop, test, and maintain features independently.

## 2. MVC Architecture

### Model

Models store information and implement business rules.

Examples include:
- `PizzaOrderModel`: Stores fraction orders and validates selections.
- `PlateModel`: Stores the current state of the pizza plate.
- `FeedbackModel`: Tracks incorrect attempts and produces feedback.
- `LevelModel`: Stores score, progress, and completion records.
- `WorkedExampleModel`: Stores instructional examples and their steps.

### View

Views display information to players.

Examples include:
- `PizzaOrderView`: Displays customer requests and controls.
- `PlateView`: Renders and manages graphical pizza elements using Konva.
- `FeedbackView`: Provides feedback display functionality.
- `LevelView`: Displays level progress and final results.
- `WorkedExampleView`: Displays step by step examples.

### Controller

Controllers coordinate application behavior.

Examples include:
- `PizzaOrderController`: Validates submitted pizza-order selections.
- `PlateController`: Handles pizza slice interactions.
- `FeedbackController`: Manages feedback and incorrect attempts.
- `LevelController`: Coordinates scoring and progression.
- `WorkedExampleController`: Handles navigation through example steps.

## 3. Feature Organization

### Pizza Order Feature

Location: `src/features/pizza/`

Responsible for:
- Representing pizza orders.
- Validating addition and subtraction answers through the appropriate order logic.
- Displaying customer requests.
- Providing standalone addition and subtraction gameplay modes.

Important files:
- `PizzaOrderModel.ts`
- `PizzaOrderController.ts`
- `PizzaOrderView.ts`
- `SubtractionOrderModel.ts`
- `AdditionGame.ts`
- `SubtractionGame.ts`

### Plate Feature

Location: `src/features/plate/`

Responsible for:
- Maintaining the state of pizza slices.
- Allowing users to move slices between areas.
- Updating the fraction displayed on the plate.
- Providing reusable interaction logic for addition and subtraction.

Important files:
- `PlateModel.ts`
- `PlateController.ts`
- `PlateView.ts`

### Feedback and Explanation Feature

Location: `src/features/feedback/`

Responsible for:
- Creating correct and incorrect answer feedback.
- Tracking incorrect attempts.
- Providing retry information.
- Generating detailed explanations after repeated incorrect answers.

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
- Managing the active order.
- Tracking the total score.
- Recording first-attempt accuracy.
- Determining whether the level is passed.
- Displaying level results and supporting restart.

Important files:
- `LevelModel.ts`
- `LevelController.ts`
- `LevelView.ts`

### Worked Examples Feature

Location: `src/features/workedExamples/`

Responsible for:
- Storing guided example steps.
- Allowing users to navigate explanations.
- Supporting introductory instruction and additional help.

Important files:
- `WorkedExampleModel.ts`
- `WorkedExampleController.ts`
- `WorkedExampleView.ts`

## 4. Unified Gameplay

Location: `src/features/game/`

The unified game brings the individual features together.

Important files:
- `GameScreen.ts`
- `GameScreen.css`
- `orders.ts`

`orders.ts` defines the five Level 1 orders.

`GameScreen.ts` acts as the central coordinator. It initializes the feature components, responds to game events, and connects the player's actions to level progression.

### Gameplay Flow

```text
Start Game
    |
    v
Worked Example
    |
    v
Display Customer Order
    |
    v
Player Moves Pizza Slices
    |
    v
Check Order
    |
    v
Validate Answer
    |
    +-- Incorrect --> Feedback --> Retry
    |                                 |
    |                                 v
    |                         Check Order Again
    |
    +-- Correct --> Award Points
                        |
                        v
                 Update Level Progress
                        |
                        v
                   More Orders?
                    /      \
                  Yes       No
                   |         |
                   v         v
              Next Order   Results
```

### Example: Addition Order

For a customer ordering 2/8 + 3/8:

1. The level provides the active order.
2. `PizzaOrderView` displays the request.
3. `PlateView` displays draggable pizza slices.
4. The player places slices on the plate.
5. `PlateController` provides the selected slice count.
6. The pizza-order logic validates the answer.
7. `FeedbackController` produces feedback.
8. After a correct answer, `LevelController` records progress.

### Example: Subtraction Order

For a customer ordering 6/8 − 2/8:

1. The level provides the subtraction order.
2. The plate begins with six slices.
3. The player moves two slices away.
4. The remaining slice count is checked.
5. Feedback is generated.
6. The level advances after a correct answer.

## 5. Important Design Decisions

### Separation of Concerns

The MVC architecture separates fraction calculations, user interactions, and display logic. This allows models and controllers to be unit-tested without requiring the full frontend.

### Reusing the Plate Component

The same Plate feature supports both addition and subtraction. This avoids maintaining separate drag-and-drop systems for each type of problem.

### Centralized Level Progression

The Level feature manages the overall score, active order, and completion rules. This helps avoid duplicating scoring and progression logic across gameplay modes.

### Shared Gameplay Coordinator

`GameScreen.ts` connects existing components rather than replacing their individual implementations.

This makes it easier to integrate features developed by different team members.

## 6. Testing Strategy

The project uses Vitest for automated testing.

Tests are organized in the `tests/` directory.

Important areas covered include:

- Pizza-order input validation.
- Correct and incorrect answer handling.
- Pizza slice selection and plate state.
- Subtraction calculations.
- Feedback and incorrect-attempt tracking.
- Level scoring and progression.
- Worked-example navigation.
- Cross-feature game logic.

### Unit Testing

Unit tests verify individual model and controller behavior.

Run with:

```bash
npm test
```

### Type Checking

TypeScript catches incompatible types and invalid API usage.

Run with:

```bash
npx tsc --noEmit
```

### Manual Integration Testing

Manual tests are used to evaluate interactions that unit tests cannot fully verify, such as:

- Dragging pizza slices.
- Navigating worked examples.
- Displaying feedback and explanations.
- Moving between orders.
- Displaying final level results.
- Restarting a level.

## 7. Continuous Integration

GitHub Actions runs automated checks on the repository.

Workflow file:

`.github/workflows/ci.yml`

The workflow installs dependencies, runs unit tests, and performs TypeScript type checking.

This helps identify integration problems before changes are merged.

## 8. Future Improvements

Potential future development includes:

- Addition and subtraction with different denominators.
- Additional levels and more difficult problems.
- Expanded feedback and hint systems.
- More complete browser-based integration testing.
- Usability testing with the intended fifth-grade audience.
- Refactoring the unified coordinator as the application grows.

These improvements are outside the current Sprint 1 scope.

## 9. Conclusion

The project uses MVC to keep fraction logic, interaction behavior, and presentation separate.

By organizing features into independent components and coordinating them through `GameScreen`, the team can develop and test user stories independently while still providing a shared gameplay experience.