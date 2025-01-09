import { IAdminRepository } from "../repositories/IAdminRepository";
import { IUser } from "../../user-management/models/UserModel";
import { ICourse } from "../../courses/models/courseModel";


export class AdminService {
  private adminRepository: IAdminRepository;

  constructor(adminRepository: IAdminRepository) {
    this.adminRepository = adminRepository;
  }

  async getAllStudents() {
    return this.adminRepository.findAllStudents();
  }

  async getAllTutor() {
    return this.adminRepository.findAllTutors();
  }

  async getTutorById(id: string) {
    return this.adminRepository.getUserById(id);
  }

  async getTutorRequests() {
    return this.adminRepository.getTutorRequests();
  }

  async getCourseRequests() {
    return this.adminRepository.getCourseRequests();
  }

  async updateUser(
    id: string,
    userData: Partial<IUser>
  ): Promise<IUser | null> {
    return this.adminRepository.updateUser(id, userData);
  }

  async updatetutorRequest(
    id: string,
    userData: Partial<IUser>
  ): Promise<IUser | null> {
    return this.adminRepository.updateUser(id, userData);
  }

  async getAllCourse(): Promise<ICourse[]> {
    return await this.adminRepository.getAllCourse();
  }

  // async getAllCourseForFrontend(): Promise<ICourse[]> {
  //   return await this.adminRepository.getAllCourseForFrontend();
  // }

  async updateCourseApproval(
    id: string,
    status: string
  ): Promise<ICourse | null> {
    return await this.adminRepository.updateCourseApproval(id, status);
  }
}