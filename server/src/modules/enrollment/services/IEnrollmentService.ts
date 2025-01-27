import { IEnrollment } from "../models/enrollmentModel";

export interface IEnrollmentService {
  getAllEnrolledCoursesByStudent(id: string): Promise<IEnrollment[] | null>;
  totalEnrolledStudents(): Promise<number>;
  totalRevenue(): Promise<number>;
  courseStrength(): Promise<{ name: string; value: number }[]>;
}