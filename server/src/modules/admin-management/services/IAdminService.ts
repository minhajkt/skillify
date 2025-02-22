import { ICourse } from "../../courses/models/courseModel";
import { IUser } from "../../user-management/models/UserModel";

export interface IAdminService {
  getAllStudents(): Promise<IUser[]>;
  updateUser(id: string, userData: Partial<IUser>): Promise<IUser | null>;
  getAllTutor(): Promise<IUser[]>;
  getTutorById(id: string): Promise<IUser | null>;
  getStudentById(id: string): Promise<IUser | null>;
  getTutorRequests(): Promise<IUser[]>;
  getCourseRequests(): Promise<ICourse[]>;
  updateCourseApproval(id: string, status: string): Promise<ICourse | null>;
  getAllCourse(): Promise<ICourse[]>;
  updateCourseEditApproval(id: string,editStatus: string): Promise<ICourse | null>;
}