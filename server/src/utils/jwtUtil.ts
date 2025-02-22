


import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

const JWT_SECRET_KEY = process.env.JWT_SECRET || 'my_secret_key'
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET

if(!JWT_SECRET_KEY) {
    throw new Error("JWT is not defined in the env")
}

if (!JWT_REFRESH_SECRET) {
  throw new Error("JWT refresh is not defined in the env");
}

export const generateToken = (payload : object) : string => {
    return jwt.sign(payload, JWT_SECRET_KEY, {expiresIn: '5m'})
}

export const generateRefreshToken = (payload: object): string => {
  return jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: "7d" });
}

export const verifyToken = (token:string) => {
    try {
        return jwt.verify(token, JWT_SECRET_KEY)
    } catch (error) {
        throw new Error('Invalid Token')
    }
}

export const verifyRefreshToken = (token: string) => {
  try {
    return jwt.verify(token, JWT_REFRESH_SECRET);
  } catch (error) {
    throw new Error("Invalid Token");
  }
};


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
