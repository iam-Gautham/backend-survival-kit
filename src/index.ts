import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// Import SQLite database initialization module
import { initDatabase } from "./db/database";

// Import Task domain components (Repository, Service, Routes)
import { TaskRepository } from "./repositories/TaskRepository";
import { TaskService } from "./services/TaskService";
import { createTaskRouter } from "./routes/taskRoutes";

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Requirement 2, 3, & 4: Automatically initialize tasks.db, create tasks table if not exists, and seed 3 tasks if empty
console.log("⚙️ Initializing SQLite database...");
initDatabase();

// Instantiate Repository and Service following Dependency Injection pattern
const taskRepository = new TaskRepository();
const taskService = new TaskService(taskRepository);

// Global Middleware setup
app.use(cors());
app.use(express.json());

// Server healthcheck endpoint
app.get("/health", (_req, res) => {
  res.status(200).json({ status: "OK", database: "SQLite (better-sqlite3)" });
});

// Requirement 5 & 9: Mount Task REST API routes at /tasks endpoint
app.use("/tasks", createTaskRouter(taskService));

// Start Express server
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📋 Tasks API available at http://localhost:${PORT}/tasks`);
});

export default app;
