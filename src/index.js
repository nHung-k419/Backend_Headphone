import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/connectDB.js";
import router from "./routes/index.js";
import cookieParser from "cookie-parser";
import { createServer } from "http";
import { initSocket } from "./socket/socket.js";
import { Users } from "./models/User.model.js";
import { ProductVariants } from "./models/Product_Variants.js";
import { Server } from "socket.io";
import "./jobs/sendVoucherJob.js"
dotenv.config();

const app = express();
const httpServer = createServer(app); // Tạo HTTP server từ Express
const io = initSocket(httpServer);

// Middlewares
app.use(
  cors({
    origin: "https://soundora-store.onrender.com",
    credentials: true,
  })
);
app.use(express.json({ limit: "1000mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/api", router);

const PORT = process.env.PORT || 3000;

// Kết nối MongoDB và chạy server
connectDB().then(() => {
  httpServer.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
  });
});