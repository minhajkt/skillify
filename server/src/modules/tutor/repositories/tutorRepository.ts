import Course,{ ICourse } from "../../courses/models/courseModel";
import { ITutorRepository } from "./ITutorRepository";

export class TutorRepository implements ITutorRepository {
    async getTutorCourses(tutorId: string) : Promise<ICourse[]> {
        return await Course.find({createdBy: tutorId})
    }

    async getCourseDetails(courseId: string): Promise<ICourse | null> {
        return await Course.findById(courseId).populate("lectures");
    }
}