import { IUser } from "../models/UserModel";
import {ICourse} from '../../courses/models/courseModel'
 
export interface IUserRepository {
  createUser(userData: Partial<IUser>): Promise<IUser>;
  updateUser(id: string, userData: Partial<IUser>): Promise<IUser | null>;
  getUserByEmail(email: string): Promise<IUser | null>;
  getUserById(id: string): Promise<IUser | null>;
  // getAllUsers(): Promise<IUser[]>;
  // findAllStudents(): Promise<IUser[]>;
  findAllTutors(approvalStatus: string): Promise<number>;
  findAllStudents(): Promise<IUser[]>;
  getCourseById(courseId: string): Promise<IUser | null>;
  // getAllCourseForUser(): Promise<ICourse[]>;

  updatePassword(userId: string, newPassword: string): Promise<IUser | null>;
}
