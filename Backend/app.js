import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
const app = express();

app.use(express.json({ limit: "16kb" }));
app.use(express.static("public"));
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
  })
);
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

import signUpRoute from "./Routes/user.route.js";

app.use("/api/users", signUpRoute);

export { app };
