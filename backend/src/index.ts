import express from 'express';
import router from './routes/empRouter.js';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import authRouter from './routes/authRouter.js';
import { errorMiddleware } from './middleware/errorMiddleware.js';

dotenv.config();
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    
  })
);
app.use(cookieParser());

app.use("/api/employee", router);
app.use("/api/auth", authRouter);
app.use(errorMiddleware)

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});