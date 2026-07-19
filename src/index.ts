import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { Repository, User } from "./repositories/Repository";
import { InMemoryRepository } from "./repositories/InMemoryRepository";
import { PostgresRepository } from "./repositories/PostgresRepository";
import { UserService } from "./services/UserService";
import { createUserRouter } from "./routes/userRoutes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const REPO_TYPE = process.env.REPO_TYPE || "postgres";

// Repository Selection based on environment variable
let repository: Repository<User>;

if (REPO_TYPE.toLowerCase() === "in-memory") {
  console.log("⚡ Using InMemoryRepository persistence");
  repository = new InMemoryRepository();
} else {
  console.log("🐘 Using PostgresRepository persistence");
  repository = new PostgresRepository();
}

// Dependency Injection: Repository -> Service
const userService = new UserService(repository);

// Middleware
app.use(cors());
app.use(express.json());

// Healthcheck endpoint
app.get("/health", (_req, res) => {
  res.status(200).json({ status: "OK", repository: REPO_TYPE });
});

// User API Routes
app.use("/users", createUserRouter(userService));

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`Active Repository implementation: ${repository.constructor.name}`);
});

export default app;
