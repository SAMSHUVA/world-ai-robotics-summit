# Project Workflow Template

## Guiding Principles
1. **The Plan is the Source of Truth:** All work must be tracked in `plan.md`.
2. **The Tech Stack is Deliberate:** Changes to the tech stack must be documented in `tech-stack.md` *before* implementation.
3. **Test-Driven Development:** Write unit tests before implementing functionality.
4. **High Code Coverage:** Aim for >80% code coverage.
5. **Non-Interactive:** Prefer non-interactive commands.

## Standard Task Workflow
1. **Select Task**: Choose next pending task from `plan.md`.
2. **Mark In Progress**: Change `[ ]` to `[~]`.
3. **Red Phase**: Write failing tests.
4. **Green Phase**: Implement to pass.
5. **Refactor**: Clean up while maintaining passes.
6. **Commit**: `feat(scope): Description`.
7. **Traceability**: Add `git notes` with summary.
8. **Update Plan**: Mark `[x]` with SHA.
9. **Commit Plan**: `conductor(plan): Complete [Task]`.

## Definition of Done
- All tests pass (Unit, Integration).
- Documentation (Specs, Tech Stack) is updated.
- No new linting/build errors.
- Git notes attached to implementation commit.
- Plan marked as complete and committed.
