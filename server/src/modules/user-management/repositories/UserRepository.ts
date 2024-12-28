import User, { IUser } from "../models/UserModel";
import { IUserRepository } from "./IUserRepository";
import bcrypt from 'bcryptjs'

export class UserRepository implements IUserRepository {
    async createUser(userData: Partial<IUser>) : Promise<IUser> {
        const user = new User(userData);
        return await user.save()
    }
    
    async getUserByEmail(email: String): Promise<IUser | null> {
        return await User.findOne({email})  
    }
    
    async updateUser(id: String, userData: Partial<IUser>): Promise<IUser | null> {
        return await User.findByIdAndUpdate(id, userData, {new: true})
    }

    async getAllUsers(): Promise<IUser[]> {
        return await User.find()
    }

    async getUserById(id: String): Promise<IUser | null> {
        return await User.findById(id)
    }

    async updatePassword(userId: string, newPassword: string): Promise<IUser | null> {
    const hashedPassword = await bcrypt.hash(newPassword, 10); 
    return await User.findByIdAndUpdate(userId, { password: hashedPassword }, { new: true });
  }
}