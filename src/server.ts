import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import { connectDB } from "./config/mongodb";
import verificationRoutes from "./routes/verificationRoutes";

dotenv.config();

const app = express();

/* CORS FIX */
app.use(cors({
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "x-api-key"]
}));

app.use(express.json());

app.use("/api/verifications", verificationRoutes);

connectDB();

const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});