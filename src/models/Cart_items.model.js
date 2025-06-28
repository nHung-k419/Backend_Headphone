import mongoose from "mongoose";
const CartItems_Model = new mongoose.Schema({
    Id_Cart : {type : String, required : true},
    Id_Product : {type : String, required : true, ref : "Product"},
    Size : {type : String,default : "default"},
    Color : {type : String, default : "default"},
    Image : {type : String,},
    Quantity : {type : Number, default : 1},
    CreateAt: { type: Date, default: Date.now() },
})
const CartItems = mongoose.model("CartItems", CartItems_Model);

export { CartItems }; 