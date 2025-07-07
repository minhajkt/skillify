import { UserQueryOptions } from "../../../types/interfaces";
import { ICourse } from "../../courses/models/courseModel";
import { IUser } from "../../user-management/models/UserModel";

export interface IAdminRepository {
  // findAllStudents(): Promise<IUser[]>;
  findAllStudents(
    options: UserQueryOptions
  ): Promise<{ users: IUser[]; total: number }>;
  updateUser(id: String, userData: Partial<IUser>): Promise<IUser | null>;
  findAllTutors(
    options: UserQueryOptions
  ): Promise<{ users: IUser[]; total: number }>;
  getUserById(id: String): Promise<IUser | null>;
  getTutorRequests(search?: string): Promise<IUser[]>;
  getCourseRequests(search?: string): Promise<ICourse[]>;
  updateCourseApproval(id: string, status: string): Promise<ICourse | null>;
  getUserByEmail(email: String): Promise<IUser | null>;
  getAllUsers(): Promise<IUser[]>;
  updateCourseEditApproval(
    id: string,
    editStatus: string
  ): Promise<ICourse | null>;

  // getAllCourse(): Promise<ICourse[]>;
  getAllCourse(params: {
    search: string;
    category: string;
    sort: string;
    order: "asc" | "desc";
    page: number;
    limit: number;
  }): Promise<{ courses: ICourse[]; total: number }>;
  getCourseRequests(): Promise<ICourse[]>;

  updatePassword(userId: string, newPassword: string): Promise<IUser | null>;
}