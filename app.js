import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import rateLimit from "express-rate-limit";

import groupRoutes from "./routes/groupRoutes.js";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";
import logger from "./utils/logger.js";
import { swaggerDocs } from "./utils/swagger.js"; 

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());

// HTTP request logging using morgan + winston
app.use(morgan("combined", { stream: logger.stream }));

// Global rate limiter
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, error: "Too many requests from this IP, try again later" },
});

app.use(globalLimiter);

// Routes
app.use("/api/groups", groupRoutes);

// Initialize Swagger docs route
swaggerDocs(app); // <-- call swaggerDocs here

// 404 handler
app.use(notFound);

// Error handler
app.use(errorHandler);

export default app;
