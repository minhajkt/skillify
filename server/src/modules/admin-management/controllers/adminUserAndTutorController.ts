import { Request, Response } from "express";
import { UserRepository } from "../../user-management/repositories/UserRepository";
import { UserService } from "../../user-management/services/UserService";
import { AdminService } from "../services/adminService";
import { AdminRepository } from "../repositories/AdminRepository";
import { sendApprovalEmail } from "../../../utils/approveEmail";

const userRepository = new UserRepository();
const userService = new UserService(userRepository);

const adminRepository = new AdminRepository();
const adminService = new AdminService(adminRepository)

export class AdminController {
  static getStudents = async (req: Request, res: Response) => {
    try {
      const students = await adminService.getAllStudents();
      res.status(200).json(students);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  };

  static updateStudentStatus = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const { id } = req.params;
    const { isActive } = req.body;

    try {
      const updatedStudent = await adminService.updateUser(id, {
        isActive,
      });

      if (!updatedStudent) {
        res.status(404).json({ message: "Student not found" });
        return;
      }

      res.status(200).json(updatedStudent);
      return;
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
      return;
    }
  };

  static getTutors = async (req: Request, res: Response) => {
    try {
      const tutors = await adminService.getAllTutor();
      res.status(200).json(tutors);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  };

  static updateTutorStatus = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const { id } = req.params;
    const { isActive } = req.body;

    try {
      const updatedTutor = await adminService.updateUser(id, {
        isActive,
      });

      if (!updatedTutor) {
        res.status(404).json({ message: "Tutor not found" });
        return;
      }

      res.status(200).json(updatedTutor);
      return;
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
      return;
    }
  };

  static getTutorRequests = async (req: Request, res: Response) => {
    try {
      const tutorRequest = await adminRepository.getTutorRequests();
      if (!tutorRequest) {
        res.status(404).json({ message: "No requests pending" });
        return;
      }
      res.status(200).json({
        message: "Tutor requests fetched successfully",
        tutorRequest,
      });
      return;
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
      return;
    }
  };

  static updateTutorApproval = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const { id } = req.params;
    const { isApproved } = req.body;

    try {
      const updatedTutor = await adminService.updateUser(id, {
        isApproved,
        verified: isApproved === 'approved'
      });

      if (!updatedTutor) {
        res.status(404).json({ message: "Tutor not found" });
        return;
      }
      await sendApprovalEmail(updatedTutor.email,updatedTutor.name, isApproved)

      res.status(200).json(updatedTutor);
      return;
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
      return;
    }
  };
}
