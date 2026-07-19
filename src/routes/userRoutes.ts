import { Router, Request, Response } from "express";
import { UserService } from "../services/UserService";

export function createUserRouter(userService: UserService): Router {
  const router = Router();

  // GET /users - List all users
  router.get("/", async (_req: Request, res: Response) => {
    try {
      const users = await userService.getAllUsers();
      res.json(users);
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Failed to fetch users" });
    }
  });

  // GET /users/:id - Get user by ID
  router.get("/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid user ID" });
      }
      const user = await userService.getUserById(id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user);
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Failed to fetch user" });
    }
  });

  // POST /users - Create new user
  router.post("/", async (req: Request, res: Response) => {
    try {
      const { name, email } = req.body;
      if (!name || !email) {
        return res.status(400).json({ error: "Name and email are required" });
      }
      const newUser = await userService.createUser({ name, email });
      res.status(201).json(newUser);
    } catch (error: any) {
      if (error.code === "23505" || error.message?.includes("already exists")) {
        return res.status(409).json({ error: "Email already in use" });
      }
      res.status(500).json({ error: error.message || "Failed to create user" });
    }
  });

  // PUT /users/:id - Update user by ID
  router.put("/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid user ID" });
      }
      const { name, email } = req.body;
      const updatedUser = await userService.updateUser(id, { name, email });
      if (!updatedUser) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(updatedUser);
    } catch (error: any) {
      if (error.code === "23505" || error.message?.includes("already exists")) {
        return res.status(409).json({ error: "Email already in use" });
      }
      res.status(500).json({ error: error.message || "Failed to update user" });
    }
  });

  // DELETE /users/:id - Delete user by ID
  router.delete("/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid user ID" });
      }
      const deleted = await userService.deleteUser(id);
      if (!deleted) {
        return res.status(404).json({ error: "User not found" });
      }
      res.status(200).json({ message: "User deleted successfully" });
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Failed to delete user" });
    }
  });

  return router;
}
