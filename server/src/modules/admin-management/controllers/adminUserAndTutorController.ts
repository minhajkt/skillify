import { Request, Response } from "express";
import { UserRepository } from "../../user-management/repositories/UserRepository";
import { UserService } from "../../user-management/services/UserService";
import { AdminService } from "../services/adminService";
import { AdminRepository } from "../repositories/AdminRepository";
import { sendApprovalEmail, sendCourseApprovalEmail } from "../../../utils/approveEmail";
import User from '../../user-management/models/UserModel'
import Course from '../../courses/models/courseModel'

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

  static getTutorById = async(req: Request, res:Response) => {
    const {id } = req.params;
    try {
      const tutor = await adminService.getTutorById(id)
      if (!tutor) {
        return res.status(404).json({ message: "Tutor not found" });
      }
      res.json(tutor);
    } catch (error) {
      console.log('error', error);
      res.json(500).json({message:"an error occured"})
    }
  }

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

  // static getCourseRequest = async(req: Request, res: Response) => {
  //   try {
  //     const courseRequest = await adminRepository.getCourseRequests()
  //     if(!courseRequest) {
  //       res.status(404).json({message: "No requests pending"})
  //       return
  //     }
  //     res.status(200).json({message: "Course request fetched successfully ", courseRequest})
  //     return
  //   } catch (error) {
  //     res.status(500).json({message: "An unexpected error occured", error: (error as Error).message})
  //     return
  //   }
  // }

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

  static updateCourseApproval = async(req: Request, res: Response) => {
    const {id} = req.params
    const {isApproved} = req.body
    try {
      // const updatedCourse = await adminRepository.updateCourseApproval(id, isApproved)
      const updatedCourse = await Course.findByIdAndUpdate(id, {isApproved: isApproved}, {new:true})
      console.log('updated course is , ', updatedCourse);
      
      if(!updatedCourse) {
        res.status(404).json({message: "Course not found"})
        return; 
      }

      // const tutor = await User.findById(updatedCourse.createdBy); 
      // console.log('tutor name from updatecourseapproval of the admin', tutor);
      
      // if (!tutor) {
      //   return res.status(404).json({ message: "Tutor not found." });
      // }

      // await sendCourseApprovalEmail(tutor.email, tutor.name, isApproved)
      res.status(200).json({message: "Course approval updated",updatedCourse})
    } catch (error) {
      console.log('error in course update');
      
    }
  }

  static getAllCourse = async(req: Request, res: Response) => {
    try {
      const courses = await adminService.getAllCourse()
      if(!courses) {
         res.status(404).json({message: "No courses are found"})
        return;
      }
       res.status(200).json(courses)
       return;
    } catch (error) {
      res.status(500).json({message: 'An unexpected error occured', error: (error as Error).message})
      return; 
    }
  }



  static getCourseRequests = async(req: Request, res: Response) => {
    try {
      const courseRequest = await adminService.getCourseRequests()
      if(!courseRequest) {
        res.status(404).json({message: "No requests pending"})
        return
      }
      res.status(201).json({message: "Course requests fetched successfully", courseRequest})
      return
    } catch (error) {
      res.status(500).json({message: "An unexpected error occured", error: (error as Error).message})
      return; 
    }
  }
}
