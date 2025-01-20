import { IEnrollment } from "../models/enrollmentModel"

export interface IEnrollmentRepository {
  getAllEnrolledCoursesByStudent(id: string): Promise<IEnrollment[] | null>;
  countEnrollments(): Promise<number>;
  //   getEnrolledCourse(courseId: string): Promise<IEnrollment | null>;
}