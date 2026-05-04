import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();

// Start connecting to DB asynchronously (don't wait for initial connection)
connectDB().catch(err => console.error("Failed to connect:", err.message));

const app = express();
// Middleware
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174", "http://localhost:5175", "http://localhost:5176", "http://localhost:5177"], // frontend URLs
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  credentials: true // if you are sending cookies
}));

// allow larger payloads for images encoded as base64
app.use(express.json({ limit: "10mb" }));


// Routes
app.use("/api/user", userRoutes);
import productRoutes from "./routes/productRoutes.js";
app.use("/api/products", productRoutes);
import orderRoutes from "./routes/orderRoutes.js";
app.use("/api/orders", orderRoutes);
import messageRoutes from "./routes/messageRoutes.js";
app.use("/api/messages", messageRoutes);
import reviewRoutes from "./routes/reviewRoutes.js";
app.use("/api/reviews", reviewRoutes);

// Default route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
