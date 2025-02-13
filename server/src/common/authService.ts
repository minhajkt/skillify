// import { comparePassword } from "../utils/passwordHashing";
// import { generateToken } from "../utils/jwtUtil";
// import { IUserRepository } from "../modules/user-management/repositories/IUserRepository";
// import { IUser } from "../modules/user-management/models/UserModel";

// export const login = async(email: string, password: string, repository:IUserRepository):Promise<{token: string, user:IUser}> => {
//     if (!email || !password) {
//       throw new Error("Email and password cannot be empty");
//     }
    
//     const user = await repository.getUserByEmail(email);
//     if (!user) {
//       throw new Error("User not found");
//     }
    
//     const isPasswordValid = await comparePassword(password, user.password);
//     if (!isPasswordValid) {
//       throw new Error("Invalid Password. Please enter a valid password");
//     }
    
//     const token = generateToken({ id: user._id, email: user.email ,role: user.role, isActive: user.isActive });
    
//     return { token, user };   
// }