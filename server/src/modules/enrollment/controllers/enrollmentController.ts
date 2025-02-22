import { Request, Response } from "express";
import { EnrollmentRepository } from "../repositories/enrollmentRepository";
import { EnrollmentService } from "../services/enrollmentService";
import Enrollment from '../models/enrollmentModel'
import { IEnrollmentService } from "../services/IEnrollmentService";
import { IEnrollmentController } from "./IEnrollmentController";
import { Users } from "../../../types/interfaces";
import { HttpStatus } from "../../../constants/httpStatus";
import { MESSAGES } from "../../../constants/messages";



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
      const id = (req.user as Users)?.id;
      if (!id) {
        res.status(HttpStatus.BAD_REQUEST).json({ message: MESSAGES.USER_ID_REQUIRED });
        return;
      }

      const enrolledCourses =
        await this.enrollmentService.getAllEnrolledCoursesByStudent(id);

      if (!enrolledCourses || enrolledCourses.length === 0) {
        res.status(HttpStatus.NOT_FOUND).json(MESSAGES.NOT_ENROLLED);
      }

      res.status(HttpStatus.OK).json(enrolledCourses);
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: MESSAGES.UNEXPECTED_ERROR,
        error: (error as Error).message,
      });
    }
  }

  async getTutorsStudents(req: Request, res: Response): Promise<void> {
    try {
      const tutorId = (req.user as Users)?.id;

      if (!tutorId) {
        res.status(HttpStatus.BAD_REQUEST).json({ message: MESSAGES.USER_ID_REQUIRED });
        return;
      }

      const enrolledStudents = await this.enrollmentService.getEnrolledStudents(
        tutorId
      );

      if (!enrolledStudents || enrolledStudents.length === 0) {
        res.status(HttpStatus.NOT_FOUND).json(MESSAGES.NOT_ENROLLED);
      }

      res.status(HttpStatus.OK).json(enrolledStudents);
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: MESSAGES.UNEXPECTED_ERROR,
        error: (error as Error).message,
      });
    }
  }

  async totalEnrolledStudents(req: Request, res: Response): Promise<void> {
    try {
      const totalStudents =
        await this.enrollmentService.totalEnrolledStudents();
      res.status(HttpStatus.OK).json({ total: totalStudents });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message: MESSAGES.UNEXPECTED_ERROR});
    }
  }

  async totalRevenue(req: Request, res: Response): Promise<void> {
    try {
      const totalRevenue = await this.enrollmentService.totalRevenue();
      if (!totalRevenue) {
        res.status(HttpStatus.NOT_FOUND).json({message:MESSAGES.REVENUE_NOT_FOUND});
        return;
      }
      res.status(HttpStatus.OK).json(totalRevenue);
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message: MESSAGES.UNEXPECTED_ERROR});
    }
  }

  async courseStrength(req: Request, res: Response): Promise<void> {
    try {
      const courseStrength = await this.enrollmentService.courseStrength();
      if (!courseStrength) {
        res.status(HttpStatus.NOT_FOUND).json({message: MESSAGES.NO_COURSE_STRENGTH});
        return;
      }

      res.status(HttpStatus.OK).json(courseStrength);
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message: MESSAGES.UNEXPECTED_ERROR});
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
      res.status(HttpStatus.OK).json(reportData);
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message: MESSAGES.UNEXPECTED_ERROR});
    }
  }  
}
