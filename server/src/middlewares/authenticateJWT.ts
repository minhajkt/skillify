import { NextFunction } from "express"
import { verifyToken } from "../utils/jwtUtil"
import { Request, Response } from "express"


export const authenticateJWT = (req: Request, res: Response, next: NextFunction):void => {
    const token = req.cookies.authToken

    if(!token) {
         res.status(401).json({message: 'No token found'})
         return;
    }

    try {
        const decoded = verifyToken(token)
        req.user = decoded
        next()
    } catch (error) {
        res.status(403).json({message: 'Invalid Token'})        
        return; 
    }
}