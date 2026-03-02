import { Server } from "socket.io";
import { saveReview } from "../controller/Reviews.Controller.js";
import { CreateCommentLike } from "../controller/CommentLike.controller.js";
import { Reviews } from "../models/Reviews.model.js";
let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    console.log("⚡ Client connected:", socket.id);

    socket.on("sendReview", async (data) => {
      console.log("📥 Nhận review:", data); // 👈 thêm dòng này

      const resultReview = await saveReview(data);

      const reviewFull = await Reviews.findById(resultReview._id)
        .populate("Id_User", "Name Image");

      console.log("📤 Emit newReview:", reviewFull); // 👈 thêm dòng này

      io.emit("newReview", reviewFull);
    });
    socket.on("likeReview", async ({ userId, commentId }) => {
      const result = await CreateCommentLike({ UserId: userId, CommentId: commentId });
      // console.log(result);
      io.emit("newLike", result);
    })

  });

  return io;
};

export const getSocket = () => io;
