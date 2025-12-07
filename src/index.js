import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js"
import bookRoutes from "./routes/bookRoutes.js"
import { connectDB } from "./lib/db.js";

dotenv.config();

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 5001;

// routes
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);

const startServer = async () => {
  try {
    await connectDB();  // wait until DB is connected
    app.listen(PORT, () => {
      console.log(`Server is running on ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to connect to DB", error);
    process.exit(1);
  }
};

startServer();
