import express from 'express'
import http from 'http'
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
import webhookRouter from './modules/webhooks/webhook-route'
import enrollmentRouter from './modules/enrollment/enrollment-route';
import reviewRouter from './modules/review/review-routes'
import wishlistRouter from './modules/wishlist/wishlist-route'
import reportRouter from './modules/report/report-route'
import paymentRouter from './modules/payments/payment-route'
import { initializeSocket } from './utils/socket'
import messageRouter from './modules/messages/message-route'
import progressRouter from './modules/courseProgress/progress-route'


const app = express()

connectDB()

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);
// app.use(express.raw({ type: "application/json" }));
app.use("/webhook", express.raw({ type: "application/json" }), webhookRouter);

app.use(express.json())

const server = http.createServer(app)

initializeSocket(server)

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
app.use('/api', enrollmentRouter)
app.use('/api', reviewRouter)
app.use("/api", wishlistRouter);
app.use("/api", reportRouter);
app.use("/api", paymentRouter);
app.use("/api", messageRouter);
app.use('/api', progressRouter)

app.get('/', (req, res) => {
    res.send("hello world")
})

server.listen(port , () => {
    console.log(`Listening to port ${port}`);
})

