import { generateRefreshToken, generateResetToken, generateToken } from "../../../utils/jwtUtil";
import { sendEmail, sendOtpToEmail, storeOtp, validateOtp } from "../../../utils/otpUtil";
import { comparePassword, hashPassword } from "../../../utils/passwordHashing";
import { IUser } from "../models/UserModel";
import { IUserRepository } from "../repositories/IUserRepository";
import { ICourse } from "../../courses/models/courseModel";
import { IUserService } from "./IUserService";
import { uploadCertificates } from "../../../utils/uploadCertificates";

export class UserService implements IUserService {
  private userRepository: IUserRepository;

  constructor(userRepository: IUserRepository) {
    this.userRepository = userRepository;
  }

  private async authenticateUser(
    email: string,
    password: string
  ): Promise<IUser> {
    if (!email || !password) {
      throw new Error("Email and password cannot be empty");
    }

    const user = await this.userRepository.getUserByEmail(email);
    if (!user) {
      throw new Error("User not found");
    }

    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Invalid Password. Please enter a valid password");
    }

    if (!user.verified) {
      throw new Error("Please verify your email before logging in.");
    }
    if (!user.isActive) {
      throw new Error("Your account has been temporarily suspended.");
    }
    return user;
  }
  async createUser(
    userData: Partial<IUser>,
    files?: Express.Multer.File[]
  ): Promise<IUser> {
    const existingUser = await this.userRepository.getUserByEmail(
      userData.email as string
    );
    if (existingUser) {
      if (!existingUser.verified) {
        const otp = await sendOtpToEmail(userData.email as string);
        storeOtp(userData.email as string, otp);
      } else {
        throw new Error("Email already exists");
      }
      const hashedPassword = await hashPassword(userData.password as string);
      userData.password = hashedPassword;
      await this.userRepository.updateUser(existingUser.id, userData);
      return existingUser;
    }

    if (userData.role === "tutor" && files) {
      userData.certificates = await uploadCertificates(files);
    }

    const hashedPassword = await hashPassword(userData.password as string);
    userData.password = hashedPassword;

    const otp = await sendOtpToEmail(userData.email as string);
    storeOtp(userData.email as string, otp);

    return this.userRepository.createUser(userData);
  }

  async getUserByEmail(email: string): Promise<IUser | null> {
    return this.userRepository.getUserByEmail(email);
  }

  async verifyOtp(email: string, otp: string): Promise<IUser | null> {
    const isOtpValid = await validateOtp(email, otp);
    if (!isOtpValid) {
      throw new Error("Invalid or expired OTP.");
    }

    const user = await this.userRepository.getUserByEmail(email);
    if (user) {
      user.verified = true;
      await user.save();
      return user;
    }
    throw new Error("User not found.");
  }

  async resendOtp(email: string): Promise<void> {
    const user = await this.userRepository.getUserByEmail(email);

    if (!user) {
      const error = new Error("User not found");
      (error as any).statusCode = 404;
      throw error;
    }

    const otp = await sendOtpToEmail(email);

    storeOtp(email, otp);

  }

  async loginUser(
    email: string,
    password: string
  ): Promise<{ token: string; refreshToken: string; user: IUser }> {
    const user = await this.authenticateUser(email, password);
    if (user.role !== "user") {
      throw new Error("Access denied. Only students can log in here.");
    }
    const token = generateToken({
      id: user._id,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
    });

    const refreshToken = generateRefreshToken({ id: user._id });
    return { token, refreshToken, user };
  }

  async loginTutor(
    email: string,
    password: string
  ): Promise<{ token: string; refreshToken: string; user: IUser }> {
    const user = await this.authenticateUser(email, password);

    if (user.role !== "tutor") {
      throw new Error("Access denied. Only tutors can log in here.");
    }

    if (user.isApproved !== "approved") {
      throw new Error("Access denied. Your application is under review");
    }

    const token = generateToken({
      id: user._id,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
    });
    const refreshToken = generateRefreshToken({ id: user._id });

    return { token, refreshToken, user };
  }

  async loginAdmin(
    email: string,
    password: string
  ): Promise<{ token: string; refreshToken: string; user: IUser }> {
    const user = await this.authenticateUser(email, password);

    if (user.role !== "admin") {
      throw new Error("Access denied. Only admin can log in here.");
    }

    const token = generateToken({
      id: user._id,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
    });
    const refreshToken = generateRefreshToken({ id: user._id });
    return { token, refreshToken, user };
  }
  async getUserById(id: string): Promise<IUser | null> {
    return this.userRepository.getUserById(id);
  }

  async getAllStudents() {
    return this.userRepository.findAllStudents();
  }

  async updateUser(
    id: string,
    userData: Partial<IUser>
  ): Promise<IUser | null> {
    return this.userRepository.updateUser(id, userData);
  }

  async handleForgotPassword(email: string): Promise<string | null> {
    const user = await this.userRepository.getUserByEmail(email);

    if (!user) {
      return null;
    }
    const resetToken = generateResetToken(user.id.toString());

    await sendEmail(email, resetToken);
    return resetToken;
  }

  async updatePassword(
    userId: string,
    newPassword: string
  ): Promise<IUser | null> {
    return this.userRepository.updatePassword(userId, newPassword);
  }

  async getCourseById(id: string): Promise<IUser | null> {
    return this.userRepository.getCourseById(id);
  }

  async getTutorCount(): Promise<number> {
    return this.userRepository.findAllTutors("approved");
  }
  // async getAllCourseForUser(): Promise<ICourse[]> {
  //   return await this.userRepository.getAllCourseForUser();
  // }
}