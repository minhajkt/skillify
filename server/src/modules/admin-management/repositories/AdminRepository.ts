import { ICourse } from "../../courses/models/courseModel";
import User, { IUser } from "../../user-management/models/UserModel";
import { IAdminRepository } from "./IAdminRepository";
import bcrypt from 'bcryptjs'
import Course from '../../courses/models/courseModel'
import { BaseRepository } from "../../../common/baseRepository";

export class AdminRepository extends BaseRepository<IUser> implements IAdminRepository {

  constructor() {
    super(User)
  }

  async findAllStudents(): Promise<IUser[]> {        
    return await User.find({ role: "user" });
  }

  async updateUser(
    id: string,
    userData: Partial<IUser>
  ): Promise<IUser | null> {
    
    return await this.update(id, userData)
  }

  async findAllTutors(): Promise<IUser[]> {        
    return await User.find({ role: "tutor", isApproved: "approved" });
  }

  async getUserById(id: string): Promise<IUser | null> {
    return await this.findById(id)
  }

  async getTutorRequests(): Promise<IUser[]> {
    return await User.find({ role: "tutor", isApproved: "pending" });
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

  async getAllCourse(): Promise<ICourse[]> {
    // return await Course.find({ isApproved: { $in: ["approved", "blocked"] } });
    return await Course.find({ isApproved: {$in:["approved", "blocked"] }});

    // .populate("createdBy", "name").exec();
  }
  
  async getAllUsers(): Promise<IUser[]> {    
    return await this.findAll()
  }

  async getUserByEmail(email: string): Promise<IUser | null> {
    return await this.findByEmail(email)
  }

  async updatePassword(
    userId: string,
    newPassword: string
  ): Promise<IUser | null> {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    return await this.update(userId, {password: hashedPassword})
  }
}
