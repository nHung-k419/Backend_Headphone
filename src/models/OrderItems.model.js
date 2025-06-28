import mongoose from "mongoose";
const OrderItemsSchema = new mongoose.Schema({
  Id_Order: { type: String, required: true, ref: "Order" },
  Id_Product: { type: String, required: true, ref: "Product" },
  Name: { type: String },
  Image: { type: String },
  Size: { type: String },
  Color: { type: String },
  Quantity: { type: Number },
  CreateAt: { type: Date, default: Date.now() },
});
const OrderItems = mongoose.model("OrderItems", OrderItemsSchema);
export { OrderItems };
