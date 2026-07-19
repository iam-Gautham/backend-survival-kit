import { Repository, User, CreateUserDTO, UpdateUserDTO } from "../repositories/Repository";

export class UserService {
  constructor(private userRepo: Repository<User>) {}

  async getAllUsers(): Promise<User[]> {
    return this.userRepo.findAll();
  }

  async getUserById(id: number): Promise<User | null> {
    return this.userRepo.findById(id);
  }

  async createUser(data: CreateUserDTO): Promise<User> {
    if (!data.name || !data.email) {
      throw new Error("Name and email are required fields.");
    }
    return this.userRepo.create(data);
  }

  async updateUser(id: number, data: UpdateUserDTO): Promise<User | null> {
    const existing = await this.userRepo.findById(id);
    if (!existing) {
      return null;
    }
    return this.userRepo.update(id, data);
  }

  async deleteUser(id: number): Promise<boolean> {
    return this.userRepo.delete(id);
  }
}
