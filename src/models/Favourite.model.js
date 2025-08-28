import mongoose from "mongoose";
const FavouriteSchema = new mongoose.Schema({
    Id_User: { type: String, required: true },
    Id_Product: { type: String, required: true },
    CreateAt: { type: Date, default: Date.now() },
})
const Favourite = mongoose.model("Favourite", FavouriteSchema);
export { Favourite };