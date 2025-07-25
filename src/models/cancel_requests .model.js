import mongoose from "mongoose";

const cancelRequestsModel = new mongoose.Schema({
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  reason: String,
  status: { type: String, enum: ["Đang chờ", "Đã chấp nhận", "Đã từ chối"], default: "Đang chờ" },
  requestedAt: Date,
  reviewedAt: Date,
});

const cancleRequests = mongoose.model("cancelRequests", cancelRequestsModel);
export { cancleRequests };