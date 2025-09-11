import mongoose from "mongoose";
const CartItems_Model = new mongoose.Schema({
    Id_Cart : {type : String, required : true},
    Id_ProductVariants : {type: mongoose.Schema.Types.ObjectId, required : true, ref : "ProductVariants"},
    Size : {type : String,default : "default"},
    Color : {type : String, default : "default"},
    Price : {type : Number, required : true, default : 0},
    Image : {type : String,},
    Quantity : {type : Number, default : 1},
    CreateAt: { type: Date, default: Date.now() },
})
CartItems_Model.index({ Id_Cart: 1, Id_ProductVariants: 1 }, { unique: true });
const CartItems = mongoose.model("CartItems", CartItems_Model);

export { CartItems }; 