import mongoose from "mongoose";
const ReviewModel = new mongoose.Schema({
  Id_Product: { type: String, required: true,ref : "Product" },
  Id_User: { type: String, required: true, ref: "User" },
  Content: { type: String },
  Images: { type: Array,default : []},
  Rating: { type: Number, default: 0 },
  CreateAt: { type: Date, default: Date.now() },
},{ timestamps: true });
const Reviews = mongoose.model("Reviews", ReviewModel);
export { Reviews };