import mongoose from "mongoose";
import Enrollment, { IEnrollment } from "../models/enrollmentModel";
import { IEnrollmentRepository } from "./IEnrollmentRepository";
import { BaseRepository } from "../../../common/baseRepository";
import Course from '../../courses/models/courseModel'

export class EnrollmentRepository extends BaseRepository<IEnrollment> implements IEnrollmentRepository {
  constructor() {
    super(Enrollment)
  }

  async getAllEnrolledCoursesByStudent(
    id: string
  ): Promise<IEnrollment[] | null> {

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

  async getEnrolledStudents(tutorId: string): Promise<IEnrollment[] | null> {

    const enrollments = await Enrollment.aggregate([
      {
        $lookup: {
          from: "courses",
          localField: "courseId",
          foreignField: "_id",
          as: "course",
        },
      },
      {
        $unwind: "$course",
      },
      {
        $match: {
          "course.createdBy": new mongoose.Types.ObjectId(tutorId),
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "student",
        },
      },
      {
        $unwind: "$student",
      },
    ]);

    return enrollments;
  }

  async countEnrollments(): Promise<number> {
    return Enrollment.countDocuments();
  }

  async totalRevenue(): Promise<number> {
    const totalAmount = await Enrollment.aggregate([
      { $match: { paymentStatus: "Success" } },
      { $group: { _id: null, totalRevenue: { $sum: "$amount" } } },
    ]);
    return totalAmount[0]?.totalRevenue || 0;
  }

  async courseStrength(): Promise<{ name: string; value: number }[]> {
    const result = await Enrollment.aggregate([
      {
        $group: {
          _id: "$courseId",
          value: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "courses",
          localField: "_id",
          foreignField: "_id",
          as: "course",
        },
      },
      { $unwind: "$course" },
      {
        $project: {
          name: "$course.title",
          value: 1,
        },
      },
    ]);

    return result;
  }
  async getRevenueByTimeRange(
    timeRange: string,
    startDate?: string,
    endDate?: string
  ): Promise<any> {
    let matchStage: any = { paymentStatus: "Success" };

    const today = new Date();

    if (timeRange === "daily") {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(today.getDate() - 30);
      matchStage["createdAt"] = { $gte: thirtyDaysAgo };
    } else if (timeRange === "monthly") {
      const startOfYear = new Date(today.getFullYear(), 0, 1);
      matchStage["createdAt"] = { $gte: startOfYear };
    } else if (timeRange === "yearly") {
      const startOfAllTime = new Date("2000-01-01");
      matchStage["createdAt"] = { $gte: startOfAllTime };
    } else if (timeRange === "quarterly") {
      const startOfYear = new Date(today.getFullYear(), Math.floor(today.getMonth() / 3) * 3, 1);
      matchStage["createdAt"] = { $gte: startOfYear };
    } else if (timeRange === "custom" && startDate && endDate) {
      matchStage["createdAt"] = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    let dateFormat = "%Y-%m-%d";
    if (timeRange === "monthly") dateFormat = "%Y-%m";
    if (timeRange === "yearly") dateFormat = "%Y";
    if (timeRange === "quarterly") dateFormat = "%Y-Q%q";

    return await Enrollment.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: { $dateToString: { format: dateFormat, date: "$createdAt" } },
          totalRevenue: { $sum: "$amount" },
        },
      },
      { $sort: { _id: 1 } },
    ]);
  }

  
}