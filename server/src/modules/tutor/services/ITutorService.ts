import { ICourse } from "../../courses/models/courseModel";

export interface ITutorService {
  getTutorCourses(tutorId: string): Promise<ICourse[]>;
  getCourseDetails(courseId: string): Promise<ICourse | null>;
}