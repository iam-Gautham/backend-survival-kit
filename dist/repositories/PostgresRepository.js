"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostgresRepository = void 0;
const db_1 = require("../db/db");
class PostgresRepository {
    db;
    constructor(dbPool) {
        this.db = dbPool || db_1.pool;
    }
    async findAll() {
        const result = await this.db.query("SELECT id, name, email FROM users ORDER BY id ASC");
        return result.rows;
    }
    async findById(id) {
        const result = await this.db.query("SELECT id, name, email FROM users WHERE id = $1", [id]);
        return result.rows[0] || null;
    }
    async create(data) {
        const result = await this.db.query("INSERT INTO users (name, email) VALUES ($1, $2) RETURNING id, name, email", [data.name, data.email]);
        return result.rows[0];
    }
    async update(id, data) {
        const existing = await this.findById(id);
        if (!existing) {
            return null;
        }
        const name = data.name !== undefined ? data.name : existing.name;
        const email = data.email !== undefined ? data.email : existing.email;
        const result = await this.db.query("UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING id, name, email", [name, email, id]);
        return result.rows[0] || null;
    }
    async delete(id) {
        const result = await this.db.query("DELETE FROM users WHERE id = $1", [id]);
        return (result.rowCount ?? 0) > 0;
    }
}
exports.PostgresRepository = PostgresRepository;
