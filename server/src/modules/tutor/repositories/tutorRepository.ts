import Course,{ ICourse } from "../../courses/models/courseModel";

export class TutorRepository {
    async getTutorCourses(tutorId: string) : Promise<ICourse[]> {
        return await Course.find({createdBy: tutorId})
    }

    async getCourseDetails(courseId: string): Promise<ICourse | null> {
        return await Course.findById(courseId).populate("lectures");
    }
}