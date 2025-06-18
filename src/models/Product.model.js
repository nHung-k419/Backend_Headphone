import mongoose from "mongoose";

const Product_Model = new mongoose.Schema({
  Name: { type: String, required: true },
  Price: { type: Number, required: true },
  ImageUrl: { type: Object, required: true },
  Description: { type: String, required: true },
  Brand: { type: String, required: true },
  DiscountPrice: { type: Number, default: 0 },
  StockQuantity: { type: Number, default: 0 },
  Rating: { type: Number, default: 0 },
  Id_Category: { type: String, required: true },
  // Id_Products_variants : {type : Array, default : []},
  isDelete : {type : Boolean, default : false},
  CreateAt: { type: Date, default: Date.now() },
});
const Products = mongoose.model("Product", Product_Model);

export { Products };
