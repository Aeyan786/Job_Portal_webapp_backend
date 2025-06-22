import express from "express";
import dotenv from "dotenv";
import connectDB from "./Database/Database.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from "./Router/userRoutes.js";
import companyRoute from "./Router/companyRoutes.js";
import jobRoute from "./Router/jobRoutes.js";
import applicationRoute from "./Router/application.routes.js";
import path from "path";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;


// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const corsOptions = {
  origin: "https://job-portal-webapp-frontend.vercel.app", 
  credentials: true,
};
app.use(cors(corsOptions));
app.use(cookieParser());



// API Routes
app.use("/api/user", userRouter);
app.use("/api/company", companyRoute);
app.use("/api/job", jobRoute);
app.use("/api/application", applicationRoute);



app.listen(PORT, () => {
  connectDB();
  console.log(`server is running on ${PORT}`);
});
