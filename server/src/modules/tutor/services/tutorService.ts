import { ICourse } from "../../courses/models/courseModel";
import { ITutorRepository } from "../repositories/ITutorRepository";
import { ITutorService } from "./ITutorService";

export class TutorService implements ITutorService {
    private tutorRepo: ITutorRepository;
    constructor(tutorRepo: ITutorRepository) {
        this.tutorRepo = tutorRepo
    }
    
    async getTutorCourses(tutorId:string ) : Promise<ICourse[]> {
        if (!tutorId) {
            throw new Error("Unauthorized access.");
        }
        const courses = await this.tutorRepo.getTutorCourses(tutorId)
        if (!courses || courses.length === 0) {
        throw new Error("No courses found for this tutor.");
        }
        return courses
    }

    async getCourseDetails(courseId: string) : Promise<ICourse | null> {
        if(!courseId) {
          throw new Error("Course id is not found");
        }
        
        const course = await this.tutorRepo.getCourseDetails(courseId)
        if (!course) {
          throw new Error("Course not found")
        }

        return course
    }
}