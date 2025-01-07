import { ICourse } from "../../courses/models/courseModel";

export interface ITutorRepository {
    getTutorCourses(tutorId: string) : Promise<ICourse[]>;
    getCourseDetails(courseId: string): Promise<ICourse | null> 
}