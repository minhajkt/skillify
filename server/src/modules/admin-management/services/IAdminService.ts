import { UserQueryOptions } from "../../../types/interfaces";
import { ICourse } from "../../courses/models/courseModel";
import { IUser } from "../../user-management/models/UserModel";

export interface IAdminService {
  // getAllStudents(): Promise<IUser[]>;
  getAllStudents(
    options: UserQueryOptions
  ): Promise<{ users: IUser[]; total: number }>;
  updateUser(id: string, userData: Partial<IUser>): Promise<IUser | null>;
  // getAllTutor(): Promise<IUser[]>;
  getAllTutor(
    options: UserQueryOptions & { status?: string }
  ): Promise<{ users: IUser[]; total: number }>;

  getTutorById(id: string): Promise<IUser | null>;
  getStudentById(id: string): Promise<IUser | null>;
  getTutorRequests(search?: string): Promise<IUser[]>;
  getCourseRequests(search?: string): Promise<ICourse[]>;
  updateCourseApproval(id: string, status: string): Promise<ICourse | null>;
  // getAllCourse(): Promise<ICourse[]>;
  getAllCourse(params: {
    search: string;
    category: string;
    sort: string;
    order: "asc" | "desc";
    page: number;
    limit: number;
  }): Promise<{ courses: ICourse[]; total: number }>;
  updateCourseEditApproval(
    id: string,
    editStatus: string
  ): Promise<ICourse | null>;
}