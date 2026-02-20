require("dotenv").config({ quiet: true });
import express, { NextFunction, Request, Response } from "express";
export const app = express();
import cors from "cors";
import cookieParser from "cookie-parser";
import { ErrorMidleware } from "./middleware/error";
import userRouter from "./routes/user.route";
import issueRouter from "./routes/issue.route";
import dashboardRoutes from "./routes/dashboard.route";
import notificationRouter from "./routes/notification.route";
import adminRouter from "./routes/admin.route";


// Body parser
app.use(express.json({ limit: "50mb" }));

// Cookie parser
app.use(cookieParser());

// CORS setup
app.use(
  cors({
    origin: process.env.ORIGIN || "http://localhost:3000",
    credentials: true,
  }),
);

// Routes
app.use("/api/v1/auth", userRouter);
app.use("/api/v1/issues", issueRouter);
app.use("/api/v1/dashboard", dashboardRoutes);
app.use("/api/v1/notifications", notificationRouter);
app.use("/api/v1/admin", adminRouter);

// Testing API
app.get("/test", (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({
    success: true,
    message: "API is working",
  });
});

// Unknown route (FIXED FOR EXPRESS 5)
// Changed "*" to /(.*)/
app.all(/(.*)/, (req: Request, res: Response, next: NextFunction) => {
  const err = new Error(`Route ${req.originalUrl} not found`) as any;
  err.statusCode = 404;
  next(err);
});

// Error Middleware (Must be last)
app.use(ErrorMidleware);
