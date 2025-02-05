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

      if (!enrolledCourses || enrolledCourses.length === 0) {
        res.status(404).json("No courses enrolled");
      }

      res.status(200).json(enrolledCourses);
    } catch (error) {
      console.log("no course");

      res.status(500).json({
        message: "An unexpected error occured.",
        error: (error as Error).message,
      });
    }
  }

  async getTutorsStudents(req: Request, res: Response): Promise<void> {
    try {
      const tutorId = req.user?.id;

      if (!tutorId) {
        res.status(400).json({ message: "User ID is required" });
        return;
      }

      const enrolledStudents = await this.enrollmentService.getEnrolledStudents(
        tutorId
      );

      if (!enrolledStudents || enrolledStudents.length === 0) {
        res.status(404).json("No students enrolled");
      }

      res.status(200).json(enrolledStudents);
    } catch (error) {
      res.status(500).json({
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

  async totalRevenue(req: Request, res: Response): Promise<void> {
    try {
      const totalRevenue = await this.enrollmentService.totalRevenue();
      if (!totalRevenue) {
        res.status(404).json("Cannot find total revenue");
        return;
      }
      res.status(200).json(totalRevenue);
    } catch (error) {
      console.log("error occured while finding total revenue", error);
      res.status(500).json("An unexpected error occured");
    }
  }

  async courseStrength(req: Request, res: Response): Promise<void> {
    try {
      const courseStrength = await this.enrollmentService.courseStrength();
      if (!courseStrength) {
        res.status(404).json("No course strength found");
        return;
      }
      // console.log(courseStrength);

      res.status(200).json(courseStrength);
    } catch (error) {
      console.log("Failed to get course Strength", error);
      res.status(500).json("An unexpected error occured");
    }
  }

  async revenueReport(req: Request, res: Response): Promise<void> {
    try {
      const { timeRange, startDate, endDate } = req.query;
      const reportData = await this.enrollmentService.getRevenueReport(
        timeRange as string,
        startDate as string,
        endDate as string
      );
      res.status(200).json(reportData);
    } catch (error) {
      console.log("Error fetching revenue report", error);
      res.status(500).json("An unexpected error occurred");
    }
  }

  
}
