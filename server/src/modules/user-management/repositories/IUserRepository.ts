import { IUser } from "../models/UserModel";

export interface IUserRepository {
  createUser(userData: Partial<IUser>): Promise<IUser>;
  updateUser(id: String, userData: Partial<IUser>): Promise<IUser | null>;
  getUserByEmail(email: String): Promise<IUser | null>;
  getUserById(id: String): Promise<IUser | null>;
  getAllUsers(): Promise<IUser[]>;
  updatePassword(userId: string, newPassword: string): Promise<IUser | null>;
}

