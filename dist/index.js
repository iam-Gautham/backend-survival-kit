"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
// Import SQLite database initialization module
const database_1 = require("./db/database");
// Import Task domain components (Repository, Service, Routes)
const TaskRepository_1 = require("./repositories/TaskRepository");
const TaskService_1 = require("./services/TaskService");
const taskRoutes_1 = require("./routes/taskRoutes");
// Load environment variables from .env file
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// Requirement 2, 3, & 4: Automatically initialize tasks.db, create tasks table if not exists, and seed 3 tasks if empty
console.log("⚙️ Initializing SQLite database...");
(0, database_1.initDatabase)();
// Instantiate Repository and Service following Dependency Injection pattern
const taskRepository = new TaskRepository_1.TaskRepository();
const taskService = new TaskService_1.TaskService(taskRepository);
// Global Middleware setup
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Server healthcheck endpoint
app.get("/health", (_req, res) => {
    res.status(200).json({ status: "OK", database: "SQLite (better-sqlite3)" });
});
// Requirement 5 & 9: Mount Task REST API routes at /tasks endpoint
app.use("/tasks", (0, taskRoutes_1.createTaskRouter)(taskService));
// Start Express server
const server = app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📋 Tasks API available at http://localhost:${PORT}/tasks`);
});
exports.default = app;
