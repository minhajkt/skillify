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
import { HttpStatus } from "../../../constants/httpStatus";
import { MESSAGES } from "../../../constants/messages";


export class AdminController implements IAdminController {
  private adminService: IAdminService;
  constructor(adminService: IAdminService) {
    this.adminService = adminService;
  }
  // async getStudents(req: Request, res: Response): Promise<void> {
  //   try {
  //     const students = await this.adminService.getAllStudents();
  //     res.status(HttpStatus.OK).json(students);
  //   } catch (error) {
  //     res
  //       .status(HttpStatus.INTERNAL_SERVER_ERROR)
  //       .json({ message: (error as Error).message });
  //   }
  // }

  async getStudents(req: Request, res: Response): Promise<void> {
    try {
      const { search, sort, order, page, limit, status } = req.query;
      const result = await this.adminService.getAllStudents({
        search: search as string,
        sort: sort as string,
        order: order as "asc" | "desc",
        page: parseInt(page as string, 10),
        limit: parseInt(limit as string, 10),
        status: status as string,
      });

      res.status(HttpStatus.OK).json(result);
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: (error as Error).message });
    }
  }

  async updateStudentStatus(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const { isActive } = req.body;

    try {
      const updatedStudent = await this.adminService.updateUser(id, {
        isActive,
      });

      res.status(HttpStatus.OK).json(updatedStudent);
      return;
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: (error as Error).message });
      return;
    }
  }

  // async getTutors(req: Request, res: Response): Promise<void> {
  //   try {
  //     const tutors = await this.adminService.getAllTutor();

  //     res.status(HttpStatus.OK).json(tutors);
  //   } catch (error) {
  //     res
  //       .status(HttpStatus.INTERNAL_SERVER_ERROR)
  //       .json({ message: (error as Error).message });
  //   }
  // }

  async getTutors(req: Request, res: Response): Promise<void> {
    try {
      const {
        search,
        status,
        sort,
        order,
        page = "1",
        limit = "100",
      } = req.query;

      const result = await this.adminService.getAllTutor({
        search: search as string,
        status: status as string,
        sort: sort as string,
        order: order as "asc" | "desc",
        page: parseInt(page as string, 10),
        limit: parseInt(limit as string, 10),
      });

      res.status(HttpStatus.OK).json(result);
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: (error as Error).message });
    }
  }

  async getTutorById(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    try {
      const tutor = await this.adminService.getTutorById(id);

      res.status(HttpStatus.OK).json(tutor);
    } catch (error) {
      res
        .json(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: MESSAGES.UNEXPECTED_ERROR });
    }
  }

  async getStudentById(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    try {
      const student = await this.adminService.getStudentById(id);

      res.status(HttpStatus.OK).json(student);
    } catch (error) {
      res
        .json(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: MESSAGES.UNEXPECTED_ERROR });
    }
  }

  async updateTutorStatus(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const { isActive } = req.body;

    try {
      const updatedTutor = await this.adminService.updateUser(id, {
        isActive,
      });

      res.status(HttpStatus.OK).json(updatedTutor);
      return;
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: (error as Error).message });
      return;
    }
  }

  async getTutorRequests(req: Request, res: Response): Promise<void> {
    try {
      const search = req.query.search as string | undefined;
      const tutorRequest = await this.adminService.getTutorRequests(search);

      res.status(HttpStatus.OK).json({
        message: MESSAGES.TUTOR_FETCH_SUCCESS,
        tutorRequest,
      });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: (error as Error).message });
      return;
    }
  }

  async updateTutorApproval(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const { isApproved } = req.body;

    try {
      const updatedTutor = await this.adminService.updateUser(id, {
        isApproved,
        verified: isApproved === "approved",
      });

      if (!updatedTutor) {
        res
          .status(HttpStatus.NOT_FOUND)
          .json({ message: MESSAGES.TUTOR_NOT_FOUND });
        return;
      }
      await sendApprovalEmail(
        updatedTutor.email,
        updatedTutor.name,
        isApproved
      );

      res.status(HttpStatus.OK).json(updatedTutor);
      return;
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: (error as Error).message });
      return;
    }
  }

  async getCourseRequests(req: Request, res: Response): Promise<void> {
    try {
      const search = req.query.search as string | undefined;
      const courseRequest = await this.adminService.getCourseRequests(search);

      res.status(HttpStatus.CREATED).json({
        message: MESSAGES.COURSE_REQUEST_FETCH_SUCCESS,
        courseRequest,
      });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: MESSAGES.UNEXPECTED_ERROR,
        error: (error as Error).message,
      });
      return;
    }
  }

  async updateCourseApproval(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const { isApproved } = req.body;
    try {
      const updatedCourse = await this.adminService.updateCourseApproval(
        id,
        isApproved
      );

      res
        .status(HttpStatus.OK)
        .json({ message: MESSAGES.COURSE_APPROVAL_UPDATED, updatedCourse });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: MESSAGES.UNEXPECTED_ERROR,
        error: (error as Error).message,
      });
    }
  }

  async updateCourseEditApproval(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const { editStatus } = req.body;
    try {
      const updatedCourse = await this.adminService.updateCourseEditApproval(
        id,
        editStatus
      );

      res
        .status(HttpStatus.OK)
        .json({ message: MESSAGES.COURSE_APPROVAL_UPDATED, updatedCourse });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: MESSAGES.UNEXPECTED_ERROR,
        error: (error as Error).message,
      });
    }
  }

  // async getAllCourse(req: Request, res: Response): Promise<void> {
  //   try {
  //     const courses = await this.adminService.getAllCourse();

  //     res.status(HttpStatus.OK).json(courses);
  //   } catch (error) {
  //     res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
  //       message: MESSAGES.UNEXPECTED_ERROR,
  //       error: (error as Error).message,
  //     });
  //   }
  // }
  async getAllCourse(req: Request, res: Response): Promise<void> {
    try {
      const {
        search = "",
        category = "",
        sort = "createdAt",
        order = "desc",
        page = "1",
        limit = "10",
      } = req.query;

      const result = await this.adminService.getAllCourse({
        search: search as string,
        category: category as string,
        sort: sort as string,
        order: order as "asc" | "desc",
        page: parseInt(page as string, 10),
        limit: parseInt(limit as string, 10),
      });

      res.status(HttpStatus.OK).json(result);
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: MESSAGES.UNEXPECTED_ERROR,
        error: (error as Error).message,
      });
    }
  }
}
