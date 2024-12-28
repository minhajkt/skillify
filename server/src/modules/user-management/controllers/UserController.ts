import { error } from "console";
import { UserRepository } from "../repositories/UserRepository";
import { UserService } from "../services/UserService";
import { Request, Response } from "express";
import { sendOtpToEmail, storeOtp } from "../../../utils/otpUtil";
import { verifyResetToken } from "../../../utils/jwtUtil";

const userRepository = new UserRepository();
const userService = new UserService(userRepository);

export class UserController {
  // controller for handling createuser

  static createUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const { name, email, password, confirmPassword } = req.body;

      if (password !== confirmPassword) {
        res.status(400).json({ error: "Password does not match" });
        return;
      }

      const otp = await sendOtpToEmail(email);

      storeOtp(email, otp);
      console.log("otp is ", otp);

      const userData = { name, email, password };
      const user = await userService.createUser(userData);
      res
        .status(201)
        .json({ message: "User created. Otp is sent to the email" });
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  };

  // controller for handling verfityotp

  static verifyOtp = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, otp } = req.body;

      const isOtpValid = await userService.verifyOtp(email, otp);

      if (isOtpValid) {
        res.status(200).json({ message: "OTP verified successfully!" });
        return;
      }
      res.status(400).json({ error: "Invalid or expired OTP." });
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  };

  // controller for handling userlogin

  static loginUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;
      const {token, user} = await userService.loginUser(email, password);

      if (!token) {
        res.status(404).json({ message: "User not found" });
        return;
      }
      res.status(200).json({ message: "Login successful", token, user });
      return;
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
      return;
    }
  };

  // controller for handling viewing user profile

  static getUserById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const user = await userService.getUserById(id);
      if (!user) {
        res.status(404).json({ mesage: "User not found" });
        return;
      }
      res.status(200).json({ user });
    } catch (error) {
      res.status(500).json({ message: "Error fetching user", error });
    }
  };

  // controller for handling updateuser

  static updateUser = async (req: Request, res: Response) => {
    try {
      const userId = req.params.id;
      const userData = req.body;
      const updatedUser = await userService.updateUser(userId, userData);

      if (!updatedUser) {
        res.status(404).json("No user found");
      }
      res.status(200).json(updatedUser);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  };

  // controller for handling userlogout

  static logoutUser = (req: Request, res: Response) => {
    try {
      res.clearCookie("token");
      res.status(200).json({ message: "Logout Successful" });
    } catch (error) {
      res.status(500).json({ message: "Error in logging out", error });
    }
  };

  //   controller to handle forgot password

  static forgotPassword = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { email } = req.body;

      const resetToken = await userService.handleForgotPassword(email);
      if (!resetToken) {
        res.status(404).json({ message: "No user found" });
        return;
      }
      res
        .status(200)
        .json({ message: "Password reset link sent to the registered email" });
    } catch (error) {
      res.status(500).json({ message: "Error in sending link", error });
    }
  };

  static resetPassword = async (req: Request, res: Response): Promise<void> => {
    try {
      const { token, newPassword, confirmNewPassword } = req.body;
       console.log("Received data:", {
         token,
         newPassword,
         confirmNewPassword,
       });

      // Verify the token
      const decoded = verifyResetToken(token);
      if (!decoded) {
         res.status(400).json({ message: "Invalid or expired token" });
         return
      }
      
      if (newPassword !== confirmNewPassword) {
        console.log("Error resetting password:", error); 
        res.status(400).json({ error: "Password does not match" });
        return;
      }

      

      const user = await userService.updatePassword(
        decoded.userId,
        newPassword
      );
      if (!user) {
        res.status(404).json({ message: "User not found" });
        return
      }

      res.status(200).json({ message: "Password reset successful" });
    } catch (error) { console.log("Inside catch block"); 
    console.error("Error resetting password:", error);
      res.status(500).json({ message: "Error resetting password", error });
    }
  };
}
