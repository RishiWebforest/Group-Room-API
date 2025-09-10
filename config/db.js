import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      autoIndex: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[MongoDB Error] ${error.name}: ${error.message}`);
    console.error(error); // full stack trace for TLS issues
    process.exit(1);
  }
};

export default connectDB;
