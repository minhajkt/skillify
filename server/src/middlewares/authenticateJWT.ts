import { NextFunction } from "express"
import { verifyToken } from "../utils/jwtUtil"
import { Request, Response } from "express"
import User, {IUser} from '../modules/user-management/models/UserModel'
import { JwtPayload } from "jsonwebtoken";

interface DecodedToken extends JwtPayload {
  id: string; 
}

interface RequestWithUser extends Request {
  user?: IUser; 
}

export const authenticateJWT = async(req: Request, res: Response, next: NextFunction):Promise<void> => {
    const token = req.headers.authorization?.split(" ")[1];
    if(!token) {
         res.status(401).json({message: 'No token found'})
         return;
    }

    try {
      const decoded = verifyToken(token) as DecodedToken;

      const user = await User.findById(decoded.id);

      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }

      if (!user.isActive) {
        res.status(403).json({ message: "Your account is blocked" });
        return;
      }


      (req as RequestWithUser).user = user;

      next();
    } catch (error) {
        res.status(403).json({message: 'Token is expired. Please login again'})
        return; 
    }
}



// if (requiredRole && user.role !== requiredRole) {
//   res
//     .status(403)
//     .json({ message: `User is not authorized as ${requiredRole}` });
//   return;
// }