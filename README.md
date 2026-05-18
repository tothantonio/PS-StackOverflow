# PS StackOverflow — ghid pentru echipă

## Setup local

- După `git pull`, rulați `npm install` în `frontend` dacă s-au schimbat dependențele.
- Backend: Java 25, Maven — `cd backend && mvn test`
- Frontend: Node 24+ — `cd frontend && npm ci && npm run test:ci && npm run lint`

## CI (GitHub Actions)

La fiecare `push` și `pull_request` rulează workflow-ul [CI Pipeline](.github/workflows/ci.yml):

| Job | Ce face |
|-----|---------|
| **Java Unit Tests** | `mvn clean test` în `backend/` (H2 în teste, fără MySQL) |
| **React Vitest Tests** | `npm run test:ci` în `frontend/` |
| **Frontend ESLint** | `npm run lint` în `frontend/` |

Vezi rezultatele în tab-ul **Actions** de pe GitHub după push.