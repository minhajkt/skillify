import { Request, Response } from "express";
import { TutorRepository } from "../repositories/tutorRepository";
import { TutorService } from "../services/tutorService";

const tutorService = new TutorService(new TutorRepository())

interface User {
  _id: string;
  name: string;
  email: string;
  isActive: boolean;
}

interface AuthenticatedRequest extends Request {
  user?: User
}

export class tutorController {
  static getTutorCourses = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const tutorId = req.user?._id;
      if (!tutorId) {
        return res.status(401).json({ message: "Unauthorized access." });
      }
      const courses = await tutorService.getTutorCourses(tutorId);
      if (!courses || courses.length === 0) {
        return res
          .status(404)
          .json({ message: "No courses found for this tutor." });
      }
      return res.status(200).json(courses);
    } catch (error) {
      return res.status(500).json({
        message: "An unexpected error occurred.",
        error: (error as Error).message,
      });
    }
  };

  static getCourseDetails = async(req: Request, res: Response) => {
    try {
        const courseId = req.params.courseId
        const courseDetails = await tutorService.getCourseDetails(courseId)

        if(!courseDetails) {
            return res.status(404).json({message: "Course not found!"})
        }
        console.log("Course Details Response:", courseDetails);
        return res.status(200).json(courseDetails)
    } catch (error) {
        res.status(500).json({message: "An unexpected error occured", error:(error as Error).message})
    }
  }
}