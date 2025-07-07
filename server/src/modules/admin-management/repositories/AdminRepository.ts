import { ICourse } from "../../courses/models/courseModel";
import User, { IUser } from "../../user-management/models/UserModel";
import { IAdminRepository } from "./IAdminRepository";
import bcrypt from 'bcryptjs'
import Course from '../../courses/models/courseModel'
import { BaseRepository } from "../../../common/baseRepository";
import Lecture from '../../lectures/models/lectureModel'
import { UserQueryOptions } from "../../../types/interfaces";

export class AdminRepository
  extends BaseRepository<IUser>
  implements IAdminRepository
{
  constructor() {
    super(User);
  }

  // async findAllStudents(): Promise<IUser[]> {
  //   return await this.findAll({ role: "user" });
  // }

  async findAllStudents({
    search,
    sort,
    order,
    page,
    limit,
    status,
  }: UserQueryOptions & { status?: string }): Promise<{
    users: IUser[];
    total: number;
  }> {
    const query: any = {};

    if (search) {
      query.$or = [
        { name: new RegExp(search, "i") },
        { email: new RegExp(search, "i") },
      ];
    }

    if (status === "active") query.isActive = true;
    if (status === "blocked") query.isActive = false;

    const sortObj: any = {};
    sortObj[sort] = order === "asc" ? 1 : -1;

    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .sort(sortObj)
      .skip((page - 1) * limit)
      .limit(limit);

    return { users, total };
  }

  async updateUser(
    id: string,
    userData: Partial<IUser>
  ): Promise<IUser | null> {
    return await this.update(id, userData);
  }

  // async findAllTutors(): Promise<IUser[]> {
  //   // return await User.find({ role: "tutor", isApproved: "approved" });
  //   return await this.findAll({ role: "tutor", isApproved: "approved" });
  // }

  async findAllTutors({
    search,
    status,
    sort,
    order,
    page,
    limit,
  }: UserQueryOptions & { status?: string }): Promise<{
    users: IUser[];
    total: number;
  }> {
    const query: any = {
      role: "tutor",
      isApproved: "approved",
    };

    if (search) {
      query.$or = [
        { name: new RegExp(search, "i") },
        { email: new RegExp(search, "i") },
      ];
    }

    if (status === "active") query.isActive = true;
    if (status === "blocked") query.isActive = false;

    const sortObj: any = {};
    sortObj[sort || "createdAt"] = order === "asc" ? 1 : -1;

    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .sort(sortObj)
      .skip((page - 1) * limit)
      .limit(limit);

    return { users, total };
  }

  async getUserById(id: string): Promise<IUser | null> {
    return await this.findById(id);
  }

  async getTutorRequests(search? : string): Promise<IUser[]> {
    const query: any = { role: "tutor", isApproved: "pending" };
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }
    return await this.findAll(query);
  }

  async getCourseRequests(search?: string): Promise<ICourse[]> {
    const query: any = { isApproved: "pending" };
    if (search) {
      query.title = { $regex: search, $options: "i" }; 
    }
    return await Course.find(query);
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
        draftVersion: undefined,
      };

      await Course.updateOne({ _id: id }, { $set: updates });

      if (course.draftVersion.lectures) {
        for (const draftLecture of course.draftVersion.lectures) {
          await Lecture.findOneAndUpdate(
            { order: draftLecture.order, courseId: id },
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

  // async getAllCourse(): Promise<ICourse[]> {
  //   return await Course.find({ isApproved: { $in: ["approved", "blocked"] } });
  // }
  async getAllCourse(params: {
    search: string;
    category: string;
    sort: string;
    order: "asc" | "desc";
    page: number;
    limit: number;
  }): Promise<{ courses: ICourse[]; total: number }> {
    const { search, category, sort, order, page, limit } = params;

    const query: any = {
      isApproved: { $in: ["approved", "blocked"] },
    };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
      ];
    }

    if (category) {
      query.category = category;
    }

    const skip = (page - 1) * limit;
    const sortQuery: any = { [sort]: order === "asc" ? 1 : -1 };

    const [courses, total] = await Promise.all([
      Course.find(query).sort(sortQuery).skip(skip).limit(limit),
      Course.countDocuments(query),
    ]);

    return { courses, total };
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
