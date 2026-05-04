import mongoose from "mongoose"

const connectDB = async () => {
  try {
    console.log("Attempting to connect to MongoDB...");
    console.log("MongoDB URI:", process.env.MONGO_URI?.substring(0, 50) + "...");
    
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 15000,
      socketTimeoutMS: 45000,
      retryWrites: true,
      w: "majority",
    });
    
    console.log("✅ MongoDB Connected Successfully");
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    console.error("Full error:", error);
    // Don't exit - allow app to run without database initially
    console.log("⚠️  App running without database. Check your MONGO_URI and network connection.");
  }
}

export default connectDB