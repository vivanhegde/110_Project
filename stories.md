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
- Students pass by getting at least x - 1 amount of orders correct on the first try. x = the total number of orders
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

# Sprint 1 Results

All five Sprint 1 stories were completed, along with US-6 and US-7, which were pulled in from the backlog during the sprint. Each story was merged through a reviewed pull request.

| ID | Story | Pull Requests | Status |
|---|---|---|---|
| US-1 | Answer Pizza Orders | #17, #24 | Done |
| US-2 | Build Pizza Orders Visually | #19 | Done |
| US-3 | Complete a Two or Five Order or More Level | #21 | Done |
| US-4 | Subtract Fractions | #20 | Done |
| US-5 | Receive Helpful Hints | #18, #25 | Done |
| US-6 | View Worked Examples Before a Level | #22 | Done |
| US-7 | Receive Detailed Explanations After Incorrect Attempts | #23 | Done |

At the end of the sprint, all features were joined into one game screen (#26) so a level uses the pizza, plate, feedback, worked example, and level parts together.

---

# Sprint 2: Progression and New Fraction Topics

**Sprint Goal:** Give students a reason to keep playing (a map of locations, stars, and saved progress) and add new fraction topics beyond adding and subtracting like denominators.

The full acceptance criteria and task lists for each story are in its GitHub issue.

## US-8: View Progress and Earned Stars

**Priority:** Medium
**Estimated Hours:** 10

**User Story:**
As a student, I want to see my progress and earned stars so that I know how well I am doing.

**What was delivered:**
- Finishing a level earns 1 to 3 stars: 3 for every order correct on the first try, 2 for passing, and 1 for finishing without passing.
- Stars are shown on the results screen and saved in the browser.
- A My Progress screen lists the stars earned on each level.

## US-9: Select Unlocked Locations on a Map

**Priority:** Medium
**Estimated Hours:** 17

**User Story:**
As a student, I want to select unlocked locations on a map so that I can progress through the food truck journey.

**What was delivered:**
- A food truck map with three locations: Pizza Park, Seaside Pier, and City Square.
- Each location shows whether it is Completed, Open, or Locked. Locked locations cannot be clicked.
- Passing a level unlocks the next location, and the results screen has a Back to Map button.
- Map progress is saved in the browser's localStorage and kept after closing the game.

## US-10: Cut Pizza into Smaller Equal Slices

**Priority:** High
**Estimated Hours:** 20

**User Story:**
As a student, I want to cut pizza into smaller equal slices so that I can understand equivalent fractions.

**What was delivered:**
- A cutting practice mode (`?mode=cutting`) where pizzas are cut into smaller equal slices.

## US-11: Add and Subtract Fractions with Unlike Denominators

**Priority:** High
**Estimated Hours:** 17

**User Story:**
As a student, I want to add and subtract fractions with unlike denominators so that I can practice more advanced fraction problems.

**What was delivered:**
- A practice mode (`?practice=unlike`) with addition and subtraction problems that use different denominators, up to a common denominator of 12.
- Hints for finding a common denominator.

## US-12: Solve Fraction Word Problems

**Priority:** Medium
**Estimated Hours:** 13

**User Story:**
As a student, I want to solve fraction word problems so that I can apply fractions to everyday situations.

**What was delivered:**
- Food-related word problems for addition and subtraction, with hints and explanations.

## US-13: Scale Recipes Using Measuring Cups

**Priority:** Medium
**Estimated Hours:** 16

**User Story:**
As a student, I want to scale recipes using measuring cups so that I can practice multiplying fractions by whole numbers.

**What was delivered:**
- A recipe practice mode (`?mode=recipe`) where students multiply fractional ingredient amounts by a whole number using measuring cups.

## US-14: Divide Food into Equal Portions

**Priority:** Medium
**Estimated Hours:** 13

**User Story:**
As a student, I want to divide food into portions so that I can practice dividing fractions.

**What was delivered:**
- A division practice mode (`?mode=division` or `/division.html`) with six orders, grouping hints, and Play Again.
- It is linked from the food truck map and does not change map unlocks or stars.

## Sprint 2 Summary

| ID | Story | Estimated Hours | Pull Requests | Status |
|---|---|---:|---|---|
| US-8 | View Progress and Earned Stars | 10 | #33, #34 | Done |
| US-9 | Select Unlocked Locations on a Map | 17 | #31 | Done |
| US-10 | Cut Pizza into Smaller Equal Slices | 20 | #29 | Done |
| US-11 | Add and Subtract Fractions with Unlike Denominators | 17 | #32 | Done |
| US-12 | Solve Fraction Word Problems | 13 | #30 | Done |
| US-13 | Scale Recipes Using Measuring Cups | 16 | #28 | Done |
| US-14 | Divide Food into Equal Portions | 13 | #35 | Done |
| | **Total** | **106** | | |

---

# Sprint 3: Integration, Polish, and Documentation

**Sprint Goal:** Connect the Sprint 2 features into one game a student can play from start to finish, fix bugs, and bring the documentation up to date before the demo video.

| Work | Related Story | Pull Request | Status |
|---|---|---|---|
| Main menu with Play, My Progress, and total stars | US-8 | #36 | Done |
| Word problems used as the Level 3 (City Square) orders | US-12 | #38 | Done |
| Unlike-denominator orders supported in the shared game screen | US-11 | #40 | Done |
| 14 unit tests for the shared fraction helpers (shared/fractions.ts) | All | #39 | Done |
| Back to Menu button on the map, map cleanup, and new map tests | US-8, US-9 | #41 | Done |
| Update README.md and stories.md for Sprints 2 and 3 | All | #41 | Done |

---

# Backlog

These stories are not finished yet.

| ID | User Story | Priority | Estimated Hours | Status |
|---|---|---|---:|---|
| US-15 | As a teacher, I want to select fraction operations and denominators so that students practice topics relevant to my lessons. | Medium | 26 | Planned after Sprint 3, before the demo video |
| US-16 | As a student, I want pizzas cut into different numbers of slices, from halves to twelfths, so that I can practice fractions with denominators from 2 to 12. | High | 12 | Not started |

Other ideas for later include dialogue cards, animated explanations, and achievements.

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

1. Add mockup screens for US-15 (the teacher settings screen).
2. Break US-15 into tasks and assign them before the demo video, if time allows.
3. Decide as a team whether US-16 fits before the end of the quarter.
4. Keep this file, the GitHub issues, and the GitHub Project board in sync at each sprint planning meeting.