import { NextFunction, Request, Response } from "express"

interface User {
    role: string
}

export const checkRole = (roles: string[]) => {
    
    return (req: Request, res: Response, next: NextFunction): void => {
        if (!req.user) {
            res.status(401).json({ error: "User not authenticated" });
            return
        }
        const userRole = (req.user) as User & {role : string}
        
        if(roles.includes(userRole.role)) {
            return next()
        }
         res.status(403).json({error: "forbidden"})
         return;
    }
}