import { IUser } from "../../user-management/models/UserModel";

export interface IAdminRepository {
  updateUser(id: String, userData: Partial<IUser>): Promise<IUser | null>;
  getUserByEmail(email: String): Promise<IUser | null>;
  getUserById(id: String): Promise<IUser | null>;
  getAllUsers(): Promise<IUser[]>;
  findAllStudents(): Promise<IUser[]>;
  findAllTutors(): Promise<IUser[]>;
  getTutorRequests(): Promise<IUser[]>;

  updatePassword(userId: string, newPassword: string): Promise<IUser | null>;
}