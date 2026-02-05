# Conductor TDD Protocol (Red -> Green -> Refactor)

Follow these steps for every implementation task:

## 1. Red Phase: Write Failing Tests
- **Action**: Create a new test file or add cases to an existing one.
- **Verification**: Run the tests and confirm they **FAIL**.
- **Rule**: Do not write a single line of implementation code before seeing the test fail.

## 2. Green Phase: Implement to Pass
- **Action**: Write the **minimum** code required to make the tests pass.
- **Verification**: Run the tests and confirm they **PASS**.
- **Rule**: Focus on functionality over elegance at this stage.

## 3. Refactor Phase: Improve Quality
- **Action**: Clean up the code. Remove duplication. Improve naming. Normalize patterns.
- **Verification**: Run the tests again to ensure no regressions.
- **Rule**: Do not change external behavior during refactoring.

## 4. Documentation & Commit
- **Action**: Stage the code and commit with a concise message.
- **Traceability**:
  - Get the commit hash: `git log -1 --format="%H"`
  - Add a git note: `git notes add -m "<Task Summary>" <hash>`
  - Update `plan.md`: Mark task as `[x]` and append the short SHA.
  - Commit the plan update.
