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

  async getTutorRequests() {
    return this.adminRepository.getTutorRequests();
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
    return await this.adminRepository.getAllCourse()
  }

  async getCourseRequests(): Promise<ICourse[]> {
    return await this.adminRepository.getCourseRequests()
  }

  async updateCourseApproval(id: string, status: string): Promise<ICourse | null> {
    return await this.adminRepository.updateCourseApproval(id, status)
  }

}