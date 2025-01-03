import { IAdminRepository } from "../repositories/IAdminRepository";
import { IUser } from "../../user-management/models/UserModel";


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
}