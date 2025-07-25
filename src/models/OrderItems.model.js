import mongoose from "mongoose";
const OrderItemsSchema = new mongoose.Schema({
  Id_Order: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Order" },
  Id_ProductVariants: { type: String, required: true, ref: "ProductVariants" },
  Name: { type: String },
  Image: { type: String },
  Size: { type: String },
  Color: { type: String },
  Price : { type: Number },
  Quantity: { type: Number },
  CreateAt: { type: Date, default: Date.now() },
});
const OrderItems = mongoose.model("OrderItems", OrderItemsSchema);
export { OrderItems };
