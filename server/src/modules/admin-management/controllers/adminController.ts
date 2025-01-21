import { Request, Response } from "express";
import { UserRepository } from "../../user-management/repositories/UserRepository";
import { UserService } from "../../user-management/services/UserService";
import { AdminService } from "../services/adminService";
import { AdminRepository } from "../repositories/AdminRepository";
import { sendApprovalEmail, sendCourseApprovalEmail } from "../../../utils/approveEmail";
import User from '../../user-management/models/UserModel'
import Course from '../../courses/models/courseModel'
import { IAdminService } from "../services/IAdminService";
import { IAdminController } from "./IAdminController";



export class AdminController implements IAdminController {
  private adminService: IAdminService;
  constructor(adminService: IAdminService) {
    this.adminService = adminService;
  }
  async getStudents(req: Request, res: Response): Promise<void> {
    try {
      const students = await this.adminService.getAllStudents();
      res.status(200).json(students);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  }

  async updateStudentStatus(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const { isActive } = req.body;

    try {
      const updatedStudent = await this.adminService.updateUser(id, {
        isActive,
      });

      res.status(200).json(updatedStudent);
      return;
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
      return;
    }
  }

  async getTutors(req: Request, res: Response): Promise<void> {
    try {
      const tutors = await this.adminService.getAllTutor();
      // console.log('tutors are', tutors);
      
      res.status(200).json(tutors);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  }

  async getTutorById(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    try {
      const tutor = await this.adminService.getTutorById(id);

      res.status(200).json(tutor);
    } catch (error) {
      console.log("error", error);
      res.json(500).json({ message: "an error occured" });
    }
  }

  async updateTutorStatus(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const { isActive } = req.body;

    try {
      const updatedTutor = await this.adminService.updateUser(id, {
        isActive,
      });

      res.status(200).json(updatedTutor);
      return;
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
      return;
    }
  };

  async getTutorRequests(req: Request, res: Response):Promise<void> {
    try {
      const tutorRequest = await this.adminService.getTutorRequests();

      res.status(200).json({
        message: "Tutor requests fetched successfully",
        tutorRequest,
      });
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
      return;
    }
  };



  async updateTutorApproval(req: Request,res: Response): Promise<void> {
    const { id } = req.params;
    const { isApproved } = req.body;

    try {
      const updatedTutor = await this.adminService.updateUser(id, {
        isApproved,
        verified: isApproved === "approved",
      });

      if (!updatedTutor) {
        res.status(404).json({ message: "Tutor not found" });
        return;
      }
      await sendApprovalEmail(
        updatedTutor.email,
        updatedTutor.name,
        isApproved
      );

      res.status(200).json(updatedTutor);
      return;
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
      return;
    }
  };

  
  async getCourseRequests(req: Request, res: Response): Promise<void> {
    try {
      const courseRequest = await this.adminService.getCourseRequests();

      res.status(201).json({
        message: "Course requests fetched successfully",
        courseRequest,
      });
      // return;
    } catch (error) {
      res.status(500).json({
        message: "An unexpected error occured",
        error: (error as Error).message,
      });
      return;
    }
  };

  async updateCourseApproval(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const { isApproved } = req.body;
    try {
      const updatedCourse = await this.adminService.updateCourseApproval(id, isApproved)

      res.status(200).json({ message: "Course approval updated", updatedCourse });
    } catch (error) {
      console.log("error in course update");
      res.status(500).json({message: "An unexpected error occured",error: (error as Error).message,});
    }
  };

  async getAllCourse(req: Request, res: Response): Promise<void> {
    try {
      const courses = await this.adminService.getAllCourse();

      res.status(200).json(courses);
    } catch (error) {
       res.status(500).json({message: "An unexpected error occured",error: (error as Error).message,});
    }
  };


}
