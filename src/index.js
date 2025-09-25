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
import "./jobs/sendVoucherJob.js"
dotenv.config();

const app = express();
const httpServer = createServer(app); // 👈 Tạo HTTP server từ Express
const io = initSocket(httpServer);
// Setup Socket.IO
// const io = new Server(httpServer, {
//   cors: {
//     origin: "https://soundora-store.onrender.com",
//     credentials: true,
//   },
// });

// // Socket.IO event setup
// io.on("connection", (socket) => {
//   console.log("⚡ Client connected: ", socket.id);

//   // Listen to events
//   socket.on("sendMessage", (data) => {
//     console.log("📩 Received message:", data);
//     // Broadcast to all other clients
//     socket.broadcast.emit("receiveMessage", data);
//   });

//   socket.on("disconnect", () => {
//     console.log("❌ Client disconnected:", socket.id);
//   });
// });

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

// const reuslt = await Users.updateMany({ Image: { $exists: true } }, { $set: { Image: {} } });
// console.log(reuslt);
// const bac = await ProductVariants.updateMany(
//   {},
//   [{ $set: { Id_Products: { $toObjectId: "$Id_Products" } } }]
// )
// console.log(bac);

// import express from "express";
// import mongoose from "mongoose";
// import cors from "cors";
// import dotenv from "dotenv";
// import connectDB from "./config/connectDB.js";
// import router from "./routes/index.js";
// import cookieParser from "cookie-parser";
// dotenv.config();

// const app = express();

// app.use(
//   cors({
//     origin: "https://soundorastore.vercel.app",
//     credentials: true,
//   })
// );
// app.use(express.json({ limit: "1000mb" }));
// app.use(express.urlencoded({ extended: true }));
// app.use(cookieParser());

// app.use("/api", router);

// const PORT = process.env.PORT || 3000;
// connectDB().then(() => {
//   app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
//   });
// });
