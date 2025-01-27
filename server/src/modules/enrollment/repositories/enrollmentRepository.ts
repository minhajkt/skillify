import Enrollment, { IEnrollment } from "../models/enrollmentModel";
import { IEnrollmentRepository } from "./IEnrollmentRepository";


export class EnrollmentRepository implements IEnrollmentRepository{
  
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

  async totalRevenue (): Promise<number> {
    const totalAmount = await Enrollment.aggregate([
      {$match: {paymentStatus: "Success"}},
      {$group: {_id: null, totalRevenue: {$sum: "$amount"}}}
    ])
    return totalAmount[0]?.totalRevenue || 0;
  }

  async courseStrength (): Promise<{name: string,value: number}[]> {
    const result = await Enrollment.aggregate([
      { $group: {
        _id: "$courseId",
        value: {$sum: 1}
      }},
      {$lookup: {
        from : "courses",
        localField: "_id",
        foreignField: "_id",
        as : 'course'
      }},
      {$unwind: "$course"},
      {
        $project: {
          name: "$course.title",
          value: 1
        }
      }
    ])
    // console.log(result);
    
    return result;
  }
  //   async getEnrolledCourse(courseId: string): Promise<IEnrollment | null> {
  //     return await Enrollment.findById(courseId);
  //   }
}