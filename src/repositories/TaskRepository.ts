import db from "../db/database";
import { Task, CreateTaskDTO, UpdateTaskDTO, TaskDbRow } from "../types/task";

/**
 * TaskRepository class encapsulates all database persistence logic using better-sqlite3.
 * Replaces in-memory array operations with parameterized SQL queries (SELECT, INSERT, UPDATE, DELETE).
 */
export class TaskRepository {
  /**
   * Helper utility to convert SQLite integer boolean (0 or 1) to TypeScript boolean (false or true).
   */
  private mapRowToTask(row: TaskDbRow): Task {
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
  public findAll(): Task[] {
    // Execute SQL SELECT query to retrieve all task records
    const stmt = db.prepare("SELECT id, title, done FROM tasks ORDER BY id ASC");
    const rows = stmt.all() as TaskDbRow[];
    
    // Map rows to standard Task format with boolean done values
    return rows.map((row) => this.mapRowToTask(row));
  }

  /**
   * Requirement 7 & 8: Fetch a single task by ID using SQL SELECT ... WHERE id = ? query.
   * Parameterized with '?' placeholder.
   */
  public findById(id: number): Task | null {
    // Execute SQL SELECT query with parameterized ID
    const stmt = db.prepare("SELECT id, title, done FROM tasks WHERE id = ?");
    const row = stmt.get(id) as TaskDbRow | undefined;

    if (!row) {
      return null;
    }

    return this.mapRowToTask(row);
  }

  /**
   * Requirement 7 & 8: Insert a new task into database using SQL INSERT INTO tasks ... VALUES (?, ?).
   * Uses parameterized placeholders for title and done status.
   */
  public create(data: CreateTaskDTO): Task {
    const isDone = data.done ? 1 : 0; // Convert boolean to integer 0 or 1 for SQLite

    // Execute SQL INSERT query with parameterized arguments
    const stmt = db.prepare("INSERT INTO tasks (title, done) VALUES (?, ?)");
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
  public update(id: number, data: UpdateTaskDTO): Task | null {
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
    const stmt = db.prepare("UPDATE tasks SET title = ?, done = ? WHERE id = ?");
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
  public delete(id: number): boolean {
    // Execute SQL DELETE query with parameterized ID
    const stmt = db.prepare("DELETE FROM tasks WHERE id = ?");
    const info = stmt.run(id);

    // info.changes indicates the number of deleted rows
    return info.changes > 0;
  }
}
