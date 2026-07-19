"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
class UserService {
    userRepo;
    constructor(userRepo) {
        this.userRepo = userRepo;
    }
    async getAllUsers() {
        return this.userRepo.findAll();
    }
    async getUserById(id) {
        return this.userRepo.findById(id);
    }
    async createUser(data) {
        if (!data.name || !data.email) {
            throw new Error("Name and email are required fields.");
        }
        return this.userRepo.create(data);
    }
    async updateUser(id, data) {
        const existing = await this.userRepo.findById(id);
        if (!existing) {
            return null;
        }
        return this.userRepo.update(id, data);
    }
    async deleteUser(id) {
        return this.userRepo.delete(id);
    }
}
exports.UserService = UserService;
