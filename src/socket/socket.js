import { Server } from "socket.io";
import { saveReview } from "../controller/Reviews.Controller.js";
import { CreateCommentLike } from "../controller/CommentLike.controller.js";
let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    socket.on("sendReview", async (data, callback) => {
      // console.log(data);
      
      const resultReview = await saveReview(data);
      // console.log("resultReview",resultReview);
      io.emit("newReview", resultReview);
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
