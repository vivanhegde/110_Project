# Fraction Food Truck: User Stories and Sprint Planning

## Project Overview

Fraction Food Truck is an educational game designed to help fifth grade students practice fractions through food related activities.

Students work at a food truck, complete customer pizza orders involving fractions, earn points, and progress through levels. Teachers will later be able to customize the types of fraction problems students receive.

This document outlines our user stories and sprint plan. Each story lists the mockup screens that show its normal and unsuccessful paths. Estimates and priorities may change as our team begins developing the game.

**UI mockups:** [https://www.figma.com/proto/J72baZYGWy1cVLZNnuiTNr/Project--Design-Mockup?node-id=3-18136&t=zEfVYM2Ka2LxYDEH-1&scaling=min-zoom&content-scaling=fixed&page-id=0%3A1]

### Mockup Screen Index

| Screen | Description |
|---|---|
| 1 | Starting page |
| 2 | New addition order |
| 3 | Dragging a slice onto the order plate |
| 4 | Incorrect answer (too few slices) |
| 5 | Head Chef hint and addition of fraction |
| 6 | Correct addition order and slices|
| 7 | New subtraction order |
| 8 | Correct subtraction order |
| 9 | Level complete |

---

# Sprint 1: Basic Pizza Ordering Game

**Sprint Goal:** Create a playable fraction game where students build pizza orders by dragging slices, receive feedback, and complete a five order level.

Stories are listed in priority order. Each completed story adds a working, testable feature that can be demonstrated.

## Story 1: Build Pizza Orders Visually

**Priority:** 1 (High)
**Estimated Hours:** ~20-22
**Mockups:** Screens 2, 3

**User Story:**
As a student, I want to drag pizza slices onto an order plate so that I can see the fractions in a customer's order.

**Acceptance Criteria:**
- A customer order displays two fractions with the same denominator.
- Denominators range from 2 to 12.
- Students drag one slice at a time from the slice tray onto the order plate.
- Students can drag a slice back off the plate.
- A slice dropped outside the plate returns to the slice tray.
- The "On your plate" fraction updates after every move.
- The plate resets when a new order begins.

**Tasks:**

| Task | Estimated Hours |
|---|---:|
| Create pizza and slice visuals | ~2 |
| Implement drag and drop between the slice tray and order plate | ~4 |
| Track slices on the plate and update the fraction counter | ~5 |
| Write tests for adding, removing, and dropping slices | ~2 |
| Run tests, debug, and verify drag and drop behavior | ~2 |
| **Total** | **15** |

## Story 2: Answer Pizza Orders

**Priority:** 2 (High)
**Estimated Hours:** 22
**Mockups:** Screens 1, 2, 5

**User Story:**
As a student, I want to fill customer pizza orders involving fractions so that I can practice adding fractions while playing a game.

**Acceptance Criteria:**
- The starting page has a Play button that starts Level 1.
- Each order card shows the customer's name, the request in words, and two fractions with the same denominator.
- The customer's name stays the same on every screen for that order.
- Students answer by placing slices on the plate and pressing Check Order.
- A correct answer shows positive feedback, the completed equation, +100 points, and a Next Order button.
- An incorrect answer shows the amount the student made and the amount the order needs, keeps the score the same, and offers Try Again.

**Tasks:**

| Task | Estimated Hours |
|---|---:|
| Set up the basic game structure and starting page | ~3 |
| Create order data and answer checking | ~5 |
| Build the order card, Check Order button, and feedback states | ~7 |
| Write tests for fraction calculations and answer checking | ~4 |
| Run tests, fix errors, and verify functionality | ~3 |
| **Total** | **22** |

## Story 3: Complete a Two or Five Order or More Level

**Priority:** 3 (High)
**Estimated Hours:** 12
**Mockups:** Screens 2 to 8

**User Story:**
As a student, I want to complete a level containing a few orders so that I can see how well I understand fractions.

**Acceptance Criteria:**
- Each level contains two or five or more orders.
- The header shows the level number, "Order x of 5" or "Order x of 2" etc, a progress bar, and the current score.
- The game records whether each order was correct on the first Check Order.
- Students pass by getting at least y = x - 1 amount of orders correct on the first try. y = the total number of orders
- Students who pass see a results screen with their total score and solved equations, plus a Play Again button.
- Students who do not pass see a results screen with their score and a Retry Level button.
- Play Again and Retry Level reset the score and progress to Order 1.

**Tasks:**

| Task | Estimated Hours |
|---|---:|
| Implement the x amount of order level structure and progress header | ~3 |
| Add point and first try tracking | ~2 |
| Create the level complete and level not passed screens | ~2 |
| Write tests for scoring, passing, and reset | ~3 |
| Run tests, debug, and verify level completion | ~2 |
| **Total** | **12** |

## Story 4: Subtract Fractions

**Priority:** 4 (High)
**Estimated Hours:** 11
**Mockups:** Screens 7, 8

**User Story:**
As a student, I want to complete pizza orders involving subtraction so that I can practice taking away or subtracting fractions.

**Acceptance Criteria:**
- Subtraction orders use fractions with the same denominator.
- The pizza starts with the first amount in the order.
- Students drag slices off the pizza into the slice return plate.
- The "Slices left" fraction updates after every move.
- Check Order marks the remaining amount correct or incorrect, using the same feedback as addition orders.

**Tasks:**

| Task | Estimated Hours |
|---|---:|
| Add subtraction order generation | ~2 |
| Implement removing slices to the slice return plate | ~3 |
| Add subtraction checking and feedback states | ~2 |
| Write tests for subtraction orders and slice removal | ~2 |
| Run tests, debug, and confirm correct results | ~2 |
| **Total** | **11** |

## Story 5: Receive Helpful Hints

**Priority:** 5 (High)
**Estimated Hours:** 17
**Mockups:** Screens 3, 5 ,7

**User Story:**
As a student, I want help from the Head Chef when I am stuck or answer incorrectly so that I can understand my mistakes and try again or prevent me from failing the level or order.

**Acceptance Criteria:**
- A Hint button is available on every order.
- The hint shows the order as a picture equation using pizzas, such as 2/8 + 3/8 = 5/8.
- An incorrect answer explains whether the plate has too few or too many slices.
- Students can attempt the same order again after a hint or an incorrect answer.
- Using a hint does not change the score.
- Closing the hint returns the student to the order with the plate unchanged.
- The game tracks incorrect attempts.
- All feedback uses simple language appropriate for fifth graders.

**Tasks:**

| Task | Estimated Hours |
|---|---:|
| Write hint and feedback text for common fraction mistakes | ~2 |
| Build the hint screen with the picture equation | ~5 |
| Add too few and too many feedback and attempt tracking | ~4 |
| Write tests for hints, feedback, and attempt tracking | ~4 |
| Run tests, debug, and verify feedback | ~2 |
| **Total** | **17** |

## Sprint 1 Summary

| Priority | Story | Estimated Hours | Mockup Screens |
|---:|---|---:|---|
| 1 | Build Pizza Orders Visually | 22 | 2, 3 |
| 2 | Answer Pizza Orders | 22 | 1, 2, 5 |
| 3 | Complete a x Order Level | 12 | 2 to 8 |
| 4 | Subtract Fractions | 11 | 7, 8 |
| 5 | Receive Helpful Hints | 17 | 3, 5, 7 |
| | **Total** | **82** | |

These are initial estimates for team discussion. Our team may adjust the scope based on available time and progress.

---

# Future User Stories

The following stories are planned for later milestones. They are not part of Sprint 1.

| ID | User Story | Priority | Estimated Hours |
|---|---|---|---:|
| US-6 | As a student, I want to see a worked example before a level so that I understand how to solve the problems. | High | 14 |
| US-7 | As a student, I want the game to explain the answer after multiple incorrect attempts so that I can learn from my mistakes. | High | 10 |
| US-8 | As a student, I want to see my progress and earned stars so that I know how well I am doing. | Medium | 10 |
| US-9 | As a student, I want to select unlocked locations on a map so that I can progress through the food truck journey. | Medium | 17 |
| US-10 | As a student, I want to cut pizza into smaller equal slices so that I can understand equivalent fractions. | High | 20 |
| US-11 | As a student, I want to add and subtract fractions with unlike denominators so that I can practice more advanced fraction problems. | High | 17 |
| US-12 | As a student, I want to solve fraction word problems so that I can apply fractions to everyday situations. | Medium | 13 |
| US-13 | As a student, I want to scale recipes using measuring cups so that I can practice multiplying fractions by whole numbers. | Medium | 16 |
| US-14 | As a student, I want to divide food into portions so that I can practice dividing fractions. | Medium | 13 |
| US-15 | As a teacher, I want to select fraction operations and denominators so that students practice topics relevant to my lessons. | Medium | 26 |
| US-16 | As a student, I want pizzas cut into different numbers of slices, from halves to twelfths, so that I can practice fractions with denominators from 2 to 12. | High | 12 |

Additional features, such as dialogue cards, animated explanations, saved progress, and achievements, may be added in later sprints.

---

# Definition of Done

A user story is considered complete when:

1. The feature has been implemented and works as expected.
2. All acceptance criteria have been satisfied.
3. Tests have been written for the feature.
4. Tests have been run, failures have been debugged, and all required tests pass.
5. The feature has been integrated into the project.
6. The feature can be demonstrated to the team or course staff.

## Next Steps

1. Add mockup screens for incorrect subtraction answer and level not passed and for more future features and US
2. Review these stories as a team and confirm estimates and priorities.
3. Assign tasks during sprint planning.
4. Enter the stories and tasks into GitHub Projects as development begins.