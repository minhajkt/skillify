import Enrollment, { IEnrollment } from "../models/enrollmentModel";
import { IEnrollmentRepository } from "./IEnrollmentRepository";


export class EnrollmentRepository implements IEnrollmentRepository{
  // async createEnrollment(enrollmentData: Partial<IEnrollment>): Promise<IEnrollment> {
  //     const enrollment = new Enrollment(enrollmentData)
  //     return await enrollment.save()
  // }

  
  async getAllEnrolledCoursesByStudent(
    id: string
  ): Promise<IEnrollment[] | null> {
    // return await Enrollment.find({userId: id}).populate('courseId').populate("courseId.createdBy", "name").exec()
    return await Enrollment.find({ userId: id })
    .populate({
      path: "courseId",
      populate: {
        path: "createdBy",
        select: "name",
      },
    })
    .exec();
  }

  async countEnrollments(): Promise<number> {
    return Enrollment.countDocuments();
  }

  //   async getEnrolledCourse(courseId: string): Promise<IEnrollment | null> {
  //     return await Enrollment.findById(courseId);
  //   }
}