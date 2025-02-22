import mongoose from "mongoose";
import Course, { ICourse } from "../models/courseModel";
import { ICourseRepository } from "./ICourseRepository";
import { BaseRepository } from "../../../common/baseRepository";

export class CourseRepository
  extends BaseRepository<ICourse>
  implements ICourseRepository
{
  constructor() {
    super(Course);
  }

  async createCourse(courseData: Partial<ICourse>): Promise<ICourse> {
    return await this.create(courseData);
  }

  async updateCourse(
    courseId: string,
    updatedData: Partial<ICourse>,
    isApproved: string,
    editStatus: string
  ): Promise<ICourse | null> {
    return await Course.findByIdAndUpdate(
      courseId,
      { draftVersion : updatedData, isApproved, editStatus },
      { new: true }
    );
  }

  async getAllCourses(): Promise<ICourse[]> {
    // return await Course.find({ isApproved: "approved" });
    return await this.findAll({isApproved: 'approved'})
  }

  async getCategories(): Promise<string[]> {
    const categories = (Course.schema.path("category") as any).enumValues;
    return categories;
  }

  async getUserCourse(courseId: string): Promise<ICourse | null> {
    // return await Course.findById(courseId).populate("lectures");
    const course = await this.findById(courseId)
    return course ? course.populate('lectures'): null
  }

  async addLecture(
    courseId: mongoose.Types.ObjectId,
    lectureId: mongoose.Types.ObjectId
  ): Promise<void> {
    const updatedCourse = await Course.findByIdAndUpdate(
      { _id: courseId },
      { $push: { lectures: lectureId } },
      { new: true }
    );
    if (!updatedCourse) {
      throw new Error(`Course with ID ${courseId} not found.`);
    } 
  }

  async findCourseById(courseId: string): Promise<ICourse | null> {
    return await Course.findById(courseId);
  }

  async updateBlockStatus(
    courseId: string,
    status: string
  ): Promise<ICourse | null> {
    return await Course.findByIdAndUpdate(
      courseId,
      { isApproved: status },
      { new: true }
    );
  }

  async countCourses(): Promise<number> {
    const count = await Course.countDocuments();
    return count;
  }
}

