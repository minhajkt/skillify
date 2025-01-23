import { error } from "console";
import { UserRepository } from "../repositories/UserRepository";
import { UserService } from "../services/UserService";
import { Request, Response } from "express";
import { sendOtpToEmail, storeOtp } from "../../../utils/otpUtil";
import { verifyResetToken } from "../../../utils/jwtUtil";
import { cloudinary } from "../../../config/cloudinaryConfig";
import { upload } from "../../../config/cloudinaryConfig";
import { OAuth2Client } from "google-auth-library";
import { generateToken } from "../../../utils/jwtUtil";
import Stripe from "stripe";
import mongoose from "mongoose";
import { IUserService } from "../services/IUserService";
import { IUserController } from "./IUserController";


const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-12-18.acacia",
});

interface AuthRequest extends Request {
  user?: {
    id: string;
  };
}


export class UserController implements IUserController {
  private userService: IUserService;
  constructor(userService: IUserService) {
    this.userService = userService;
  }

  async createUser(req: Request, res: Response): Promise<void> {
    try {
      const { name, email, password, confirmPassword, bio } = req.body;
      const certificates = req.files as Express.Multer.File[];

      const role = req.originalUrl.includes("tutor") ? "tutor" : "user";
      const userData = { name, email, password, role, bio };

      const user = await this.userService.createUser(userData, certificates);
      res
        .status(201)
        .json({ message: "User created. OTP is sent to the email" });
    } catch (error) {
      console.error("Error in createUser:", error);
      res.status(500).json({ error: (error as Error).message });
    }
  }

  async verifyOtp(req: Request, res: Response): Promise<void> {
    try {
      const { email, otp } = req.body;

      const user = await this.userService.verifyOtp(email, otp);

      if (user) {
        res.status(200).json({ user, message: "OTP verified successfully!" });
      } else {
        res
          .status(400)
          .json({ error: "User not found or OTP verification failed." });
      }
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  async resendOtp(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;

      if (!email) {
        res.status(400).json({ error: "Email is required" });
        return;
      }

      await this.userService.resendOtp(email);

      res.status(200).json({ message: "OTP resent successfully" });
    } catch (error: any) {
      res
        .status(error.statusCode || 500)
        .json({ error: error.message || "Failed to resend OTP" });
    }
  }

  async loginUser(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      const { token, user } = await this.userService.loginUser(email, password);

      if (!token) {
        res.status(404).json({ message: "User not found" });
        return;
      }

      res.status(200).json({ message: "Login successful", token, user });
      console.log("for now", user);

      return;
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
      return;
    }
  }

  async loginTutor(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      const { token, user } = await this.userService.loginTutor(
        email,
        password
      );

      if (!token) {
        res.status(404).json({ message: "Tutor not found" });
        return;
      }

      res.status(200).json({ message: "Login successful", token, user });
      console.log("for now", user);

      return;
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
      return;
    }
  }
  async loginAdmin(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      const { token, user } = await this.userService.loginAdmin(
        email,
        password
      );

      if (!token) {
        res.status(404).json({ message: "Admin not found" });
        return;
      }

      res.status(200).json({ message: "Login successful", token, user });
      console.log("for now", user);

      return;
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
      return;
    }
  }

  async getUserById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const user = await this.userService.getUserById(id);
      if (!user) {
        res.status(404).json({ mesage: "User not found" });
        return;
      }
      // console.log("userrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr", user);

      res.status(200).json({ user });
    } catch (error) {
      res.status(500).json({ message: "Error fetching user", error });
    }
  }

  async updateUser(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.params.id;
      // console.log('id from jwt', userId);
      // console.log('role from jwt', req.user?.role);

      const userData = req.body;
      if (req.file) {
        // console.log("image file is", req.file.path);

        userData.profilePhoto = req.file.path;
      }
      const updatedUser = await this.userService.updateUser(userId, userData);

      if (!updatedUser) {
        res.status(404).json("No user found");
        return;
      }
      // console.log("update user in controller", updatedUser);

      res.status(200).json({ user: updatedUser });
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  async logoutUser(req: Request, res: Response): Promise<void> {
    try {
      res.clearCookie("token");
      res.status(200).json({ message: "Logout Successful" });
    } catch (error) {
      res.status(500).json({ message: "Error in logging out", error });
    }
  }

  //   controller to handle forgot password

  async forgotPassword(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;

      const resetToken = await this.userService.handleForgotPassword(email);
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
  }

  async resetPassword(req: Request, res: Response): Promise<void> {
    try {
      const { token, newPassword, confirmNewPassword } = req.body;

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

      const user = await this.userService.updatePassword(
        decoded.userId,
        newPassword
      );
      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }

      res.status(200).json({ message: "Password reset successful" });
    } catch (error) {
      // console.log("Inside catch block");
      console.error("Error resetting password:", error);
      res.status(500).json({ message: "Error resetting password", error });
    }
  }

  async googleSignIn(req: Request, res: Response): Promise<void> {
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

      let user = await this.userService.getUserByEmail(email);

      if (user && user.isActive === false) {
        res.status(403).json({ error: "You are blocked" });
        console.log("blocked");
        return;
      }

      if (!user) {
        const userData = {
          name,
          email,
          password: "",
          role: "user",
          profilePicture: picture,
        };
        user = await this.userService.createUser(userData);
      }

      const token = generateToken({
        id: user.id,
        email: user.email,
        role: user.role,
      });

      res
        .status(200)
        .json({ message: "Google Sign-In successful", token, user });
    } catch (error) {
      console.error("Error in Google Sign-In:", error);
      res.status(500).json({ error: (error as Error).message });
    }
  }

  async getCourseById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const course = await this.userService.getCourseById(id);
      if (!course) {
        res.status(404).json({ message: "Course not found" });
        return;
      }
      res.status(200).json(course);
      return;
    } catch (error) {
      res.status(500).json({ message: "An unexpected error occured", error });
      return;
    }
  }

  async stripePayment(req: Request, res: Response): Promise<void> {
    try {
      const { courseId } = req.params;
      const userId = req.user?.id;

      if (!mongoose.Types.ObjectId.isValid(courseId)) {
        res.status(400).json({ message: "Invalid course ID" });
      }

      const course = await this.userService.getCourseById(courseId);
      if (!course) {
        res.status(404).json({ message: "Course not found" });
        return;
      }

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "inr",
              product_data: {
                name: course.title,
                // description: course.description,
              },
              unit_amount: Math.round(course.price * 100),
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${process.env.FRONTEND_URL}/users/my-courses?success=true`,
        cancel_url: `${process.env.FRONTEND_URL}/users/course-details/${courseId}?cancelled=true`,
        metadata: {
          courseId: courseId,
          userId: userId,
        },
      });
      console.log("stripe test success", session);

      res.json({ id: session.id });
    } catch (error) {
      console.error("Stripe payment error:", error);
      res
        .status(500)
        .json({
          message: "Payment setup failed",
          error: (error as Error).message,
        });
    }
  }
}
