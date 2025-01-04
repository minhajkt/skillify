import { error } from "console";
import { UserRepository } from "../repositories/UserRepository";
import { UserService } from "../services/UserService";
import { Request, Response } from "express";
import { sendOtpToEmail, storeOtp } from "../../../utils/otpUtil";
import { verifyResetToken } from "../../../utils/jwtUtil";
import { cloudinary } from "../../../config/cloudinaryConfig";
import {upload } from '../../../config/cloudinaryConfig'
import { OAuth2Client } from "google-auth-library";
import { generateToken } from "../../../utils/jwtUtil";

const userRepository = new UserRepository();
const userService = new UserService(userRepository);
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

interface AuthRequest extends Request {
  user?: {
    id: string;
  };
}

export class UserController {

  static createUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const { name, email, password, confirmPassword, bio } = req.body;
      const certificates = req.files as Express.Multer.File[]; 
      // console.log('req is ', req.files);
      
      if (password !== confirmPassword) {
         res.status(400).json({ error: "Password does not match" });
        return;
      }

      const role = req.originalUrl.includes("tutor") ? "tutor" : "user";
      let userData: {
        name: string;
        email: string;
        password: string;
        role: string;
        bio?: string;
        certificates?: string[];
      } = {
        name,
        email,
        password,
        role,
        bio,
      };

      if (role === "tutor") {
        let certificatesUrls: string[] = [];

        if (certificates && certificates.length > 0) {
          await Promise.all(
            certificates.map((certificate) => {
              return new Promise<void>((resolve, reject) => {
                const uploadResult = cloudinary.v2.uploader.upload(
                  certificate.path,
                  {
                    folder: "tutor_certificates",
                    resource_type: "auto",
                  },
                  (error, result) => {
                    if (error) {
                      reject(
                        new Error(
                          `Error uploading certificate: ${error.message}`
                        )
                      );
                    } else if (result) {
                      certificatesUrls.push(result.secure_url); 
                      resolve(); 
                    }
                  }
                );
              });
            })
          );
        }

        if (certificatesUrls.length > 0) {
          userData.certificates = certificatesUrls;
        }
      }
      // if (role !== "tutor") {
      //   const otp = await sendOtpToEmail(email);
      //   storeOtp(email, otp);
      //   console.log("otp is ", otp);
      // }

      const otp = await sendOtpToEmail(email);
      storeOtp(email, otp);
      console.log("otp is ", otp);

      const user = await userService.createUser(userData);
      res
        .status(201)
        .json({ message: "User created. OTP is sent to the email" });
    } catch (error) {
      console.error("Error in createUser:", error); 
      res.status(500).json({ error: (error as Error).message });
    }
  };


  static verifyOtp = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, otp } = req.body;

      const isOtpValid = await userService.verifyOtp(email, otp);

      if (isOtpValid) {
        const user = await userRepository.getUserByEmail(email);
        if (user) {
          user.verified = true;
          await user.save();
        }
        res.status(200).json({ user, message: "OTP verified successfully!" });
        return;
      }
      res.status(400).json({ error: "Invalid or expired OTP." });
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  };


  static loginUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;
      const { token, user } = await userService.loginUser(email, password);

      if (!token) {
        res.status(404).json({ message: "User not found" });
        return;
      }
      if (!user.verified) {
        throw new Error("Please verify your email before logging in.");
      }
      if (!user.isActive) {
        throw new Error("Your account has been temporarily suspended.");
      }

      res.status(200).json({ message: "Login successful", token, user });
      console.log("for now", user);

      return;
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
      return;
    }
  };

  static loginTutor = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;
      const { token, user } = await userService.loginUser(email, password);

      if (!token) {
        res.status(404).json({ message: "Tutor not found" });
        return;
      }


      if (user.role !== "tutor") {
        throw new Error("Access denied. Only tutors can log in here.");
      }

      if (user.isApproved !== "approved") {
        throw new Error("Access denied. Your application is under review");
      }
      res.status(200).json({ message: "Login successful", token, user });
      console.log("for now", user);

      return;
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
      return;
    }
  };
  static loginAdmin = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;
      const { token, user } = await userService.loginUser(email, password);

      if (!token) {
        res.status(404).json({ message: "Admin not found" });
        return;
      }
      if (!user.verified) {
        throw new Error("Please verify your email before logging in.");
      }

      if (user.role !== "admin") {
        throw new Error("Access denied. Only admin can log in here.");
      }

      res.status(200).json({ message: "Login successful", token, user });
      console.log("for now", user);

      return;
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
      return;
    }
  };


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


  static updateUser = async (req: Request, res: Response):Promise<void> => {
    try {
      const userId = req.params.id;
      const userData = req.body;

      if (req.file) {
        // console.log("image file is", req.file.path);

        userData.profilePhoto = req.file.path;
      }
      const updatedUser = await userService.updateUser(userId, userData);

      if (!updatedUser) {
         res.status(404).json("No user found");
         return;
      }
      // console.log("update user in controller", updatedUser);

      res.status(200).json({ user: updatedUser });
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  };

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

      const decoded = verifyResetToken(token);
      if (!decoded) {
        res.status(400).json({ message: "Invalid or expired token" });
        return;
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
        return;
      }

      res.status(200).json({ message: "Password reset successful" });
    } catch (error) {
      console.log("Inside catch block");
      console.error("Error resetting password:", error);
      res.status(500).json({ message: "Error resetting password", error });
    }
  };


static googleSignIn = async (req: Request, res: Response): Promise<void> => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      res.status(400).json({ error: "Google ID token is required" });
      return;
    }

    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload) {
      res.status(400).json({ error: "Invalid Google ID token" });
      return;
    }

    const { email, name, picture } = payload;

    if (!email) {
      res.status(400).json({ error: "Google account must have an email" });
      return;
    }

    let user = await userService.getUserByEmail(email);

    if(user && user.isActive === false) {
      res.status(403).json({error:"You are blocked"})
      console.log('blocked');
      return
      
    }

    if (!user) {
      const userData = {
        name,
        email,
        password: "", 
        role: "user",
        profilePicture: picture, 
      };
      user = await userService.createUser(userData);
    }

    const token = generateToken({ id: user.id, email: user.email, role: user.role });

    res.status(200).json({ message: "Google Sign-In successful", token, user });
  } catch (error) {
    console.error("Error in Google Sign-In:", error);
    res.status(500).json({ error: (error as Error).message });
  }
};

}
