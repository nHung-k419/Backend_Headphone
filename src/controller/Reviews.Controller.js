import { getSocket } from "../socket/socket.js";
import { Reviews } from "../models/Reviews.model.js";
import { Products } from "../models/Product.model.js";
import mongoose from "mongoose";
const ObjectId = mongoose.Types.ObjectId;
const sendImageComment = (req, res) => {
  const Images = req.files;
  // console.log("Files:", req.files);
  try {
    const result = Images.map((image) => {
      return {
        filename: image.filename,
        url: image.path,
      };
    });
    return res.status(200).json({ result: result });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const saveReview = async (data) => {
  try {
    const result = await Reviews.create(data);
    const ReviewsProduct = await Reviews.aggregate([
      { $match: { Id_Product: result.Id_Product } },
      {
        $group: {
          _id: "$Id_Product",
          averageRating: { $avg: "$Rating" },
          totalReviews: { $sum: 1 },
        },
      },
    ]);
    await Products.updateOne({ _id: ReviewsProduct[0]._id }, { $set: { Rating: ReviewsProduct[0].averageRating } });
    return result;
  } catch (error) {
    return error;
  }
};

const getReviewsById = async (req, res) => {
  const { idProduct } = req.params;
  try {
    const result = await Reviews.find({ Id_Product: idProduct }).populate("Id_User").sort({ createdAt: -1 });
    const Product = await Products.findOne({ _id: idProduct });
    return res.status(200).json({ result,Product });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export { sendImageComment, saveReview, getReviewsById };
