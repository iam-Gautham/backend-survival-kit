# BE-04: Containerized Stack with Node.js, Express, TypeScript & PostgreSQL

This repository contains a full-stack backend application built to satisfy the **BE-04: Containerize your stack** assignment.

---

## 📌 Features & Architecture

1. **Node.js + Express + TypeScript**: Clean, type-safe REST API server.
2. **Repository Pattern Architecture**:
   - Generic `Repository<T>` interface (`src/repositories/Repository.ts`).
   - `InMemoryRepository` for fast, dependency-free local testing (`src/repositories/InMemoryRepository.ts`).
   - `PostgresRepository` for persistent PostgreSQL database storage (`src/repositories/PostgresRepository.ts`).
3. **Decoupled Business Logic**: `UserService` and Express routes depend **only** on the `Repository<User>` interface. Switching database implementations requires zero changes to application service logic or route handlers.
4. **PostgreSQL in Docker**: Managed via `docker-compose.yml` with automatic database initialization (`src/db/init.sql`).
5. **Data Persistence**: Named Docker volume `postgres_data` ensures PostgreSQL data persists across container restarts and teardowns.
6. **Production Multi-Stage Dockerfile**: Builds TypeScript code into JS in a builder stage, running only lightweight production JS code in the final runtime container.

---

## 📂 Project Structure

```
.
├── docker-compose.yml        # Docker Compose service orchestrator (API + Postgres)
├── Dockerfile                # Multi-stage Docker build file for Node.js API
├── .env                      # Environment variables (Database URL, Port, Repo Type)
├── .env.example              # Environment variables template
├── package.json              # Dependencies and build/run scripts
├── tsconfig.json             # TypeScript compilation configuration
└── src/
    ├── db/
    │   ├── db.ts             # PostgreSQL connection pool using 'pg'
    │   └── init.sql          # Initial SQL schema (users table)
    ├── repositories/
    │   ├── Repository.ts     # Domain interfaces (User, CreateUserDTO, Repository<T>)
    │   ├── InMemoryRepository.ts # In-memory storage implementation
    │   └── PostgresRepository.ts # PostgreSQL database storage implementation
    ├── services/
    │   └── UserService.ts    # Core business logic layer (uses Repository interface)
    ├── routes/
    │   └── userRoutes.ts     # REST API Express routing controller
    └── index.ts              # Express server entry point & Dependency Injection
```

---

## 🚀 Getting Started

### Prerequisites
- [Docker](https://www.docker.com/get-started/) and [Docker Compose](https://docs.docker.com/compose/) installed on your machine.

---

### Environment Setup

Create your `.env` file from `.env.example`:

```bash
cp .env.example .env
```

Ensure `.env` contains:
```env
DATABASE_URL=postgres://postgres:password@postgres:5432/appdb
PORT=3000
REPO_TYPE=postgres
```

---

### Running the Stack with Docker Compose

Start both the API and PostgreSQL containers in a single command:

```bash
docker-compose up --build
```

The server will start at `http://localhost:3000`.

---

## 🔄 Switching Repositories Seamlessly

Requirement #6 requires that switching storage engines does not change service or route code.

- **To use PostgreSQL Repository**: Set `REPO_TYPE=postgres` in `.env`
- **To use In-Memory Repository**: Set `REPO_TYPE=in-memory` in `.env`

Restart the app container (`docker-compose restart app`) to observe the application switch persistence engines automatically!

---

## 🌐 API Endpoint Reference

| Method | Endpoint | Description | Sample Request Body |
| :--- | :--- | :--- | :--- |
| `GET` | `/health` | Server & active repository status | N/A |
| `GET` | `/users` | Get all users | N/A |
| `GET` | `/users/:id` | Get user by ID | N/A |
| `POST` | `/users` | Create a new user | `{"name": "Alice", "email": "alice@example.com"}` |
| `PUT` | `/users/:id` | Update an existing user | `{"name": "Alice Smith", "email": "alice@example.com"}` |
| `DELETE` | `/users/:id` | Delete user by ID | N/A |

### Example cURL Commands

```bash
# 1. Create a user
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{"name": "Gautham", "email": "gautham@example.com"}'

# 2. Get all users
curl http://localhost:3000/users

# 3. Get user by ID
curl http://localhost:3000/users/1

# 4. Update user
curl -X PUT http://localhost:3000/users/1 \
  -H "Content-Type: application/json" \
  -d '{"name": "Gautham Sajith", "email": "gautham@example.com"}'

# 5. Delete user
curl -X DELETE http://localhost:3000/users/1
```

---

## 💾 Verification of Database Persistence (Requirement #10 & #12)

Database data is preserved across container lifecycles using the named volume `postgres_data` mapped to `/var/lib/postgresql/data`.

### Step-by-Step Persistence Test Procedure:

1. **Start the containers**:
   ```bash
   docker-compose up -d --build
   ```

2. **Add a test user via API**:
   ```bash
   curl -X POST http://localhost:3000/users \
     -H "Content-Type: application/json" \
     -d '{"name": "Persistent User", "email": "persist@example.com"}'
   ```

3. **Verify the user was saved**:
   ```bash
   curl http://localhost:3000/users
   # Output: [{"id":1,"name":"Persistent User","email":"persist@example.com"}]
   ```

4. **Stop and remove containers (Simulate container failure / teardown)**:
   ```bash
   docker-compose down
   ```

5. **Restart the containers**:
   ```bash
   docker-compose up -d
   ```

6. **Verify the user data persists**:
   ```bash
   curl http://localhost:3000/users
   # Output: [{"id":1,"name":"Persistent User","email":"persist@example.com"}]
   ```
   **Result**: The user record remains intact because data is saved in the persistent Docker volume `postgres_data`.

> **Note**: To perform a clean reset and purge all stored volume data, run `docker-compose down -v`.
