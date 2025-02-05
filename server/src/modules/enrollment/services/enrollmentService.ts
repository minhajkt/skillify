import {IEnrollment} from "../models/enrollmentModel"
import { IEnrollmentRepository } from "../repositories/IEnrollmentRepository"
import { IEnrollmentService } from "./IEnrollmentService";

export class EnrollmentService implements IEnrollmentService {
  private enrollmentRepo: IEnrollmentRepository;
  constructor(enrollmentRepo: IEnrollmentRepository) {
    this.enrollmentRepo = enrollmentRepo;
  }

  async getAllEnrolledCoursesByStudent(
    id: string
  ): Promise<IEnrollment[] | null> {
    const enrolledCourses =
      await this.enrollmentRepo.getAllEnrolledCoursesByStudent(id);
    if (!enrolledCourses || enrolledCourses.length === 0) {
      throw new Error("No courses enrolled");
    }
    return enrolledCourses;
  }

  async getEnrolledStudents(tutorId: string): Promise<IEnrollment[] | null> {
    const enrolledStudents = await this.enrollmentRepo.getEnrolledStudents(
      tutorId
    );
    if (!enrolledStudents || enrolledStudents.length === 0) {
      throw new Error("No students enrolled");
    }
    return enrolledStudents;
  }



  async totalEnrolledStudents(): Promise<number> {
    const totalStudents = await this.enrollmentRepo.countEnrollments();
    return totalStudents;
  }

  async totalRevenue(): Promise<number> {
    const totalRevenue = await this.enrollmentRepo.totalRevenue();
    return totalRevenue;
  }

  async courseStrength(): Promise<{ name: string; value: number }[]> {
    const courseStrength = await this.enrollmentRepo.courseStrength();
    return courseStrength;
  }

  async getRevenueReport(timeRange: string, startDate?: string, endDate?: string): Promise<any> {
        return await this.enrollmentRepo.getRevenueByTimeRange(timeRange, startDate, endDate);
    }
}