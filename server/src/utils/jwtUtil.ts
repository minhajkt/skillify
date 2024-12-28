import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

const JWT_SECRET_KEY = process.env.JWT_SECRET || 'my_secret_key'
if(!JWT_SECRET_KEY) {
    throw new Error("JWT is not defined in the env")
}

export const generateToken = (payload : object) : string => {
    return jwt.sign({payload}, JWT_SECRET_KEY, {expiresIn: '1h'})
}

export const verifyToken = (token:string) => {
    try {
        return jwt.verify(token, JWT_SECRET_KEY)
    } catch (error) {
        throw new Error('Invalid Token') 
    }
}

export const generateResetToken = (userId: string) : string => {
    return jwt.sign({userId}, JWT_SECRET_KEY, {expiresIn:"15m"})
}

export const verifyResetToken = (token: string): any => {
  try {
    return jwt.verify(token, JWT_SECRET_KEY);
  } catch (error) {
    throw new Error("Invalid Token");
  }
};