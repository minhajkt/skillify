import { IEnrollment } from "../models/enrollmentModel"

export interface IEnrollmentRepository {
  getAllEnrolledCoursesByStudent(id: string): Promise<IEnrollment[] | null>;
  countEnrollments(): Promise<number>;
  totalRevenue(): Promise<number>;
  courseStrength(): Promise<{ name: string; value: number }[]>;
  //   getEnrolledCourse(courseId: string): Promise<IEnrollment | null>;
  getEnrolledStudents(tutorId: string): Promise<IEnrollment[] | null>;
  getRevenueByTimeRange(timeRange: string,startDate?: string,endDate?: string): Promise<any>
}