import { Request, Response } from "express";
import { TutorRepository } from "../repositories/tutorRepository";
import { TutorService } from "../services/tutorService";
import { ITutorController } from "./ITutorController";
import { ITutorService } from "../services/ITutorService";



interface User {
  _id: string;
  name: string;
  email: string;
  isActive: boolean;
}

// interface AuthenticatedRequest extends Request {
//   user?: User
// }

export class TutorController implements ITutorController {
  private tutorService : ITutorService;

  constructor(tutorService: ITutorService) {
    this.tutorService = tutorService
  }

  async getTutorCourses(req: Request, res: Response):Promise<void> {
    try {
      const tutorId = (req.user as User)?._id;
      const courses = await this.tutorService.getTutorCourses(tutorId);
      if(!courses) {
        res.status(404).json({message: "No courses created"})
      }

       res.status(200).json(courses);
    } catch (error) {
       res.status(500).json({
        message: "An unexpected error occurred.",
        error: (error as Error).message,
      });
      // console.log('errror for course page', error.message);
      
    }
  };

  async getCourseDetails(req: Request, res: Response): Promise<void> {
    try {
        const courseId = req.params.courseId
        const courseDetails = await this.tutorService.getCourseDetails(courseId)


        console.log("Course Details Response:", courseDetails);
         res.status(200).json(courseDetails)
    } catch (error) {
        res.status(500).json({message: "An unexpected error occured", error:(error as Error).message})
    }
  }
}