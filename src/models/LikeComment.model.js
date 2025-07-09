import mongoose from "mongoose";

const CommentLikeSchema = new mongoose.Schema({
  UserId: { type: String, required: true, ref: "User" },
  CommentId: { type: String, required: true, ref: "Reviews" },
  CreateAt: { type: Date, default: Date.now() },
});
// CommentLikeSchema.index({commentId: 1 }, { unique: true }); // 1 user chỉ được like 1 lần
const CommentLike = mongoose.model("CommentLike", CommentLikeSchema);
export { CommentLike };
