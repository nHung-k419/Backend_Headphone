
// models/Message.js
import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema(
  {
    questionId: { type: mongoose.Schema.Types.ObjectId, ref: "Question", required: true },
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    role: { type: String, enum: ["user", "admin"], required: true },
    content: { type: String, required: true },
    parentId: { type: mongoose.Schema.Types.ObjectId, ref: "MessageQuestion", default: null },
  },
  { timestamps: true }
);

export default mongoose.model("MessageQuestion", MessageSchema);
