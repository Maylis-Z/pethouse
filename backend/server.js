import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "./config/db.js";
import productRoutes from "./routes/productRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import { generalLimiter } from "./middleware/rateLimitMiddleware.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:5175",
  ],
}));

app.use(express.json());

// General rate limiting
app.use("/api", generalLimiter);

// Routes
app.get("/", (req, res) => {
  res.json({ message: "Pet House API is running" });
});

app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);

// Start server after database connection
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();