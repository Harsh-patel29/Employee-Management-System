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
    methods: "POST,GET,PUT,DELETE",
  })
);
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

import userRoute from "./Routes/userRoute.js";
import attendanceRoute from "./Routes/attendanceRoute.js";
import projectRoute from "./Routes/projectRoute.js";
app.use("/api/v1/user", userRoute);
app.use("/api/v2/attendance", attendanceRoute);
app.use("/api/v3/project", projectRoute);
export { app };
