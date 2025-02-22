import User, { IUser } from "../models/UserModel";
import Course, { ICourse } from "../../courses/models/courseModel";
import { IUserRepository } from "./IUserRepository";
import bcrypt from "bcryptjs";
import { BaseRepository } from "../../../common/baseRepository";

export class UserRepository extends BaseRepository<IUser> implements IUserRepository {

  constructor() {
    super(User)
  }

  async createUser(userData: Partial<IUser>): Promise<IUser> {
    return await this.create(userData)
  }

  async getUserByEmail(email: string): Promise<IUser | null> {    
    return await this.findByEmail(email)
  }

  async updateUser(
    id: string,
    userData: Partial<IUser>
  ): Promise<IUser | null> {
    const updatedUser = await this.update(id, userData)
    return updatedUser;
  }

  async findAllTutors(approvalStatus: string): Promise<number> {
    return await User.countDocuments({
      role: "tutor",
      isApproved: approvalStatus,
    });
  }
  
  async findAllStudents():  Promise<IUser[]> {
    return await User.find({role: 'user'})
  }

  async getUserById(id: string): Promise<IUser | null> {    
    return await this.findById(id)
  }

  async updatePassword(
    userId: string,
    newPassword: string
  ): Promise<IUser | null> {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    return await this.update(userId, {password: hashedPassword})
  }

  async getCourseById(id: String): Promise<IUser | null> {
    return await Course.findById(id);
  }
}
