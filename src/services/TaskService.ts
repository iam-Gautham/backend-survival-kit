import { TaskRepository } from "../repositories/TaskRepository";
import { Task, CreateTaskDTO, UpdateTaskDTO } from "../types/task";

/**
 * TaskService class handles business logic and acts as an intermediary between Express controllers and TaskRepository.
 */
export class TaskService {
  private repository: TaskRepository;

  constructor(repository: TaskRepository) {
    this.repository = repository;
  }

  /**
   * Retrieves all tasks.
   */
  public getAllTasks(): Task[] {
    return this.repository.findAll();
  }

  /**
   * Retrieves a single task by numeric ID.
   */
  public getTaskById(id: number): Task | null {
    return this.repository.findById(id);
  }

  /**
   * Creates a new task with given DTO.
   */
  public createTask(dto: CreateTaskDTO): Task {
    return this.repository.create(dto);
  }

  /**
   * Updates an existing task by ID with given DTO.
   */
  public updateTask(id: number, dto: UpdateTaskDTO): Task | null {
    return this.repository.update(id, dto);
  }

  /**
   * Deletes a task by ID.
   */
  public deleteTask(id: number): boolean {
    return this.repository.delete(id);
  }
}
