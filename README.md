# PS StackOverflow

Stack Overflow–style Q&A app: React frontend, Spring Boot API, MySQL, and a **notification microservice** for ban email/SMS.

## Architecture

```
[React + Vite]  →  [Main API :8080]  →  [MySQL]
                         │
                         │ HTTP POST /api/notifications/ban
                         ▼
              [Notification Service :8081]
                         │
                         ├── Email (console or SMTP)
                         └── SMS (console)
```

## Tech stack

| Layer | Technology |
|-------|------------|
| Frontend | React 19, TypeScript, Vite, Vitest |
| Main API | Java 25, Spring Boot 4, JPA, MySQL |
| Notifications | Java 25, Spring Boot 4 (separate service) |
| CI | GitHub Actions |

## Tests

```bash
cd notification-service && mvn test
cd backend && mvn test
cd frontend && npm ci && npm run test:ci && npm run lint
```

## CI (GitHub Actions)

On every `push` and `pull_request`, [CI Pipeline](.github/workflows/ci.yml) runs:

| Job | Command |
|-----|---------|
| Notification Service Tests | `mvn test` in `notification-service/` |
| Java Unit Tests | `mvn test` in `backend/` |
| React Vitest Tests | `npm run test:ci` in `frontend/` |
| Frontend ESLint | `npm run lint` in `frontend/` |

## Team notes

- După `git pull`, rulați `npm install` în `frontend` dacă s-au schimbat dependențele.
- Start **notification-service** before testing ban flows from the main API.
