import { IUser } from "../models/UserModel";

export interface IUserRepository {
  createUser(userData: Partial<IUser>): Promise<IUser>;
  updateUser(id: string, userData: Partial<IUser>): Promise<IUser | null>;
  getUserByEmail(email: string): Promise<IUser | null>;
  getUserById(id: string): Promise<IUser | null>;
  getAllUsers(): Promise<IUser[]>;
  findAllStudents(): Promise<IUser[]>;
  findAllTutors(isApproved: boolean): Promise<IUser[]>;

  updatePassword(userId: string, newPassword: string): Promise<IUser | null>;
}
