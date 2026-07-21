"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskService = void 0;
/**
 * TaskService class handles business logic and acts as an intermediary between Express controllers and TaskRepository.
 */
class TaskService {
    repository;
    constructor(repository) {
        this.repository = repository;
    }
    /**
     * Retrieves all tasks.
     */
    getAllTasks() {
        return this.repository.findAll();
    }
    /**
     * Retrieves a single task by numeric ID.
     */
    getTaskById(id) {
        return this.repository.findById(id);
    }
    /**
     * Creates a new task with given DTO.
     */
    createTask(dto) {
        return this.repository.create(dto);
    }
    /**
     * Updates an existing task by ID with given DTO.
     */
    updateTask(id, dto) {
        return this.repository.update(id, dto);
    }
    /**
     * Deletes a task by ID.
     */
    deleteTask(id) {
        return this.repository.delete(id);
    }
}
exports.TaskService = TaskService;
