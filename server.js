// server.js
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import app from "./app.js";
import { scheduleExpiryCheck } from "./utils/cron.js";

dotenv.config();

// Connect to MongoDB
connectDB();

// Start Cron Job for proactive group expiry
scheduleExpiryCheck();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`);
});
