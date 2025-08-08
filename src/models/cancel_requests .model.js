import mongoose from "mongoose";

const cancelRequestsModel = new mongoose.Schema({
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  reason: String,
  note : String,
  status: { type: String, enum: ["Đang chờ", "Đã chấp nhận", "Đã từ chối"], default: "Đang chờ" },
  requestedAt: {type : Date, default : Date.now()},
  reviewedAt: {type : Date, default : Date.now()},
});


const cancleRequests = mongoose.model("cancelRequests", cancelRequestsModel);
export { cancleRequests }; 
