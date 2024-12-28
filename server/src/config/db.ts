import mongoose from "mongoose";
import dotenv from 'dotenv'

dotenv.config()

const connectDB = async() => {
    try {
        await mongoose.connect(process.env.MONGO_URI as string)
        console.log('MongoDB is connected successfully');
    } catch (error) {
        console.log('Error in connecting MongoDB',error);
        process.exit(1)
    }
}

export default connectDB;