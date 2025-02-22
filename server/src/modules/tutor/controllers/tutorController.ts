import { Request, Response } from "express";
import { TutorRepository } from "../repositories/tutorRepository";
import { TutorService } from "../services/tutorService";
import { ITutorController } from "./ITutorController";
import { ITutorService } from "../services/ITutorService";
import { MESSAGES } from "../../../constants/messages";
import { HttpStatus } from "../../../constants/httpStatus";



interface User {
  _id: string;
  name: string;
  email: string;
  isActive: boolean;
}



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
        res.status(HttpStatus.NOT_FOUND).json({message: MESSAGES.NO_TUTOR_COURSES})
      }

       res.status(HttpStatus.OK).json(courses);
    } catch (error) {
       res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: MESSAGES.UNEXPECTED_ERROR,
        error: (error as Error).message,
      });      
    }
  };

  async getCourseDetails(req: Request, res: Response): Promise<void> {
    try {
        const courseId = req.params.courseId
        const courseDetails = await this.tutorService.getCourseDetails(courseId)


         res.status(HttpStatus.OK).json(courseDetails)
    } catch (error) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message: MESSAGES.UNEXPECTED_ERROR, error:(error as Error).message})
    }
  }
}