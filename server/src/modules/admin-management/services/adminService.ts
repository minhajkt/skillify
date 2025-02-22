import { IAdminRepository } from "../repositories/IAdminRepository";
import { IUser } from "../../user-management/models/UserModel";
import { ICourse } from "../../courses/models/courseModel";
import { IAdminService } from "./IAdminService";
import { IUserRepository } from "../../user-management/repositories/IUserRepository";
import { sendCourseApprovalEmail, sendCourseEditApprovalEmail } from "../../../utils/approveEmail";


export class AdminService implements IAdminService {
  private adminRepository: IAdminRepository;

  constructor(adminRepository: IAdminRepository) {
    this.adminRepository = adminRepository;
  }

  async getAllStudents(): Promise<IUser[]> {
    return this.adminRepository.findAllStudents();
  }

  async updateUser(
    id: string,
    userData: Partial<IUser>
  ): Promise<IUser | null> {
    if (!id) {
      throw new Error("User ID is required");
    }

    const updatedUser = this.adminRepository.updateUser(id, userData);
    if (!updatedUser) {
      throw new Error("User not found");
    }
    return updatedUser;
  }

  async getAllTutor(): Promise<IUser[]> {
    return this.adminRepository.findAllTutors();
  }

  async getTutorById(id: string): Promise<IUser | null> {
    if (!id) {
      throw new Error("ID is not found");
    }

    const tutor = this.adminRepository.getUserById(id);
    if (!tutor) {
      throw new Error("Tutor not found");
    }
    return tutor;
  }

  async getStudentById(id: string): Promise<IUser | null> {
    if (!id) {
      throw new Error("ID is not found");
    }

    const student = this.adminRepository.getUserById(id);
    if (!student) {
      throw new Error("Student not found");
    }
    return student;
  }

  async getTutorRequests(): Promise<IUser[]> {
    const tutorRequests = this.adminRepository.getTutorRequests();
    if (!tutorRequests) {
      throw new Error("No requests pending");
    }
    return tutorRequests;
  }

  async updatetutorRequest(
    id: string,
    userData: Partial<IUser>
  ): Promise<IUser | null> {
    const updatedTutor = this.adminRepository.updateUser(id, userData);
    if (!updatedTutor) {
      throw new Error("Tutor not found");
    }
    return updatedTutor;
  }

  async getCourseRequests(): Promise<ICourse[]> {
    const courseRequests = this.adminRepository.getCourseRequests();
    if (!courseRequests) {
      throw new Error("No course requests found");
    }
    return courseRequests;
  }

  async updateCourseApproval(
    id: string,
    status: string
  ): Promise<ICourse | null> {
    const updatedCourse = await this.adminRepository.updateCourseApproval(
      id,
      status
    );
    if (!updatedCourse) {
      throw new Error("No updated course found");
    }
    const tutor = await this.adminRepository.getUserById(
      updatedCourse.createdBy.toString()
    );
    if (!tutor) {
      throw new Error("Tutor not found");
    }

    await sendCourseApprovalEmail(tutor.email, tutor.name, status);
    return updatedCourse;
  }

  async updateCourseEditApproval(
    id: string,
    editStatus: string
  ): Promise<ICourse | null> {
    const updatedCourse = await this.adminRepository.updateCourseEditApproval(
      id,
      editStatus
    );
    if (!updatedCourse) {
      throw new Error("No updated course found");
    }
    const tutor = await this.adminRepository.getUserById(
      updatedCourse.createdBy.toString()
    );
    if (!tutor) {
      throw new Error("Tutor not found");
    }


    await sendCourseEditApprovalEmail(tutor.email, tutor.name, editStatus);

    return updatedCourse;
  }

  async getAllCourse(): Promise<ICourse[]> {
    const allCourses = await this.adminRepository.getAllCourse();
    if (!allCourses) {
      throw new Error("No courses found");
    }
    return allCourses;
  }
}