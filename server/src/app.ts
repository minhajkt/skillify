import express from 'express'
import cors from "cors"
import connectDB from './config/db'
import userRoutes from './modules/user-management/routes'
import cookieParser from 'cookie-parser'
import adminRoutes from './modules/admin-management/admin-routes'
import courseRouter from './modules/courses/course-routes'
import lectureRouter from './modules/lectures/lecture-routes'
import tutorRouter from './modules/tutor/tutor-routes'
import multer from 'multer'
import Stripe from 'stripe'

const app = express()

connectDB()

app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json())


const port = process.env.PORT || 5000;
app.use(cookieParser());

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion:"2024-12-18.acacia"
});

app.use('/api', userRoutes)
app.use("/api", adminRoutes);
app.use('/api', courseRouter)
app.use('/api', lectureRouter)
app.use("/api", tutorRouter);
// app.use('/api/tutors', userRoutes)

app.get('/', (req, res) => {
    res.send("hello world")
})

app.listen(port , () => {
    console.log(`Listening to port ${port}`);
    
})