import { IAdminRepository } from "../repositories/IAdminRepository";
import { IUser } from "../../user-management/models/UserModel";
import { ICourse } from "../../courses/models/courseModel";
import { IAdminService } from "./IAdminService";
import { IUserRepository } from "../../user-management/repositories/IUserRepository";
import { sendCourseApprovalEmail, sendCourseEditApprovalEmail } from "../../../utils/approveEmail";
import { UserQueryOptions } from "../../../types/interfaces";


export class AdminService implements IAdminService {
  private adminRepository: IAdminRepository;

  constructor(adminRepository: IAdminRepository) {
    this.adminRepository = adminRepository;
  }

  // async getAllStudents(): Promise<IUser[]> {
  //   return this.adminRepository.findAllStudents();
  // }

  async getAllStudents(
    options: UserQueryOptions
  ): Promise<{ users: IUser[]; total: number }> {
    return this.adminRepository.findAllStudents(options);
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

  // async getAllTutor(): Promise<IUser[]> {
  //   return this.adminRepository.findAllTutors();
  // }

  async getAllTutor(
    options: UserQueryOptions & { status?: string }
  ): Promise<{ users: IUser[]; total: number }> {
    return this.adminRepository.findAllTutors(options);
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

  async getTutorRequests(search?: string): Promise<IUser[]> {
    const tutorRequests = this.adminRepository.getTutorRequests(search);
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

  async getCourseRequests(search?: string): Promise<ICourse[]> {
    const courseRequests = this.adminRepository.getCourseRequests(search);
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

  // async getAllCourse(): Promise<ICourse[]> {
  //   const allCourses = await this.adminRepository.getAllCourse();
  //   if (!allCourses) {
  //     throw new Error("No courses found");
  //   }
  //   return allCourses;
  // }
  async getAllCourse(params: {
    search: string;
    category: string;
    sort: string;
    order: "asc" | "desc";
    page: number;
    limit: number;
  }): Promise<{ courses: ICourse[]; total: number }> {
    const { search, category, sort, order, page, limit } = params;

    const result = await this.adminRepository.getAllCourse({
      search,
      category,
      sort,
      order,
      page,
      limit,
    });

    return result;
  }
}