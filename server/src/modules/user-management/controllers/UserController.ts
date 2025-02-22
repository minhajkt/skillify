import { error } from "console";
import { UserRepository } from "../repositories/UserRepository";
import { UserService } from "../services/UserService";
import { Request, Response } from "express";
import { sendOtpToEmail, storeOtp } from "../../../utils/otpUtil";
import { verifyRefreshToken, verifyResetToken } from "../../../utils/jwtUtil";
import { cloudinary } from "../../../config/cloudinaryConfig";
import { upload } from "../../../config/cloudinaryConfig";
import { OAuth2Client } from "google-auth-library";
import { generateToken } from "../../../utils/jwtUtil";
import Stripe from "stripe";
import mongoose from "mongoose";
import { IUserService } from "../services/IUserService";
import { IUserController } from "./IUserController";
import User from '../models/UserModel'
import { HttpStatus } from "../../../constants/httpStatus";
import { MESSAGES } from "../../../constants/messages";


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
        .status(HttpStatus.CREATED)
        .json({ message: MESSAGES.OTP_SENT });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: (error as Error).message });
    }
  }

  async verifyOtp(req: Request, res: Response): Promise<void> {
    try {
      const { email, otp } = req.body;

      const user = await this.userService.verifyOtp(email, otp);

      if (user) {
        res.status(HttpStatus.OK).json({ user, message: MESSAGES.OTP_VERIFIED });
      } else {
        res
          .status(HttpStatus.BAD_REQUEST)
          .json({ error: MESSAGES.OTP_VERIFICATION_FAILED });
      }
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: (error as Error).message });
    }
  }

  async resendOtp(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;

      if (!email) {
        res.status(HttpStatus.BAD_REQUEST).json({ error: MESSAGES.EMAIL_NOT_FOUND });
        return;
      }

      await this.userService.resendOtp(email);

      res.status(HttpStatus.OK).json({ message: MESSAGES.OTP_RESENT });
    } catch (error: any) {
      res
        .status(error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message || MESSAGES.OTP_RESENT_FAILED });
    }
  }

  async loginUser(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      const { token, refreshToken, user } = await this.userService.loginUser(
        email,
        password
      );

      if (!token) {
        res.status(HttpStatus.NOT_FOUND).json({ message: MESSAGES.USER_NOT_FOUND });
        return;
      }

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      

      res.status(HttpStatus.OK).json({ message: MESSAGES.LOGIN_SUCCESS_MESSAGE, token, user });

      return;
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: (error as Error).message });
      return;
    }
  }

  async refreshAccessToken(req: Request, res: Response): Promise<void> {
    try {
      const refreshToken = req.cookies.refreshToken;
      if (!refreshToken) {
        res.clearCookie("refreshToken");
         res.status(HttpStatus.UNAUTHORIZED).json({ message: MESSAGES.NO_REFRESH_TOKEN });
         return;
      }

      
      const decoded = verifyRefreshToken(refreshToken) as { id: string };
      const user = await User.findById(decoded.id);
      if (!user) {
        res.clearCookie('refreshToken');
         res.status(HttpStatus.NOT_FOUND).json({ message: MESSAGES.USER_NOT_FOUND });
         return;
      }

      const newAccessToken = generateToken({
        id: user._id,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
      });

      res.json({ token: newAccessToken });
    } catch (error) {
      res.clearCookie("refreshToken");
      res.status(HttpStatus.FORBIDDEN).json({ message: MESSAGES.INVALID_REFRESH_TOKEN });
    }
  }

  async loginTutor(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      const { token, refreshToken, user } = await this.userService.loginTutor(
        email,
        password
      );

      if (!token) {
        res.status(HttpStatus.NOT_FOUND).json({ message: MESSAGES.TUTOR_NOT_FOUND });
        return;
      }

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.status(HttpStatus.OK).json({ message: MESSAGES.LOGIN_SUCCESS_MESSAGE, token, user });

      return;
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: (error as Error).message });
      return;
    }
  }
  async loginAdmin(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      const { token, refreshToken, user } = await this.userService.loginAdmin(
        email,
        password
      );

      if (!token) {
        res.status(HttpStatus.NOT_FOUND).json({ message: MESSAGES.ADMIN_NOT_FOUND });
        return;
      }

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.status(HttpStatus.OK).json({ message: MESSAGES.LOGIN_SUCCESS_MESSAGE, token, user });

      return;
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: (error as Error).message });
      return;
    }
  }

  async getUserById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const user = await this.userService.getUserById(id);
      if (!user) {
        res.status(HttpStatus.NOT_FOUND).json({ mesage: MESSAGES.USER_NOT_FOUND });
        return;
      }

      res.status(HttpStatus.OK).json({ user });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: MESSAGES.ERROR_FETCHING_USER, error });
    }
  }

  async updateUser(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.params.id;

      const userData = req.body;
      if (req.file) {
        userData.profilePhoto = req.file.path;
      }
      const updatedUser = await this.userService.updateUser(userId, userData);

      if (!updatedUser) {
        res.status(HttpStatus.NOT_FOUND).json(MESSAGES.USER_NOT_FOUND);
        return;
      }

      res.status(HttpStatus.OK).json({ user: updatedUser });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: (error as Error).message });
    }
  }

  async logoutUser(req: Request, res: Response): Promise<void> {
    try {
      
      res.clearCookie("token");
      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      });
      res.status(HttpStatus.OK).json({ message: MESSAGES.LOGOUT_SUCCESS_MESSAGE });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error });
    }
  }

  //   controller to handle forgot password

  async forgotPassword(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;

      const resetToken = await this.userService.handleForgotPassword(email);
      if (!resetToken) {
        res.status(HttpStatus.NOT_FOUND).json({ message: MESSAGES.USER_NOT_FOUND });
        return;
      }
      res
        .status(HttpStatus.OK)
        .json({ message: MESSAGES.PASSWORD_RESET_LINK_SENT });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: MESSAGES.PASSWORD_RESET_LINK_SENT_ERROR, error });
    }
  }

  async resetPassword(req: Request, res: Response): Promise<void> {
    try {
      const { token, newPassword, confirmNewPassword } = req.body;

      const decoded = verifyResetToken(token);
      if (!decoded) {
        res.status(HttpStatus.BAD_REQUEST).json({ message: MESSAGES.INVALID_TOKEN });
        return;
      }

      if (newPassword !== confirmNewPassword) {
        res.status(HttpStatus.BAD_REQUEST).json({ error: MESSAGES.INCORRECT_PASSWORD });
        return;
      }

      const user = await this.userService.updatePassword(
        decoded.userId,
        newPassword
      );
      if (!user) {
        res.status(HttpStatus.NOT_FOUND).json({ message: MESSAGES.USER_NOT_FOUND });
        return;
      }

      res.status(HttpStatus.OK).json({ message: MESSAGES.PASSWORD_RESET_SUCCESS });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: MESSAGES.PASSWORD_RESET_ERROR, error });
    }
  }

  async googleSignIn(req: Request, res: Response): Promise<void> {
    try {
      const { idToken } = req.body;

      if (!idToken) {
        res.status(HttpStatus.BAD_REQUEST).json({ error: MESSAGES.GOOGLE_SIGN_ERROR });
        return;
      }

      const ticket = await client.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();
      if (!payload) {
        res.status(HttpStatus.BAD_REQUEST).json({ error: MESSAGES.INVALID_GOOGLE_TOKEN });
        return;
      }

      const { email, name, picture } = payload;

      if (!email) {
        res.status(HttpStatus.BAD_REQUEST).json({ error: MESSAGES.GOOGLE_EMAIL_ERROR });
        return;
      }

      let user = await this.userService.getUserByEmail(email);

      if (user && user.isActive === false) {
        res.status(HttpStatus.FORBIDDEN).json({ error: MESSAGES.USER_BLOCKED });
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
        .status(HttpStatus.OK)
        .json({ message: MESSAGES.GOOGLE_SIGN_IN_SUCCESS, token, user });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: (error as Error).message });
    }
  }

  async getCourseById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const course = await this.userService.getCourseById(id);
      if (!course) {
        res.status(HttpStatus.NOT_FOUND).json({ message: MESSAGES.COURSE_NOT_FOUND });
        return;
      }
      res.status(HttpStatus.OK).json(course);
      return;
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: MESSAGES.UNEXPECTED_ERROR, error });
      return;
    }
  }

  async stripePayment(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { courseId } = req.params;
      const userId = req.user?.id;

      if (!mongoose.Types.ObjectId.isValid(courseId)) {
        res.status(HttpStatus.BAD_REQUEST).json({ message: MESSAGES.INVALID_COURSE_ID });
      }

      const course = await this.userService.getCourseById(courseId);
      if (!course) {
        res.status(HttpStatus.NOT_FOUND).json({ message: MESSAGES.COURSE_NOT_FOUND });
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
          courseId: courseId || 'unkown',
          userId: userId ?? 'guest',
        },
      });

      res.json({ id: session.id });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: MESSAGES.STRIPE_PAYMENT_FAILED,
        error: (error as Error).message,
      });
    }
  }

  async getTutorCount(req: Request, res: Response): Promise<void> {
    try {
      const tutorCount = await this.userService.getTutorCount();
      if (!tutorCount) {
        res.status(HttpStatus.NOT_FOUND).json(MESSAGES.TUTOR_NOT_FOUND);
        return;
      }
      res.status(HttpStatus.OK).json(tutorCount);
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(MESSAGES.UNEXPECTED_ERROR);
    }
  }
}
