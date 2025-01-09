import { ICourse } from "../../courses/models/courseModel";
import User, { IUser } from "../../user-management/models/UserModel";
import { IAdminRepository } from "./IAdminRepository";
import bcrypt from 'bcryptjs'
import Course from '../../courses/models/courseModel'

export class AdminRepository implements IAdminRepository {
  async getUserByEmail(email: String): Promise<IUser | null> {
    return await User.findOne({ email });
  }

  async updateUser(
    id: String,
    userData: Partial<IUser>
  ): Promise<IUser | null> {
    return await User.findByIdAndUpdate(id, userData, { new: true });
  }

  async getAllUsers(): Promise<IUser[]> {
    return await User.find();
  }

  async findAllStudents(): Promise<IUser[]> {
    return await User.find({ role: "user" });
  }

  async findAllTutors(): Promise<IUser[]> {
    return await User.find({ role: "tutor", isApproved: "approved" });
  }

  async getUserById(id: String): Promise<IUser | null> {
    return await User.findById(id);
  }

  async getTutorRequests(): Promise<IUser[]> {
    return await User.find({ role: "tutor", isApproved: "pending" });
  }

  async getCourseRequests(): Promise<ICourse[]> {
    return await Course.find({isApproved: "pending" });
  }

  async updatePassword(
    userId: string,
    newPassword: string
  ): Promise<IUser | null> {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    return await User.findByIdAndUpdate(
      userId,
      { password: hashedPassword },
      { new: true }
    );
  }

  async getAllCourse(): Promise<ICourse[]> {
    return await Course.find({ isApproved: "approved" })
    // .populate("createdBy", "name").exec();
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
}