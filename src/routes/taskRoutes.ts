import { Router, Request, Response } from "express";
import { TaskService } from "../services/TaskService";

/**
 * Factory function creating Express Router for Task endpoints (/tasks).
 * Ensures correct status codes: 200 (GET/PUT), 201 (POST), 204 (DELETE), 400 (Bad Request), 404 (Not Found).
 */
export function createTaskRouter(taskService: TaskService): Router {
  const router = Router();

  /**
   * Requirement 5 & 6: GET /tasks - Retrieve all tasks
   * Returns: HTTP 200 OK with array of tasks
   */
  router.get("/", (_req: Request, res: Response) => {
    try {
      const tasks = taskService.getAllTasks();
      res.status(200).json(tasks);
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Failed to fetch tasks" });
    }
  });

  /**
   * Requirement 5 & 6: GET /tasks/:id - Retrieve a specific task by ID
   * Returns: HTTP 200 OK with task object, 400 for invalid ID format, or 404 if task not found
   */
  router.get("/:id", (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id, 10);
      
      // Validation: Ensure ID is a valid positive integer (HTTP 400)
      if (isNaN(id) || id <= 0) {
        return res.status(400).json({ error: "Invalid task ID format" });
      }

      const task = taskService.getTaskById(id);

      // Check if task exists (HTTP 404)
      if (!task) {
        return res.status(404).json({ error: "Task not found" });
      }

      // Success response (HTTP 200)
      res.status(200).json(task);
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Failed to fetch task" });
    }
  });

  /**
   * Requirement 5 & 6: POST /tasks - Create a new task
   * Body: { title: string, done?: boolean }
   * Returns: HTTP 201 Created with created task object, or 400 for invalid body
   */
  router.post("/", (req: Request, res: Response) => {
    try {
      const { title, done } = req.body || {};

      // Validation: Title is required and must be a non-empty string (HTTP 400)
      if (!title || typeof title !== "string" || !title.trim()) {
        return res.status(400).json({ error: "Task 'title' is required and must be a non-empty string" });
      }

      // Validation: If 'done' field is provided, it must be a boolean (HTTP 400)
      if (done !== undefined && typeof done !== "boolean") {
        return res.status(400).json({ error: "'done' field must be a boolean (true or false)" });
      }

      // Create new task record in SQLite database
      const newTask = taskService.createTask({
        title: title.trim(),
        done: Boolean(done),
      });

      // Success response (HTTP 201 Created)
      res.status(201).json(newTask);
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Failed to create task" });
    }
  });

  /**
   * Requirement 5 & 6: PUT /tasks/:id - Update an existing task by ID
   * Body: { title?: string, done?: boolean }
   * Returns: HTTP 200 OK with updated task, 400 for invalid request, or 404 if task not found
   */
  router.put("/:id", (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id, 10);

      // Validation: Ensure ID is a valid positive integer (HTTP 400)
      if (isNaN(id) || id <= 0) {
        return res.status(400).json({ error: "Invalid task ID format" });
      }

      const { title, done } = req.body || {};

      // Validation: Ensure at least one update field is provided (HTTP 400)
      if (title === undefined && done === undefined) {
        return res.status(400).json({ error: "At least one field ('title' or 'done') must be provided for update" });
      }

      // Validation: Validate 'title' type if provided (HTTP 400)
      if (title !== undefined && (typeof title !== "string" || !title.trim())) {
        return res.status(400).json({ error: "Task 'title' must be a non-empty string" });
      }

      // Validation: Validate 'done' type if provided (HTTP 400)
      if (done !== undefined && typeof done !== "boolean") {
        return res.status(400).json({ error: "'done' field must be a boolean" });
      }

      // Perform update in SQLite database
      const updatedTask = taskService.updateTask(id, {
        title: title !== undefined ? title.trim() : undefined,
        done: done !== undefined ? done : undefined,
      });

      // Check if task was found and updated (HTTP 404)
      if (!updatedTask) {
        return res.status(404).json({ error: "Task not found" });
      }

      // Success response (HTTP 200 OK)
      res.status(200).json(updatedTask);
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Failed to update task" });
    }
  });

  /**
   * Requirement 5 & 6: DELETE /tasks/:id - Delete a task by ID
   * Returns: HTTP 204 No Content on success, 400 for invalid ID, or 404 if task not found
   */
  router.delete("/:id", (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id, 10);

      // Validation: Ensure ID is a valid positive integer (HTTP 400)
      if (isNaN(id) || id <= 0) {
        return res.status(400).json({ error: "Invalid task ID format" });
      }

      const deleted = taskService.deleteTask(id);

      // Check if task existed and was deleted (HTTP 404)
      if (!deleted) {
        return res.status(404).json({ error: "Task not found" });
      }

      // Success response (HTTP 204 No Content)
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Failed to delete task" });
    }
  });

  return router;
}
