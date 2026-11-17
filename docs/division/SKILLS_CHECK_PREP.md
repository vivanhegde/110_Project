# US-14 skills check preparation

This guide explains the current feature and records what remains before submission. It is a study aid, not evidence of independent authorship or a completed teammate review.

## Submission status

| Requirement | Current evidence or remaining action |
|---|---|
| One real user story | US-14 / GitHub issue #15: divide food into equal portions. Includes calculations, interactive state, answer checking, hints, progression, and replay. |
| Real project integration | Division route and map link are present. The standalone `/division.html` page runs without loading other modes. Full application build remains blocked by an unchanged upstream cutting CSS import. |
| Primarily your authorship, at least 70% | **Not established.** The initial implementation was generated with AI assistance. Understand and honestly account for your contribution; check the course's policy with staff. Reading or renaming generated code does not establish authorship. |
| Automated tests | 47 division, diagram, and routing tests in Vitest; Math.random is mocked. Includes successful, unsuccessful, and edge-case behavior. The full suite passes 465 tests. |
| Documentation | `PR_DRAFT.md`, this guide, and the README usage instructions. |
| Reviewed and merged PR | **Still required.** No push, PR creation, review, or merge has been performed for this feature. |
| Q2 or Q3 | Choose exactly one. A Q3 UML diagram and two-paragraph writeup are supplied as a draft PDF and editable LaTeX source. Review and adapt them to your own understanding and the final merged code. |

## What to be able to explain

**What does the feature do?** It asks how many equal portions fit into a total amount of food. For `3/4` of a pizza and `1/8` per portion, the student should make six portions. The first four generated orders use one or two whole pizzas and a unit-fraction portion. The last two use fractional totals. All supported results are whole portion counts between one and twelve.

**How does the math work?** For total `a/b` and portion `c/d`, the answer is `(a*d)/(b*c)`. The constructor checks that every component is a positive safe integer no larger than twelve, then rejects non-integer answers and answers outside 1–12. Example: `(3*8)/(4*1) = 6`. This is exact for the supported inputs; there is no approximate decimal tolerance.

**How do the visual and hint calculations work?** Both express the food and portion in a common slice size. The denominator is `b*d/gcd(b,d)`, the least common multiple. For `3/4 ÷ 1/8`, each pizza is cut into eighths; the supply has six slices and a portion needs one. For `3/4 ÷ 3/8`, the same six slices form groups of three, so the answer is two. The grouping calculation currently appears in both the view and the model's hint method; keep them consistent if the representation changes.

**How does it match the team's UI?** Division follows PizzaOrderView's order-card/play-area layout, stacked fractions, cream backgrounds, and red Check Order button. PizzaDiagram uses PlateView's plate, crust, cheese, and pepperoni colors, with native SVG following the explanation screen's approach. It handles multiple pizzas and fractional totals without changing the shared Konva controller. Faded supply slices mean served food; portion plates show the corresponding fraction.

**Why MVC?** The model owns math and portion state without browser dependencies. The view owns DOM rendering and dispatches callbacks. The controller applies interaction rules and retains current feedback. The game function wires the callbacks to the controller and manages the order index. This separation allows model tests without a browser and game tests with jsdom.

**Walk through Make a Portion.** The view invokes `onAdd`; the game callback calls `controller.addPortion()`; the controller rejects edits after success, otherwise updates the model and clears stale feedback. The game calls `draw()`, which passes the current order, portion count, feedback, hint, and progress to the view. The view redraws the supply and portion buttons, preserving focus when the control still exists and is enabled.

**Walk through an incorrect answer.** The model compares the count with the quotient and returns `tooFew` or `tooMany` plus a grouping hint. The controller stores that result. The view shows the feedback and keeps the editing controls. Editing clears feedback but preserves the current order. Extra portions are outlined and labeled as needing additional food, so the supply never invents slices.

**Walk through a correct answer.** Feedback becomes `correct`, editing is locked, and the next-order control gets focus. The game checks success before advancing. It creates a fresh model/controller and clears hints for the next order. Finishing the sixth order shows completion. Replay regenerates the order sequence with zero portions and no old feedback.

**Why copy order objects?** The constructor copies the supplied order, and `getOrder()` returns a copy. Changing the caller's original object or the returned object cannot silently change the model's expected answer. The fields are primitive values, so a shallow copy is sufficient.

**Why separate from existing level features?** The story requires portioning, feedback, and hints. It does not require stars, teacher settings, or map unlocking. Standalone practice follows the existing recipe-practice approach and avoids modifying teammates' feature implementations. Reusing the same MVC style does not mean the division mode uses the shared pizza canvas or shared feedback controller.

**What are the limitations?** Only complete portions are accepted, no fractional counts or leftovers. The control limit is twelve. The generator uses a small set of denominators and two fixed final problems. There are no division scores, persistent progress, teacher configurations, picture-equation hints, or attempt-based detailed explanations. The visuals are round SVG pizza diagrams that follow PlateView's palette and PizzaOrderView's layout. Students click pizzas or buttons rather than dragging individual slices. The full page is redrawn after interactions; DOM tests are not a replacement for testing keyboard navigation and layout in a real browser.

## Acceptance criteria and evidence

| Issue #15 criterion | Implementation and tests |
|---|---|
| Generate equal-portion problems | `orders.ts`; mocked random values test both possible whole-pizza amounts and order validity. |
| Show total food and portion size | `DivisionView.render`; DOM test checks the prompt and food slices. |
| Interactive visual portioning | Supply slice coloring, portion buttons, Make/Return controls; tests verify serving, returning, and over-allocation. |
| Fraction division calculation | `DivisionModel.getAnswer`; table-driven tests cover whole/fraction totals, multi-slice portions, and equivalent values. |
| Submission and feedback | `checkAnswer` and controller state; tests cover success, too few, too many, retries, and success locking. |
| Hints after incorrect answers | `getHint` and incorrect-result hint; unit and DOM tests assert grouping explanations. |
| Fifth-grade problems | Small amounts and denominators, starting with whole-number division by unit fractions; later fraction-total problems are an extension. Confirm suitability with your team/course staff. |

## Rehearsal

1. Read the model and controller, then explain `3/4 ÷ 1/8` without looking at these notes.
2. Trace one button click through the view callback, game function, controller, model, and redraw.
3. Read each test and describe what bug it would catch. Explain why Math.random is mocked and why jsdom tests do not establish visual correctness.
4. Run the focused tests and the full suite. Use `/division.html` to demonstrate zero portions, excess portions, correction, hint, completion, and replay now. After the upstream build blocker is resolved, also demonstrate entering from and returning to the map.
5. Read the diagram source and match every displayed type and relationship to the implementation. There is no inheritance in the division feature.
6. Review the PR text and use factual commit messages, for example `feat(division): add equal-portion practice with hints` and `test(division): verify fraction division and practice flow`. Document only contributions actually made; do not fabricate an incremental development history.

## Q3 architecture draft

`division-architecture.pdf` contains six UML classifiers and a two-paragraph writeup. The six parts are `DivisionModel`, `DivisionController`, `DivisionView`, `DivisionOrder`, `DivisionResult`, and `DivisionHandlers`. The game wiring is explained in the diagram note and prose; it is a function rather than an invented class. The diagram uses solid navigable associations for retained references and dashed dependencies for returned/temporary types. There are no ownership diamonds or inheritance arrows because the code does not need those claims.

Sources consulted for notation: [assigned UML introduction](https://cs.nyu.edu/~jcf/classes/g22.2440-001_sp06/handouts/UMLBasics.pdf) and [UML class-diagram reference](https://taylorial.com/oo/uml/). Regenerate the PDF from the source with `pdflatex`; no application dependency is added.

The writeup is a draft to verify and adapt, not a claim that you independently produced it. If you choose Q2 instead, recruit a real person outside your project team, run the actual study, and report the observations you collect. No user study has been conducted or invented here.
