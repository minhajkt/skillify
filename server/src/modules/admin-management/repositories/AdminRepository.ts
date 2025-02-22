import { ICourse } from "../../courses/models/courseModel";
import User, { IUser } from "../../user-management/models/UserModel";
import { IAdminRepository } from "./IAdminRepository";
import bcrypt from 'bcryptjs'
import Course from '../../courses/models/courseModel'
import { BaseRepository } from "../../../common/baseRepository";
import Lecture from '../../lectures/models/lectureModel'

export class AdminRepository
  extends BaseRepository<IUser>
  implements IAdminRepository
{
  constructor() {
    super(User);
  }

  async findAllStudents(): Promise<IUser[]> {
    // return await User.find({ role: "user" });
    return await this.findAll({role: 'user'})
  }

  async updateUser(
    id: string,
    userData: Partial<IUser>
  ): Promise<IUser | null> {
    return await this.update(id, userData);
  }

  async findAllTutors(): Promise<IUser[]> {
    // return await User.find({ role: "tutor", isApproved: "approved" });
    return await this.findAll({role:"tutor", isApproved: 'approved'})
  }

  async getUserById(id: string): Promise<IUser | null> {
    return await this.findById(id);
  }

  async getTutorRequests(): Promise<IUser[]> {
    // return await User.find({ role: "tutor", isApproved: "pending" });
    return await this.findAll({ role: "tutor", isApproved: "pending" });

  }

  async getCourseRequests(): Promise<ICourse[]> {
    return await Course.find({ isApproved: "pending" });
  }

  async updateCourseApproval(
    id: string,
    status: string
  ): Promise<ICourse | null> {
    return await Course.findByIdAndUpdate(
      id,
      { isApproved: status },
      { new: true }
    );
  }

  async updateCourseEditApproval(
    id: string,
    editStatus: string
  ): Promise<ICourse | null> {
    const course = await Course.findById(id);
    if (!course) return null;


    if (editStatus === "approved" && course.draftVersion) {
      const updates: Partial<ICourse> = {
        title: course.draftVersion.title,
        description: course.draftVersion.description,
        category: course.draftVersion.category,
        thumbnail: course.draftVersion.thumbnail,
        price: course.draftVersion.price,
        editStatus: "approved",
        isApproved: "approved",
        draftVersion: null,
      };

      await Course.updateOne({ _id: id }, { $set: updates });

      if (course.draftVersion.lectures) {
        for (const draftLecture of course.draftVersion.lectures) {
          await Lecture.findOneAndUpdate(
            { order: draftLecture.order , courseId: id },
            {
              $set: {
                title: draftLecture.title,
                description: draftLecture.description,
                videoUrl: draftLecture.videoUrl,
                duration: draftLecture.duration,
                order: draftLecture.order,
                draftVersion: null,
              },
            }
          );
        }
      }
    } else {
      await Course.updateOne(
        { _id: id },
        {
          $set: { editStatus, isApproved: "approved", draftVersion: null },
        }
      );

      await Lecture.updateMany(
        { courseId: id },
        { $set: { draftVersion: null } }
      );
    }

    return await Course.findById(id);
  }

  async getAllCourse(): Promise<ICourse[]> {
    return await Course.find({ isApproved: { $in: ["approved", "blocked"] } });
  }

  async getAllUsers(): Promise<IUser[]> {
    return await this.findAll();
  }

  async getUserByEmail(email: string): Promise<IUser | null> {
    return await this.findByEmail(email);
  }

  async updatePassword(
    userId: string,
    newPassword: string
  ): Promise<IUser | null> {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    return await this.update(userId, { password: hashedPassword });
  }
}
