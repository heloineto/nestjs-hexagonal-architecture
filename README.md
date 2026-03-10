# Project Structure

## Hexagonal Architecture

You know the feeling - a "small" change to how data is stored cascades into controllers, services, tests, DTOs. Business logic leaks into HTTP handlers. A feature that should take an hour takes a day, because everything is tangled with everything else.

Hexagonal architecture (aka. ports & adapters) solves that. The **core domain owns the contracts** - it defines interfaces (ports) describing what it needs. Infrastructure and transports implement those contracts (adapters). Arrows point inward, not outward (or all over the place).

**What you gain:**

- **Swap infrastructure freely** - replace Postgres with Mongo, REST with gRPC, without touching a line of business logic
- **Test business logic in isolation** - no DB, no HTTP, no mocks of external systems; just pure functions and interfaces
- **Focus on what matters** - domain and application layers stay clean and expressive, free from framework noise
- **Resilience to change** - external systems evolve; your core doesn't have to

The upfront structure pays off fast - business logic stays clean and readable for years, and the codebase grows without becoming a pile of tech debt.

## Folder Structure

Code is organized by **feature** (bounded context), not by technical role. Everything related to a feature lives together.

```
/src
├── /common                     # Shared types and interfaces used across features
├── /core                       # Global infrastructure bootstrap (connections, providers)
└── /<feature>                  # One folder per bounded context
    ├── /<feature>.module.ts    # Composition root - wires all layers together
    ├── /application            # Use cases, commands, ports
    ├── /domain                 # Models, value objects, events, factories
    ├── /infrastructure         # Adapters implementing the ports
    └── /presentation           # Delivery layer - how the outside world talks to the app
```

## /application

Orchestrates use cases. Each use case is a single class in its own file, which also exports its input DTO. Never depends on infrastructure or presentation details. Instead, it defines **ports** that describe what it needs, and expects the infrastructure layer to fulfill them.

```
/application
    /use-cases  # One file per use case. Each file exports the use case class and its input DTO
    /ports      # Abstractions over external dependencies (repositories, brokers, etc.)
```

### Ports

Ports are defined as **abstract classes**, not interfaces. In NestJS, interfaces are erased at compile time and can't serve as injection tokens. Abstract classes survive compilation and work as DI tokens at runtime.

```ts
export abstract class AlarmRepository {
  abstract findAll(): Promise<Alarm[]>;
  abstract save(alarm: Alarm): Promise<Alarm>;
}
```

## /domain

The purest layer - no frameworks, no HTTP, no database. Directly maps to the DDD tactical building blocks:

- **Entities** - domain models with identity and lifecycle
- **Value Objects** - immutable, equality by attributes (e.g. `AlarmSeverity`)
- **Aggregates** - clusters enforcing consistency boundaries
- **Factories** - encapsulate complex object creation
- **Domain Events** - record meaningful things that happened in the domain

This layer encodes business rules that never change regardless of how the app is delivered or where data is stored.

## /infrastructure

Implements the ports via **adapters**. Multiple adapters can implement the same port - for example, one backed by a real database and one in-memory for local dev or testing. Each adapter is self-contained with its own entities, repositories, and mappers.

```
/infrastructure
    /persistence
        /<driver-a>     # e.g. orm
            /entities       # orm-<feature>.entity.ts
            /repositories   # orm-<feature>.repository.ts
            /mappers        # orm-<feature>.mapper.ts
        /<driver-b>     # e.g. in-memory
            /entities       # in-memory-<feature>.entity.ts
            /repositories   # in-memory-<feature>.repository.ts
            /mappers        # in-memory-<feature>.mapper.ts
```

### Mappers

Each adapter owns a mapper that converts between its persistence model and the domain model. This keeps domain objects free of ORM annotations or storage concerns.

```ts
class OrmAlarmMapper {
  static toDomain(entity: OrmAlarmEntity): Alarm { ... }
  static toPersistence(alarm: Alarm): OrmAlarmEntity { ... }
}
```

Read-only adapters only need `toDomain`. Skip `toPersistence` if the feature never writes through that adapter.

### Swapping adapters

All adapters implementing the same port export the same token. The application layer never knows which one it received - swapping infrastructure requires no domain or application code changes.

## /presentation

The delivery layer - how the outside world talks to the application. Organized by transport. Each transport folder contains controllers and transport-specific wiring. DTOs live in the use-case files they belong to, not here.

```
/presentation
    /http   # REST controllers and DTOs with validation decorators
    /cli    # CLI commands and argument parsing
```

### /http

REST controllers and HTTP-specific error handling. Controllers call use cases directly and pass the request body as the use-case DTO.

### /cli

CLI commands and argument parsing. Same application layer underneath, different entry point. Useful for scripts, migrations, or admin tasks that share the same use cases as the HTTP layer.

## /feature.module.ts

`<feature>.module.ts` at feature root, above layers (intentional). **Composition root**: wires providers from all layers via Nest DI. Couples app + infra + presentation by design. Pragmatic compromise: pure hexagonal architecture would avoid one-file cross-layer coupling; Nest needs it. Root placement = visible, predictable, layers stay clean.

## DDD (Domain-Driven Design)

DDD is a software development approach that concentrates on the domain model and domain logic. The structure and language of the code should match that of the business domain.

#### Entities

Objects with a **unique identifier** and a lifecycle. They can be modified over time, but their identity persists. Two entities with identical attributes are still different entities - for example, two alarms with the same name and severity are distinct alarms.

#### Value Objects

**Immutable** objects with no unique identifier. Equality is determined entirely by their attributes - two value objects with the same attributes are considered equal. In this codebase, `AlarmSeverity` is a value object.

#### Aggregates

A **cluster of objects** treated as a single unit, with one root entity (the aggregate root). The aggregate enforces that all objects within it remain in a valid and consistent state. It represents a **transactional consistency boundary** - all changes to objects inside the aggregate happen within a single transaction.

#### Repositories

Abstractions over the data access layer, used to **persist and retrieve aggregates**. The application layer works with aggregates through repository interfaces (ports) without any knowledge of the underlying storage implementation. This codebase already uses this pattern for alarms.

#### Services

Encapsulate **domain logic that doesn't belong to any specific entity or value object** - for example, a notification service triggered when a new alarm is created. Use sparingly: heavy reliance on services is a warning sign of an **anemic domain model** - an anti-pattern where the domain model contains no real business logic and is reduced to getters and setters.

#### Factories

Encapsulate the **creation of complex objects**, especially when construction involves validation, initialization, or multiple coordinated steps. Factories keep domain objects clean and focused on business logic by offloading creation complexity to dedicated classes.

#### Domain Events

Capture **domain-specific information about something that happened** in the past - a state change or action in the domain model. Events enable loose coupling, scalability, and eventual consistency. There are two types:

- **Domain Events** - internal to the bounded context, used to react to changes within the same domain
- **Integration Events** - cross-boundary events, used to communicate between bounded contexts or external systems

## Barrel Files

**No barrel files inside features.** Use direct imports with `@/` path aliases.

**Why not full barrel files?** The costs outweigh the benefits: extra `index.ts` files in every folder, hidden public APIs (`export *` hides what's actually exported), and worse IDE navigation ("go to definition" lands in the barrel instead of the source).

## ESLint Boundaries

`eslint-plugin-boundaries` enforces import rules.

| Layer            | Allowed imports                 |
| ---------------- | ------------------------------- |
| `domain`         | `common`                        |
| `application`    | `common`,`domain`               |
| `infrastructure` | `common`,`domain`,`application` |
| `presentation`   | `common`,`domain`,`application` |

No cross-feature imports. Features compose via app module.
