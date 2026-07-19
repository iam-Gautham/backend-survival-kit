"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemoryRepository = void 0;
class InMemoryRepository {
    users = new Map();
    currentId = 1;
    async findAll() {
        return Array.from(this.users.values());
    }
    async findById(id) {
        return this.users.get(id) || null;
    }
    async create(data) {
        // Check for unique email constraint in memory
        for (const user of this.users.values()) {
            if (user.email === data.email) {
                throw new Error(`User with email '${data.email}' already exists.`);
            }
        }
        const newUser = {
            id: this.currentId++,
            name: data.name,
            email: data.email,
        };
        this.users.set(newUser.id, newUser);
        return newUser;
    }
    async update(id, data) {
        const existing = this.users.get(id);
        if (!existing) {
            return null;
        }
        if (data.email && data.email !== existing.email) {
            for (const user of this.users.values()) {
                if (user.id !== id && user.email === data.email) {
                    throw new Error(`User with email '${data.email}' already exists.`);
                }
            }
        }
        const updatedUser = {
            ...existing,
            name: data.name !== undefined ? data.name : existing.name,
            email: data.email !== undefined ? data.email : existing.email,
        };
        this.users.set(id, updatedUser);
        return updatedUser;
    }
    async delete(id) {
        return this.users.delete(id);
    }
}
exports.InMemoryRepository = InMemoryRepository;
