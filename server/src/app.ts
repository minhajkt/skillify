import express from 'express'
import cors from "cors"
import connectDB from './config/db'
import userRoutes from './modules/user-management/routes'
import cookieParser from 'cookie-parser'
import adminRoutes from './modules/admin-management/admin-routes'

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

app.use('/api', userRoutes)
app.use("/api", adminRoutes);
// app.use('/api/tutors', userRoutes)

app.get('/', (req, res) => {
    res.send("hello world")
})

app.listen(port , () => {
    console.log(`Listening to port ${port}`);
    
})