import mongoose from "mongoose";

const Category_Model = new mongoose.Schema({
  Name : {type: String, required: true, unique: true},
  Description : {type: String},
  CreateAt: { type: Date, default: Date.now() },  
})

const Categories = mongoose.model("Category", Category_Model);

export { Categories };