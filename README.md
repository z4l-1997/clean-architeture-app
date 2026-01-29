# Restaurant App

## Architecture

This project follows **Clean Architecture** (Robert C. Martin) adapted for **Next.js/React**.

### Dependency Rule

> Source code dependencies can only point **inward**. Nothing in an inner circle can know anything about something in an outer circle.

```
domain/ → imports NOTHING
application/ → imports ONLY domain/
infrastructure/ → imports domain/ + application/
presentation/ → imports domain/ + application/ + infrastructure/
app/ (Next.js) → imports presentation/ + ioc/
```

### Layers

| Layer (inner → outer) | Role | Examples |
|---|---|---|
| **Entities** (`domain/`) | Core business rules, most stable | `MenuItem`, `Order`, `Money` |
| **Use Cases** (`application/`) | Application-specific business logic | `CreateOrder`, `CalculateTotal` |
| **Interface Adapters** (`infrastructure/` + `presentation/`) | Convert data between internal/external formats | Mappers, Repositories impl, ViewModels |
| **Frameworks & Drivers** (`app/`) | Framework, DB, UI, API client | Next.js, React, fetch, Zustand |

### Folder Structure

```
src/
├── app/                          # Next.js App Router (Frameworks & Drivers)
│   ├── (public)/                 # Route group: home, menu
│   ├── (auth)/                   # Route group: login, register
│   ├── (dashboard)/              # Route group: admin pages
│   ├── layout.tsx
│   └── globals.css
│
├── core/                         # Cross-cutting concerns
│   ├── config/                   # Environment, constants
│   └── logger/                   # Logging
│
├── domain/                       # ENTITIES LAYER (innermost - NO dependencies)
│   ├── models/                   # Business entities (pure TypeScript classes)
│   │   ├── menu-item.ts
│   │   ├── order.ts
│   │   └── reservation.ts
│   ├── repositories/             # Repository INTERFACES (Ports)
│   │   ├── menu.repository.ts
│   │   └── order.repository.ts
│   ├── value-objects/            # Value objects (Money, Address...)
│   └── errors/                   # Domain-specific errors
│
├── application/                  # USE CASES LAYER
│   ├── use-cases/                # Application-specific business logic
│   │   ├── menu/
│   │   │   ├── get-menu.use-case.ts
│   │   │   └── search-menu.use-case.ts
│   │   ├── order/
│   │   │   ├── create-order.use-case.ts
│   │   │   └── calculate-total.use-case.ts
│   │   └── reservation/
│   │       └── create-reservation.use-case.ts
│   ├── ports/                    # Input/Output port interfaces
│   └── dtos/                     # Data Transfer Objects
│
├── infrastructure/               # INTERFACE ADAPTERS + FRAMEWORKS & DRIVERS
│   ├── repositories/             # Repository IMPLEMENTATIONS (Adapters)
│   │   ├── api-menu.repository.ts
│   │   └── api-order.repository.ts
│   ├── api/                      # HTTP client, interceptors
│   │   └── http-client.ts
│   ├── mappers/                  # Data <-> Domain mappers
│   │   ├── menu.mapper.ts
│   │   └── order.mapper.ts
│   └── storage/                  # LocalStorage, cookies adapters
│
├── presentation/                 # INTERFACE ADAPTERS (UI side)
│   ├── components/               # React components
│   │   ├── ui/                   # shadcn/ui primitives
│   │   ├── layouts/              # Header, Sidebar, Footer
│   │   └── shared/               # Reusable business components
│   ├── hooks/                    # Custom React hooks
│   ├── providers/                # Context providers
│   ├── stores/                   # State management (Zustand/Redux)
│   └── view-models/              # Presenters / ViewModels
│
├── ioc/                          # Dependency Injection container
│   └── container.ts              # Wire dependencies together
│
└── lib/                          # Shared utilities
    └── utils.ts
```

### Key Principles

1. **Pure Domain Layer** - No imports from React, Next.js, or any framework
2. **Dependency Inversion** - Interfaces (Ports) in `domain/`, implementations (Adapters) in `infrastructure/`
3. **Use Cases** - Separate business logic from UI
4. **IoC Container** - Wire dependencies at composition root (`ioc/`)
5. **ESLint Rules** - Can enforce the dependency rule automatically

### Data Flow

```
app/ (route) → presentation/ (component + hook)
  → application/ (use case)
    → domain/ (entity + repository interface)
      ← infrastructure/ (repository implementation + API call)
```

### References

- [The Clean Architecture - Robert C. Martin](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Clean Architecture in Frontend - Feature-Sliced Design](https://feature-sliced.design/blog/frontend-clean-architecture)
- [Clean Architecture Next.js Boilerplate](https://github.com/Melzar/clean-architecture-nextjs-react-boilerplate)
