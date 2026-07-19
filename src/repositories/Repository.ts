export interface User {
  id: number;
  name: string;
  email: string;
}

export interface CreateUserDTO {
  name: string;
  email: string;
}

export interface UpdateUserDTO {
  name?: string;
  email?: string;
}

export interface Repository<T> {
  findAll(): Promise<T[]>;
  findById(id: number): Promise<T | null>;
  create(data: CreateUserDTO): Promise<T>;
  update(id: number, data: UpdateUserDTO): Promise<T | null>;
  delete(id: number): Promise<boolean>;
}
