import User, { IUser } from "../models/UserModel";
import Course, {ICourse} from '../../courses/models/courseModel'
import { IUserRepository } from "./IUserRepository";
import bcrypt from 'bcryptjs'

export class UserRepository implements IUserRepository {
  async createUser(userData: Partial<IUser>): Promise<IUser> {
    const user = new User(userData);
    return await user.save();
  }

  async getUserByEmail(email: String): Promise<IUser | null> {
    return await User.findOne({ email });
  }

  async updateUser(
    id: String,
    userData: Partial<IUser>
  ): Promise<IUser | null> {
    const updatedUser = await User.findByIdAndUpdate(id, userData, {
      new: true,
    });
    console.log("the udpated user is ", updatedUser);

    return updatedUser;
  }

  async getAllUsers(): Promise<IUser[]> {
    return await User.find();
  }

  async findAllStudents(): Promise<IUser[]> {
    return await User.find({ role: "user" });
  }

  async findAllTutors(): Promise<IUser[]> {
    return await User.find({ role: "tutor" });
  }

  async getUserById(id: String): Promise<IUser | null> {
    return await User.findById(id);
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
  
  async getCourseById(id: String): Promise<IUser | null> {
    return await Course.findById(id);
  }
  // async getAllCourseForUser(): Promise<ICourse[]> {
  //   return await Course.find({ isApproved: "approved" })
  //     .populate("createdBy", "name")
  //     .exec();
  // }
}