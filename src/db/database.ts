import Database from "better-sqlite3";
import path from "path";

// Requirement 2: Automatically locate or create the database file named 'tasks.db' in the project root directory
const dbPath = path.resolve(process.cwd(), "tasks.db");

// Initialize SQLite database instance using better-sqlite3 (creates tasks.db if it doesn't exist)
const db = new Database(dbPath);

// Enable WAL mode (Write-Ahead Logging) for optimal performance and concurrent read safety
db.pragma("journal_mode = WAL");

/**
 * Initialize database schema and initial data seeding.
 * Requirement 3: Create 'tasks' table if it does not exist with columns:
 * - id INTEGER PRIMARY KEY AUTOINCREMENT
 * - title TEXT NOT NULL
 * - done BOOLEAN NOT NULL
 */
export function initDatabase(): void {
  // Execute DDL to ensure table exists
  db.exec(`
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      done BOOLEAN NOT NULL
    );
  `);

  // Requirement 4: Check whether the tasks table is empty on startup
  const countRow = db.prepare("SELECT COUNT(*) AS count FROM tasks").get() as { count: number };

  // If table is empty, insert exactly three example tasks using parameterized SQL
  if (countRow.count === 0) {
    console.log("🌱 'tasks' table is empty. Inserting initial 3 example tasks...");

    // Parameterized INSERT query using '?' placeholders to prevent SQL injection (Requirement 8)
    const insertStmt = db.prepare("INSERT INTO tasks (title, done) VALUES (?, ?)");

    // Execute batch insert in a single atomic transaction
    const seedTransaction = db.transaction(() => {
      insertStmt.run("Learn Node.js & Express framework", 1); // Task 1: completed
      insertStmt.run("Build SQLite REST API with better-sqlite3", 0); // Task 2: pending
      insertStmt.run("Master parameterized SQL queries", 0); // Task 3: pending
    });

    seedTransaction();
    console.log("✅ Successfully seeded 3 example tasks.");
  } else {
    console.log(`ℹ️ 'tasks' table already contains ${countRow.count} records. Skipping seed.`);
  }
}

export default db;
