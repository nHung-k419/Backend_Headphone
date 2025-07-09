import mongoose from "mongoose";
const OrderSchemma = new mongoose.Schema({
  Id_User: { type: String, required: true, ref: "User" },
  Id_Cart: { type: String, required: true, ref: "Cart" },
  Fullname: { type: String },
  Sex: { type: String },
  Phone: { type: String },
  CCCD: { type: String },
  TotalAmount: { type: Number },
  PaymentMethod: { type: String, default: "COD" },
  Address: { type: String },
  Status: { type: String, default: "Chờ xác nhận" },
  CreateAt: { type: Date, default: Date.now() },
});
const Order = mongoose.model("Order", OrderSchemma);
export { Order };
