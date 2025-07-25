import mongoose from "mongoose";

const replyReviewModel = new mongoose.Schema({
    Id_Review: { type: String, required: true, ref: "Reviews" },
    Id_User: { type: String, required: true, ref: "User" },
    Content : {type : String},
    Images : {type : Object },
    CreateAt: { type: Date, default: Date.now() },
});
const ReplyReview = mongoose.model("ReplyReview", replyReviewModel);
export { ReplyReview };