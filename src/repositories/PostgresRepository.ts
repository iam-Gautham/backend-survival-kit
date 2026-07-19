import { Pool } from "pg";
import { Repository, User, CreateUserDTO, UpdateUserDTO } from "./Repository";
import { pool } from "../db/db";

export class PostgresRepository implements Repository<User> {
  private db: Pool;

  constructor(dbPool?: Pool) {
    this.db = dbPool || pool;
  }

  async findAll(): Promise<User[]> {
    const result = await this.db.query<User>(
      "SELECT id, name, email FROM users ORDER BY id ASC"
    );
    return result.rows;
  }

  async findById(id: number): Promise<User | null> {
    const result = await this.db.query<User>(
      "SELECT id, name, email FROM users WHERE id = $1",
      [id]
    );
    return result.rows[0] || null;
  }

  async create(data: CreateUserDTO): Promise<User> {
    const result = await this.db.query<User>(
      "INSERT INTO users (name, email) VALUES ($1, $2) RETURNING id, name, email",
      [data.name, data.email]
    );
    return result.rows[0];
  }

  async update(id: number, data: UpdateUserDTO): Promise<User | null> {
    const existing = await this.findById(id);
    if (!existing) {
      return null;
    }

    const name = data.name !== undefined ? data.name : existing.name;
    const email = data.email !== undefined ? data.email : existing.email;

    const result = await this.db.query<User>(
      "UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING id, name, email",
      [name, email, id]
    );

    return result.rows[0] || null;
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.db.query(
      "DELETE FROM users WHERE id = $1",
      [id]
    );
    return (result.rowCount ?? 0) > 0;
  }
}
