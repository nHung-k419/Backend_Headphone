import mongoose from "mongoose";

const Brand_Model = new mongoose.Schema({
  Brand : {type: String, required: true, unique: true},
  Description : {type: String},
  CreateAt: { type: Date, default: Date.now() },  
})

const Brands = mongoose.model("Brand", Brand_Model);

export { Brands };