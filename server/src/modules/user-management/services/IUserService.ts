import { IUser } from "../models/UserModel";

export interface IUserService {
  createUser(
    userData: Partial<IUser>,
    files?: Express.Multer.File[]
  ): Promise<IUser>;
  verifyOtp(email: string, otp: string): Promise<IUser | null>;
  loginUser(
    email: string,
    password: string
  ): Promise<{ token: string; refreshToken: string; user: IUser }>;
  loginTutor(
    email: string,
    password: string
  ): Promise<{ token: string; refreshToken: string; user: IUser }>;
  loginAdmin(
    email: string,
    password: string
  ): Promise<{ token: string; refreshToken: string; user: IUser }>;
  getUserById(id: string): Promise<IUser | null>;
  updateUser(id: string, userData: Partial<IUser>): Promise<IUser | null>;
  handleForgotPassword(email: string): Promise<string | null>;
  updatePassword(userId: string, newPassword: string): Promise<IUser | null>;
  updatePassword(userId: string, newPassword: string): Promise<IUser | null>;
  getUserByEmail(email: string): Promise<IUser | null>;
  getCourseById(id: string): Promise<IUser | null>;
  getTutorCount(): Promise<number>;
  resendOtp(email: string): Promise<void>;
}