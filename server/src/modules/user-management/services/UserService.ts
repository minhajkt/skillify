import { login } from "../../../common/authService";
import { generateResetToken, generateToken } from "../../../utils/jwtUtil";
import { sendEmail, validateOtp } from "../../../utils/otpUtil";
import { comparePassword, hashPassword } from "../../../utils/passwordHashing";
import { IUser } from "../models/UserModel";
import { IUserRepository } from "../repositories/IUserRepository";
import { ICourse } from "../../courses/models/courseModel";

export class UserService {
  private userRepository: IUserRepository;

  constructor(userRepository: IUserRepository) {
    this.userRepository = userRepository;
  }

  async createUser(userData: Partial<IUser>): Promise<IUser> {
    const existingUser = await this.userRepository.getUserByEmail(
      userData.email as string
    );
    if (existingUser) {
      if (existingUser.verified) {
        throw new Error("Email already exists");
      }
      const hashedPassword = await hashPassword(userData.password as string);
      userData.password = hashedPassword;
      await this.userRepository.updateUser(existingUser.id, userData);
      return existingUser;
    }

    const hashedPassword = await hashPassword(userData.password as string);
    userData.password = hashedPassword;
    return this.userRepository.createUser(userData);
  }

  async getUserByEmail(email: string): Promise<IUser | null> {
    return this.userRepository.getUserByEmail(email);
  }

  async verifyOtp(email: string, otp: string): Promise<boolean> {
    return validateOtp(email, otp);
  }

  async loginUser(
    email: string,
    password: string
  ): Promise<{ token: string; user: IUser }> {
    return await login(email, password, this.userRepository);
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
    console.log("reset token is", resetToken);

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

  // async getAllCourseForUser(): Promise<ICourse[]> {
  //   return await this.userRepository.getAllCourseForUser();
  // }
}