import mongoose from "mongoose";

const CommentLikeSchema = new mongoose.Schema({
  UserId: { type: String, required: true, ref: "User" },
  CommentId: { type: String, required: true, ref: "Reviews" },
  CreateAt: { type: Date, default: Date.now() },
});
CommentLikeSchema.index({UserId: 1, commentId: 1 }, { unique: true }); 
const CommentLike = mongoose.model("CommentLike", CommentLikeSchema);
export { CommentLike };
