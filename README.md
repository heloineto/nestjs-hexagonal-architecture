# Hexagonal Architecture

## Folder Structure

```
alarms/
├── application/          # App services, handlers, commands — talks to infra via ports
├── domain/               # Models, value objects, events, factories — core business
├── infrastructure/       # DB, brokers, external systems — implements ports (adapters)
└── presenters/
    └── http/             # Controllers, DTOs — HTTP API surface
```

- **application** — Application layer. Services, command/query handlers. Communicates with data access, brokers, etc. through **ports** (interfaces).
- **domain** — Domain layer. Models, value objects, domain events. No infra or UI.
- **infrastructure** — Infrastructure layer. Repositories, message brokers, external APIs. **Implements** ports from application.
- **presenters** — User-facing layer. Controllers, gateways, DTOs. One subfolder per transport (e.g. `http`, later `grpc`).
