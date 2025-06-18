import mongoose from "mongoose";

const ProductVariantsModel = new mongoose.Schema({
  Color: { type: String, required: true },
  Size: { type: String, required: true },
  Image: { type: Object, required: true },
  Stock: { type: Number },
  Id_Products: { type: String },
  CreateAt: { type: Date, default: Date.now() },
});

const ProductVariants = mongoose.model("ProductVariants", ProductVariantsModel);

export { ProductVariants };
