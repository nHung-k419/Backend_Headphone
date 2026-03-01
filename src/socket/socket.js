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
    socket.on("sendReview", async (data) => {
      const resultReview = await saveReview(data);

      // 🔥 populate lại user trước khi emit
      const reviewFull = await Reviews.findById(resultReview._id)
        .populate("Id_User", "Name Image");

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
