# AGENTS.md

## Project Overview

This repository is Kaya, a personal fitness tracker built with Next.js, TypeScript, MongoDB, JWT authentication, React Context, and Tailwind CSS.

The primary goal is to keep the codebase simple, readable, and maintainable. Favor clear implementation over clever abstractions.

## Core Principles

- Keep the architecture simple and easy to follow.
- Prefer readability over cleverness.
- Avoid unnecessary abstractions and premature optimization.
- Keep files small and focused on a single responsibility.
- Write production-quality code, even for a personal project.
- Choose the least complex solution that remains maintainable and scalable.

## Engineering Guidelines

### TypeScript

- Use TypeScript everywhere.
- Avoid `any` unless absolutely necessary.
- Prefer interfaces for data models.
- Keep functions small and single-purpose.
- Follow consistent naming conventions.
- Use `async/await` instead of promise chains where practical.

### Error Handling

- Handle errors gracefully.
- Never silently ignore exceptions.
- Log meaningful error context without exposing secrets.
- Add comments only when they clarify intent, not obvious code.

## Project Structure

Follow the existing structure where possible:

- `app/` for Next.js App Router pages and route handlers
- `components/` for reusable UI components
- `context/` for global React context such as authentication
- `hooks/` for reusable hooks
- `lib/` for shared utilities, database helpers, and auth helpers
- `models/` for domain models or schema definitions when used
- `services/` for business logic and external integrations
- `types/` for shared TypeScript types
- `utils/` for helper functions

## API Guidelines

- Return consistent JSON responses.
- Use appropriate HTTP status codes.
- Validate inputs before processing.
- Keep business logic outside route handlers where possible.
- Route handlers should stay thin and focused on request/response handling.

## Authentication

- Use JWT-based authentication.
- Verify tokens before protected actions.
- Store only minimal information inside JWTs.
- Never expose secrets.
- Do not log passwords, tokens, or other sensitive values.

## Database

- Reuse a single MongoDB connection.
- Centralize database access logic.
- Use meaningful collection names.
- Avoid duplicate or unnecessary queries.

## Logging

- Use structured logging.
- Every request should include a `requestId` when possible.
- Log request duration.
- Never log passwords, JWTs, refresh tokens, or sensitive information.
- Use `INFO`, `WARN`, `ERROR`, and `DEBUG` levels appropriately.

## Frontend

- Prefer reusable components.
- Keep state as local as possible.
- Avoid unnecessary re-renders.
- Use React Context only for genuinely global state such as authentication or theme.

## Performance

- Avoid premature optimization.
- Prevent unnecessary database queries.
- Lazy load when it provides a clear benefit.
- Minimize bundle size where reasonable.

## Change Expectations

When modifying code:

- Respect the existing project structure.
- Reuse existing utilities before creating new ones.
- Avoid introducing unnecessary dependencies.
- Keep changes minimal and focused.
- Do not rewrite unrelated code.
- Briefly explain major architectural decisions when introducing them.

## Summary

Work in a way that keeps Kaya easy to understand, maintain, and extend over time. Favor clarity, consistency, and thoughtful implementation over complexity.
