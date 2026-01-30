# Restaurant App

## Architecture

This project follows **Clean Architecture** (Robert C. Martin) adapted for **Next.js/React**.

### Dependency Rule

> Source code dependencies can only point **inward**. Nothing in an inner circle can know anything about something in an outer circle.

```
domain/          → imports NOTHING (only Zod for schema validation)
application/     → imports ONLY domain/
infrastructure/  → imports domain/ + application/ (ports only)
presentation/    → imports di/ + domain/ (types only)
di/              → imports ALL layers (Composition Root - wires everything)
app/             → imports presentation/
```

### Layers

| Layer (inner → outer)                  | Role                                                                | Key Files                                                                |
| -------------------------------------- | ------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| **Domain** (`domain/`)                 | Core business rules, entities, value objects, repository interfaces | `AuthTokenEntity`, `LoginEntity`, `EmailSchema`, `AuthRepository`        |
| **Application** (`application/`)       | Use cases + port interfaces (abstractions for external services)    | `loginUseCase`, `refreshUseCase`, `StoragePort`, `HttpClientPort`        |
| **Infrastructure** (`infrastructure/`) | Implements ports & repository interfaces with real adapters         | `localStorageAdapter`, `cookieAdapter`, `httpClientAdapter`, `login.api` |
| **DI** (`di/`)                         | Composition Root - wires all dependencies together                  | `container.ts`, `auth.container.ts`                                      |
| **Presentation** (`presentation/`)     | React components, hooks, providers, views                           | `AuthProvider`, `useLogin`, `LoginView`                                  |
| **App** (`app/`)                       | Next.js App Router, pages, API routes                               | `layout.tsx`, `page.tsx`, `route.ts`                                     |

### Folder Structure

```
src/
├── domain/                          # ENTITIES LAYER (innermost - NO dependencies)
│   ├── entities/                    # Business entities (Zod schemas + types)
│   │   ├── login.entity.ts          # LoginSchema: username + password
│   │   ├── auth-token.entity.ts     # AuthTokenSchema, AuthUserSchema, LoginResponseSchema
│   │   └── refresh-token.entity.ts  # RefreshTokenSchema: access_token + refresh_token
│   ├── value-objects/               # Value objects with Zod validation
│   │   ├── email.vo.ts              # EmailSchema (z.email)
│   │   ├── user-role.vo.ts          # UserRoleSchema (customer | staff | manager | admin)
│   │   ├── token.vo.ts              # TokenSchema (non-empty string)
│   │   └── index.ts                 # Re-export all value objects
│   └── repositories/                # Repository INTERFACES (Ports)
│       └── auth.repository.ts       # AuthRepository type: login() + refresh()
│
├── application/                     # USE CASES LAYER
│   ├── use-cases/                   # Application-specific business logic
│   │   └── auth/
│   │       ├── login.use-case.ts    # Login → save tokens → return result
│   │       └── refresh.use-case.ts  # Refresh → save new tokens → return result
│   └── ports/                       # Output port interfaces (abstractions)
│       ├── storage.port.ts          # StoragePort: get/set/remove
│       ├── http-client.port.ts      # HttpClientPort: request()
│       └── cookie.port.ts           # CookiePort: setRefreshToken()
│
├── infrastructure/                  # ADAPTERS LAYER (implements ports & repositories)
│   ├── config/
│   │   └── env.config.ts            # API_BASE_URL from environment
│   ├── storage/
│   │   ├── local-storage.adapter.ts # Implements StoragePort → localStorage
│   │   └── cookie.adapter.ts        # Implements CookiePort → HttpOnly cookie via API route
│   ├── api/
│   │   ├── http-client.adapter.ts   # Implements HttpClientPort → fetch() with Bearer token
│   │   └── auth/
│   │       ├── login/
│   │       │   └── login.api.ts     # Validate input → POST /auth/login → validate output
│   │       └── refresh/
│   │           └── refresh.api.ts   # Validate input → POST /auth/refresh → validate output
│   └── repositories/
│       └── auth.impl.ts             # Implements AuthRepository → connects login.api + refresh.api
│
├── di/                              # COMPOSITION ROOT (wires all dependencies)
│   ├── container.ts                 # Root container: shared deps → repositories → containers
│   └── auth.container.ts            # Auth container factory: executeLogin + executeRefresh
│
├── presentation/                    # UI LAYER (React)
│   ├── components/ui/               # Reusable UI primitives (shadcn/ui)
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   └── card.tsx
│   ├── lib/
│   │   └── utils.ts                 # Utility functions (cn for class names)
│   ├── providers/
│   │   └── auth.provider.tsx        # AuthContext + AuthProvider + useAuthContext()
│   └── views/
│       └── login/
│           ├── login-view.tsx        # Login form UI component
│           ├── hook/
│           │   └── useLogin.ts       # Login hook (uses AuthContext, manages loading/error)
│           └── types/
│               └── login-form.types.ts  # LoginFormState type + initial state
│
└── app/                             # NEXT.JS APP ROUTER (entry point)
    ├── layout.tsx                   # Root layout: wraps children with <AuthProvider>
    ├── page.tsx                     # Home page (/)
    ├── globals.css
    ├── (auth)/
    │   ├── login/
    │   │   └── page.tsx             # /login → renders <LoginView>
    │   └── register/
    │       └── page.tsx             # /register
    └── api/
        └── auth/
            └── login/
                └── route.ts         # API route: sets refresh_token as HttpOnly cookie
```

### Key Principles

1. **Pure Domain Layer** - No imports from React, Next.js, or any framework. Only Zod for schema validation.
2. **Dependency Inversion** - Interfaces (Ports) defined in `domain/` and `application/`, implementations (Adapters) in `infrastructure/`.
3. **Value Objects** - Domain-level validation via Zod schemas (`EmailSchema`, `UserRoleSchema`, `TokenSchema`).
4. **Composition Root** - `di/` is a standalone folder (not inside infrastructure) that wires all dependencies. It is the only place allowed to know all layers.
5. **React Context for DI** - `AuthProvider` exposes use cases to the UI layer via React Context, so components never import from infrastructure directly.

### Data Flow (Login)

```
User clicks "Login"
│
▼
app/(auth)/login/page.tsx          → renders LoginView
│
▼
presentation/views/login/
  login-view.tsx                   → calls useLogin().login(form)
  hook/useLogin.ts                 → calls useAuthContext().login (from AuthProvider)
│
▼
presentation/providers/
  auth.provider.tsx                → forwards to authContainer.executeLogin
│
▼
di/
  container.ts                     → authContainer created with real dependencies
  auth.container.ts                → calls loginUseCase(repo, storage, cookie, data)
│
▼
application/use-cases/auth/
  login.use-case.ts                → repo.login(data)
                                   → storage.set("access_token", token)
                                   → cookie.setRefreshToken(refresh_token)
                                   → return token
│
▼
infrastructure/
  repositories/auth.impl.ts       → delegates to login.api
  api/auth/login/login.api.ts     → validates input (Zod) → httpClient.request() → validates output (Zod)
  api/http-client.adapter.ts      → fetch(API_BASE_URL + url) with Bearer token
│
▼
🌐 Backend Server                  → returns { success, data: { access_token, refresh_token, user } }
│
▼ (response flows back up)
│
infrastructure/
  storage/local-storage.adapter.ts → localStorage.setItem("access_token", ...)
  storage/cookie.adapter.ts        → POST /api/auth/login → sets HttpOnly cookie
│
▼
app/api/auth/login/route.ts        → cookieStore.set("refresh_token", { httpOnly: true, secure, sameSite: "strict" })
```

### References

- [The Clean Architecture - Robert C. Martin](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
