import { Request, Response } from "express";
import { EnrollmentRepository } from "../repositories/enrollmentRepository";
import { EnrollmentService } from "../services/enrollmentService";
import Enrollment from '../models/enrollmentModel'
import { IEnrollmentService } from "../services/IEnrollmentService";
import { IEnrollmentController } from "./IEnrollmentController";



export class enrollmentController implements IEnrollmentController {
  private enrollmentService: IEnrollmentService;
  constructor(enrollmentService: IEnrollmentService) {
    this.enrollmentService = enrollmentService;
  }

  async getAllEnrolledCoursesByStudent(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      // console.log("Entering getAllEnrolledCoursesByStudent controller");
      const id = req.user?.id;
      if (!id) {
        res.status(400).json({ message: "User ID is required" });
        return;
      }
      // console.log("getAllEnrolledCoursesByStudent,, user details", id );

      const enrolledCourses =
        await this.enrollmentService.getAllEnrolledCoursesByStudent(id);

      res.status(200).json(enrolledCourses);
    } catch (error) {
      res
        .status(500)
        .json({
          message: "An unexpected error occured.",
          error: (error as Error).message,
        });
    }
  }

  async totalEnrolledStudents(req: Request, res: Response): Promise<void> {
    try {
      const totalStudents =
        await this.enrollmentService.totalEnrolledStudents();
      res.status(200).json({ total: totalStudents });
    } catch (error) {
      res.status(500).json("Failed to fetch enrollment details");
    }
  }

  // for admin side displaying course strength
  
  // static totalStudentsInEachCourse = async(req: Request, res: Response) => {
  //     try {
  //   const courseId = req.params.courseId;
  //   const count = await Enrollment.countDocuments({
  //     courseId: courseId,
  //     paymentStatus: "Success"
  //   });
  //   res.json({ count });
  // } catch (error) {
  //   res.status(500).json({ error: 'Failed to fetch enrollment count' });
  // }
  // }
}
