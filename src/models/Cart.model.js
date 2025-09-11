import mongoose from "mongoose";

const CartModel = new mongoose.Schema({
  Id_User: { type: String, required: true },
  CreateAt: { type: Date, default: Date.now() },
});
const Cart = mongoose.model("Cart", CartModel);
CartModel.index({ Id_User: 1 }, { unique: true });

export { Cart };
