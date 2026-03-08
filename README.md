# Hexagonal Architecture

## What and Why

Hexagonal architecture (aka. ports & adapters) inverts that. The **core domain owns the contracts** - it defines interfaces (ports) describing what it needs. Infrastructure and transports implement those contracts (adapters). Arrows point inward, not outward.

**What you gain:**

- **Swap infrastructure freely** - replace Postgres with Mongo, REST with gRPC, without touching a line of business logic
- **Test business logic in isolation** - no DB, no HTTP, no mocks of external systems; just pure functions and interfaces
- **Focus on what matters** - domain and application layers stay clean and expressive, free from framework noise
- **Resilience to change** - external systems evolve; your core doesn't have to

The upfront structure pays off fast - business logic stays clean and readable for years, and the codebase grows without becoming a pile of tech debt.

## Folder Structure

```
/alarms                   # Bounded context/feature. All code is co-located by feature
├── /application          # App services, handlers, commands. Talks to infra via ports
├── /domain               # Models, value objects, events, factories. Core business
├── /infrastructure       # DB, brokers, external systems. Implements ports (adapters)
└── /presenters
    ├── /http             # Controllers, DTOs - REST/HTTP API
    └── /cli              # Commands, args - CLI (e.g. `alarms create`); same app, different entry
```

## /application

The application layer orchestrates use cases. It holds services, command/query handlers, and other app-specific logic. It never depends on infrastructure or presentation details. Instead, it defines **ports** (interfaces) that describe what it needs (e.g. "save an alarm", "publish an event"), and expects the infrastructure layer to fulfill them. Commands and queries live here too, acting as the data contracts between presenters and application logic.

## /domain

The purest layer - no frameworks, no HTTP, no database. Contains domain **models** (e.g. `Alarm`), **value objects** (e.g. `AlarmSeverity`), **domain events**, and **factories**. Value objects are immutable and compared by value, not identity. This layer encodes the business rules that never change regardless of how the app is delivered or where data is stored.

## /infrastructure

Implements the ports defined by the application layer via **adapters** (e.g. a `TypeORM` repository implementing `IAlarmRepository`). This is where database access, message brokers, HTTP clients, and other external systems live. Nothing in domain or application should import from here.

## /presenters

The delivery layer - how the outside world talks to the application. Organized by transport:

- `http/` - REST controllers, DTOs with validation decorators, HTTP-specific error handling.
- `cli/` - CLI commands, argument parsing. Same application layer underneath, different entry point.

DTOs belong here, not in application, because they represent the shape of data for a specific transport (e.g. HTTP). Other transports like gRPC would have their own DTOs in their own subfolder.
