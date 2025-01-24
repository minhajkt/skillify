import { NextFunction } from "express"
import { verifyToken } from "../utils/jwtUtil"
import { Request, Response } from "express"
import User, {IUser} from '../modules/user-management/models/UserModel'
import { JwtPayload } from "jsonwebtoken";

interface DecodedToken extends JwtPayload {
  id: string; 
}

interface RequestWithUser extends Request {
  user: IUser; 
}

export const authenticateJWT = async(req: RequestWithUser, res: Response, next: NextFunction):Promise<void> => {
    const token = req.cookies.authToken
    // console.log("Cookies: ", req.cookies);  
    if(!token) {
         res.status(401).json({message: 'No token found'})
         return;
    }

    try {
      const decoded = verifyToken(token) as DecodedToken;

      console.log(decoded);
      const user = await User.findById(decoded.id);

      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }

      if (!user.isActive) {
        res.status(403).json({ message: "Your account is blocked" });
        return;
      }


      // req.user = user;
      req.user = user;

      next();
    } catch (error) {
        res.status(403).json({message: 'Invalid Token'})
        return; 
    }
}



// if (requiredRole && user.role !== requiredRole) {
//   res
//     .status(403)
//     .json({ message: `User is not authorized as ${requiredRole}` });
//   return;
// }