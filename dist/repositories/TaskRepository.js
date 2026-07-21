"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskRepository = void 0;
const database_1 = __importDefault(require("../db/database"));
/**
 * TaskRepository class encapsulates all database persistence logic using better-sqlite3.
 * Replaces in-memory array operations with parameterized SQL queries (SELECT, INSERT, UPDATE, DELETE).
 */
class TaskRepository {
    /**
     * Helper utility to convert SQLite integer boolean (0 or 1) to TypeScript boolean (false or true).
     */
    mapRowToTask(row) {
        return {
            id: row.id,
            title: row.title,
            done: Boolean(row.done),
        };
    }
    /**
     * Requirement 7 & 8: Fetch all tasks from the database using SQL SELECT query.
     * Parameterized query structure prevents SQL injection.
     */
    findAll() {
        // Execute SQL SELECT query to retrieve all task records
        const stmt = database_1.default.prepare("SELECT id, title, done FROM tasks ORDER BY id ASC");
        const rows = stmt.all();
        // Map rows to standard Task format with boolean done values
        return rows.map((row) => this.mapRowToTask(row));
    }
    /**
     * Requirement 7 & 8: Fetch a single task by ID using SQL SELECT ... WHERE id = ? query.
     * Parameterized with '?' placeholder.
     */
    findById(id) {
        // Execute SQL SELECT query with parameterized ID
        const stmt = database_1.default.prepare("SELECT id, title, done FROM tasks WHERE id = ?");
        const row = stmt.get(id);
        if (!row) {
            return null;
        }
        return this.mapRowToTask(row);
    }
    /**
     * Requirement 7 & 8: Insert a new task into database using SQL INSERT INTO tasks ... VALUES (?, ?).
     * Uses parameterized placeholders for title and done status.
     */
    create(data) {
        const isDone = data.done ? 1 : 0; // Convert boolean to integer 0 or 1 for SQLite
        // Execute SQL INSERT query with parameterized arguments
        const stmt = database_1.default.prepare("INSERT INTO tasks (title, done) VALUES (?, ?)");
        const info = stmt.run(data.title, isDone);
        // Construct and return the newly created task object with auto-generated ID
        const createdId = Number(info.lastInsertRowid);
        return {
            id: createdId,
            title: data.title,
            done: Boolean(data.done),
        };
    }
    /**
     * Requirement 7 & 8: Update an existing task using SQL UPDATE tasks SET title = ?, done = ? WHERE id = ?.
     * Uses parameterized queries and returns updated object or null if not found.
     */
    update(id, data) {
        // First verify if the task exists using parameterized SELECT query
        const existingTask = this.findById(id);
        if (!existingTask) {
            return null;
        }
        // Determine updated field values, maintaining existing values for omitted fields
        const updatedTitle = data.title !== undefined ? data.title : existingTask.title;
        const updatedDoneBool = data.done !== undefined ? data.done : existingTask.done;
        const updatedDoneInt = updatedDoneBool ? 1 : 0;
        // Execute SQL UPDATE query with parameterized values
        const stmt = database_1.default.prepare("UPDATE tasks SET title = ?, done = ? WHERE id = ?");
        stmt.run(updatedTitle, updatedDoneInt, id);
        // Return the updated task object
        return {
            id,
            title: updatedTitle,
            done: updatedDoneBool,
        };
    }
    /**
     * Requirement 7 & 8: Delete a task by ID using SQL DELETE FROM tasks WHERE id = ?.
     * Uses parameterized query and returns true if a row was affected, false otherwise.
     */
    delete(id) {
        // Execute SQL DELETE query with parameterized ID
        const stmt = database_1.default.prepare("DELETE FROM tasks WHERE id = ?");
        const info = stmt.run(id);
        // info.changes indicates the number of deleted rows
        return info.changes > 0;
    }
}
exports.TaskRepository = TaskRepository;
