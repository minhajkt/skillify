import { ICourse } from "../../courses/models/courseModel";
import { ITutorRepository } from "../repositories/ITutorRepository";

export class TutorService {
    private tutorRepo: ITutorRepository;
    constructor(tutorRepo: ITutorRepository) {
        this.tutorRepo = tutorRepo
    }
    
    async getTutorCourses(tutorId:string) : Promise<ICourse[]> {
        return await this.tutorRepo.getTutorCourses(tutorId)
    }

    async getCourseDetails(courseId: string) : Promise<ICourse | null> {
        return await this.tutorRepo.getCourseDetails(courseId)
    }
}