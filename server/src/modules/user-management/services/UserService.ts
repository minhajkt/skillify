import { generateResetToken, generateToken } from "../../../utils/jwtUtil";
import { sendEmail, validateOtp } from "../../../utils/otpUtil";
import { comparePassword, hashPassword } from "../../../utils/passwordHashing";
import { IUser } from "../models/UserModel";
import { IUserRepository } from "../repositories/IUserRepository";

export class UserService {
  private userRepository: IUserRepository;

  constructor(userRepository: IUserRepository) {
    this.userRepository = userRepository;
  }

  // service for creating user

  async createUser(userData: Partial<IUser>): Promise<IUser> {
    const existingUser = await this.userRepository.getUserByEmail(
      userData.email as string
    );
    if (existingUser) {
      throw new Error("Email already exists");
    }


    const hashedPassword = await hashPassword(userData.password as string);
    userData.password = hashedPassword;
    return this.userRepository.createUser(userData);
  }

  // serive to handle the otp verifcation

  async verifyOtp(email: string, otp: string): Promise<boolean> {
    return validateOtp(email, otp);
  }

  // serive to handle the user login

  async loginUser(email: string, password: string): Promise<{token:string; user: IUser}> {
    const user = await this.userRepository.getUserByEmail(email);

    if(!email || !password) {
        throw new Error('Email and password cannot be empty')
    }

    if (!user) {
      throw new Error("User not found");
    }

    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Invalid Password. Please enter a valid password");
    }

    const token = generateToken({id:user._id, email:user.email});
    return {token, user};
  }

//   service to view user profile
  async getUserById(id: string): Promise<IUser | null> {
    return this.userRepository.getUserById(id)
  }

// service to update the user

  async updateUser(
    id: string,
    userData: Partial<IUser>
  ): Promise<IUser | null> {
    return this.userRepository.updateUser(id, userData);
  }

// to handle forgot password

  async handleForgotPassword(email: string): Promise<string | null> {
    const user = await this.userRepository.getUserByEmail(email)

    if(!user) {
        return null
    }
    const resetToken = generateResetToken(user.id.toString())
    console.log('reset token is', resetToken);
    
    await sendEmail(email, resetToken)
    return resetToken
  }

    async updatePassword(userId: string, newPassword: string): Promise<IUser | null> {
    return this.userRepository.updatePassword(userId, newPassword)
  }
}