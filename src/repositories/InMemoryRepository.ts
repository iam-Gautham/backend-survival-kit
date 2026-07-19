import { Repository, User, CreateUserDTO, UpdateUserDTO } from "./Repository";

export class InMemoryRepository implements Repository<User> {
  private users: Map<number, User> = new Map();
  private currentId: number = 1;

  async findAll(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async findById(id: number): Promise<User | null> {
    return this.users.get(id) || null;
  }

  async create(data: CreateUserDTO): Promise<User> {
    // Check for unique email constraint in memory
    for (const user of this.users.values()) {
      if (user.email === data.email) {
        throw new Error(`User with email '${data.email}' already exists.`);
      }
    }

    const newUser: User = {
      id: this.currentId++,
      name: data.name,
      email: data.email,
    };

    this.users.set(newUser.id, newUser);
    return newUser;
  }

  async update(id: number, data: UpdateUserDTO): Promise<User | null> {
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

    const updatedUser: User = {
      ...existing,
      name: data.name !== undefined ? data.name : existing.name,
      email: data.email !== undefined ? data.email : existing.email,
    };

    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async delete(id: number): Promise<boolean> {
    return this.users.delete(id);
  }
}
