# US-14: Divide food into equal portions

Students can practice fraction division by serving equal portions of pizza. The screen shows the total food and required portion size, lets students make or return portions, checks their portion count, and explains incorrect answers using equal-slice grouping. Correct answers unlock the next order; finishing six orders offers replay.

Closes #15

## Scope and approach

- `DivisionModel` validates orders, stores the portion count, calculates the quotient, and creates feedback and grouping hints.
- `DivisionController` forwards interactions, clears stale feedback after edits, and prevents changes to solved orders.
- `DivisionView` uses the existing pizza-order layout, stacked fractions, and button palette. `PizzaDiagram.ts` draws round SVG pizzas using PlateView's crust, cheese, pepperoni, and plate colors. Served slices fade in the supply; portion plates show the amount served. No shared pizza implementation is changed.
- `startDivisionGame` connects these objects and manages order progression and replay. The first four orders randomize the whole-pizza amount; the last two are fixed fraction examples.
- `src/main.ts` adds `?mode=division`, and `MapView.ts` adds a practice link. Existing routes, level rules, and other feature implementations are preserved.
- `division.html` provides a standalone Vite entry page for exercising division without importing other modes.
- This mode accepts whole portion counts from 1 to 12. It does not add teacher settings, stars, saved progress, or shared worked examples; those belong to separate stories.

## Try it

After installing the project's locked dependencies, run:

```bash
npx vite
```

Visit `http://localhost:5173/division.html` to try division on its own (use the port printed by Vite).
The integrated map link and `/?mode=division` route are also available once the upstream import error below is resolved.
Read the total amount and portion size, click a supply pizza or select **Make a Portion**, then **Check Order**.
For example, `2/1 ÷ 1/4` needs eight portions. Use **Return a Portion**, or click a portion, to undo a serving. Incorrect answers retain the current order and provide a hint. Correct answers enable **Next Order**. The last order offers **Finish Practice**, followed by **Play Again**.

**Current upstream blocker:** the full application on Linux cannot build because `src/features/plate/cuttingGame.ts` imports `./CuttingGame.css`, while the tracked filename is `cuttingGame.css`. That file is unchanged in this PR to keep US-14 separate from other issue work. A teammate must resolve the upstream import before the complete integrated browser flow can be demonstrated on a case-sensitive filesystem. The standalone division page and isolated division bundle both build successfully.

## Tests and validation

```bash
npm test -- tests/Division*.test.ts
npm test
npx --no-install tsc --noEmit
npx --no-install vite build
```

If this checkout has broken `node_modules/.bin` launcher links, the installed tools can also be run directly:

```bash
node node_modules/vitest/vitest.mjs run tests/Division*.test.ts
node node_modules/vitest/vitest.mjs run
node node_modules/typescript/bin/tsc --noEmit
node node_modules/vite/bin/vite.js build
```

Validation after pulling `origin/main` at `3f01c32`:

- 465 tests passed across 43 files, including 47 division, diagram, and routing tests.
- TypeScript passed.
- Isolated division library and standalone HTML production builds passed.
- Headless Chromium smoke tests passed at desktop and narrow viewport sizes, exercising too-few/too-many feedback, correction, all six orders, completion, replay, keyboard focus, and horizontal-overflow checks.
- Full application build is blocked by the upstream CSS filename mismatch described above.

Unit tests cover exact division, invalid fractions, unsupported portion counts, bounds, order copying, feedback, and solved-order locking. DOM integration tests cover serving and returning food, too-few and too-many answers, optional hints, retries, keyboard focus, completion, and replay. Routing regression tests mock feature starters to verify existing mode dispatch, unlike-practice precedence, the progress return callback, demo setup, and map selection/locking; these do not replace end-to-end tests of those other features. Randomness is mocked to make tests repeatable. Actual screen-reader behavior needs manual review; neither jsdom nor the browser smoke test establishes that.

## Review and submission

Request teammate review and merge before submitting the final PR link to Gradescope. Confirm the course's authorship and AI-use requirements: the initial implementation and preparation documents were AI-assisted. This draft does not assert that 70% of the submitted code was independently authored by the student.
