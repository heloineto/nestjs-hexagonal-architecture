# Hexagonal Architecture

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
├── /common               # Shared types and interfaces used across features
├── /core                 # Global infrastructure bootstrap (connections, providers)
└── /<feature>            # One folder per bounded context
    ├── /application      # Use cases, commands, ports
    ├── /domain           # Models, value objects, events, factories
    ├── /infrastructure   # Adapters implementing the ports
    └── /presenters       # Delivery layer - how the outside world talks to the app
```

## /application

Orchestrates use cases. Holds services, command/query handlers, and app-specific logic. Never depends on infrastructure or presentation details. Instead, it defines **ports** that describe what it needs, and expects the infrastructure layer to fulfill them.

```
/application
    /commands   # Data contracts between presenters and application logic
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

The purest layer - no frameworks, no HTTP, no database. Contains domain **models**, **value objects**, **domain events**, and **factories**. Value objects are immutable and compared by value, not identity. This layer encodes business rules that never change regardless of how the app is delivered or where data is stored.

## /infrastructure

Implements the ports via **adapters**. Multiple adapters can implement the same port - for example, one backed by a real database and one in-memory for local dev or testing. Each adapter is self-contained with its own entities, repositories, and mappers.

```
/infrastructure
    /persistence
        /<driver-a>     # e.g. TypeORM adapter
            /entities
            /repositories
            /mappers
        /<driver-b>     # e.g. in-memory adapter
            /entities
            /repositories
            /mappers
```

### Mappers

Each adapter owns a mapper that converts between its persistence model and the domain model. This keeps domain objects free of ORM annotations or storage concerns.

```ts
class AlarmMapper {
  static toDomain(entity: AlarmEntity): Alarm { ... }
  static toPersistence(alarm: Alarm): AlarmEntity { ... }
}
```

### Swapping adapters

All adapters implementing the same port export the same token. The application layer never knows which one it received - swapping infrastructure requires no domain or application code changes.

## /presenters

The delivery layer - how the outside world talks to the application. Organized by transport. DTOs belong here, not in application, because they represent the shape of data for a specific transport. A gRPC transport would have its own DTOs in its own subfolder.

```
/presenters
    /http   # REST controllers and DTOs with validation decorators
    /cli    # CLI commands and argument parsing
```

### /http

REST controllers, DTOs with validation decorators, and HTTP-specific error handling. DTOs are transport-specific - they shape data for HTTP and live here, not in the application layer.

### /cli

CLI commands and argument parsing. Same application layer underneath, different entry point. Useful for scripts, migrations, or admin tasks that share the same use cases as the HTTP layer.
