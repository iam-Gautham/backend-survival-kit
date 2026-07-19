"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const InMemoryRepository_1 = require("./repositories/InMemoryRepository");
const PostgresRepository_1 = require("./repositories/PostgresRepository");
const UserService_1 = require("./services/UserService");
const userRoutes_1 = require("./routes/userRoutes");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
const REPO_TYPE = process.env.REPO_TYPE || "postgres";
// Repository Selection based on environment variable
let repository;
if (REPO_TYPE.toLowerCase() === "in-memory") {
    console.log("⚡ Using InMemoryRepository persistence");
    repository = new InMemoryRepository_1.InMemoryRepository();
}
else {
    console.log("🐘 Using PostgresRepository persistence");
    repository = new PostgresRepository_1.PostgresRepository();
}
// Dependency Injection: Repository -> Service
const userService = new UserService_1.UserService(repository);
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Healthcheck endpoint
app.get("/health", (_req, res) => {
    res.status(200).json({ status: "OK", repository: REPO_TYPE });
});
// User API Routes
app.use("/users", (0, userRoutes_1.createUserRouter)(userService));
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`Active Repository implementation: ${repository.constructor.name}`);
});
exports.default = app;
