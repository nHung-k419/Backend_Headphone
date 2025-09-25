// models/Question.js
import mongoose from "mongoose";

const QuestionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    title: { type: String, required: true }, // Câu hỏi chính
    status: { type: String, enum: ["open", "answered", "closed"], default: "open" },
  },
  { timestamps: true }
);

export default mongoose.model("Question", QuestionSchema);
