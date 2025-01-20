import {IEnrollment} from "../models/enrollmentModel"
import { IEnrollmentRepository } from "../repositories/IEnrollmentRepository"
import { IEnrollmentService } from "./IEnrollmentService";

export class EnrollmentService implements IEnrollmentService{
    private enrollmentRepo : IEnrollmentRepository;
    constructor(enrollmentRepo: IEnrollmentRepository) {
        this.enrollmentRepo = enrollmentRepo
    }
    
    async getAllEnrolledCoursesByStudent(id: string): Promise<IEnrollment[] | null> {
        const enrolledCourses = await this.enrollmentRepo.getAllEnrolledCoursesByStudent(id)
        if(!enrolledCourses || enrolledCourses.length === 0 ) {
            throw new Error("No courses enrolled")
        }
        return enrolledCourses
    }

    // async createEnrollment(enrollmentData: Partial<IEnrollment>): Promise<IEnrollment | null> {
    //     return await this.enrollmentRepo.createEnrollment(enrollmentData)
    // }


    // async getEnrolledCourse (courseId: string): Promise<IEnrollment | null> {
    //     return await this.enrollmentRepo.getEnrolledCourse(courseId);
    // }

    async totalEnrolledStudents(): Promise<number> {
        const totalStudents = await this.enrollmentRepo.countEnrollments()
        return totalStudents;
    }
}