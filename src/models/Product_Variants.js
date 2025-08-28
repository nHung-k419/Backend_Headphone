import mongoose from "mongoose";

const ProductVariantsModel = new mongoose.Schema({
  Color: { type: String, required: true },
  Size: { type: String, required: true },
  Image: { type: Object, required: true },
  Price: { type: Number, required: true },
  Stock: { type: Number },
  Sold : {type : Number, default : 0},
  Id_Products: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  CreateAt: { type: Date, default: Date.now() },
});

const ProductVariants = mongoose.model("ProductVariants", ProductVariantsModel);

export { ProductVariants };
