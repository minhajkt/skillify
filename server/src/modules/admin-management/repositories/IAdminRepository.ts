import { ICourse } from "../../courses/models/courseModel";
import { IUser } from "../../user-management/models/UserModel";

export interface IAdminRepository {
  findAllStudents(): Promise<IUser[]>;
  updateUser(id: String, userData: Partial<IUser>): Promise<IUser | null>;
  findAllTutors(): Promise<IUser[]>;
  getUserById(id: String): Promise<IUser | null>;
  getTutorRequests(): Promise<IUser[]>;
  getCourseRequests(): Promise<ICourse[]>;
  updateCourseApproval(id: string, status: string): Promise<ICourse | null>;
  getUserByEmail(email: String): Promise<IUser | null>;
  getAllUsers(): Promise<IUser[]>;
  updateCourseEditApproval(id: string,editStatus: string): Promise<ICourse | null>;

  getAllCourse(): Promise<ICourse[]>;
  getCourseRequests(): Promise<ICourse[]>;

  updatePassword(userId: string, newPassword: string): Promise<IUser | null>;
}