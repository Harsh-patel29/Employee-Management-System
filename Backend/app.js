import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
dotenv.config({
  path: "./.env",
});
const app = express();

app.use(express.json({ limit: "16kb" }));
app.use(express.static("public"));
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
    methods: "POST,GET,PUT,DELETE,PATCH",
  })
);
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));


import userRoute from "./Routes/userRoute.js";
import attendanceRoute from "./Routes/attendanceRoute.js";
import projectRoute from "./Routes/projectRoute.js";
import taskRoute from "./Routes/taskRoute.js";
import leaveRoute from "./Routes/leaveRoute.js"
import tasktimerRoute from "./Routes/tasktimerRoute.js"
app.use("/api/v1/user", userRoute);
app.use("/api/v2/attendance", attendanceRoute);
app.use("/api/v3/project", projectRoute);
app.use("/api/v4/tasks", taskRoute);
app.use("/api/v5/leave",leaveRoute)
app.use("/api/v6/tasktimer",tasktimerRoute)

app.use((err,req,res,next)=>{
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  console.log(err.message);
  res.status(statusCode).json({message})
})
export { app };
