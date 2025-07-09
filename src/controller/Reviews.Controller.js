import { getSocket } from "../socket/socket.js";
import { Reviews } from "../models/Reviews.model.js";

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
    const result = (await Reviews.create(data)).populate("Id_User");
    return result;
  } catch (error) {
    return error;
  }
};

const getReviewsById = async (req,res) => {
  const { idProduct } = req.params;
  try {
    const result = await Reviews.find({ Id_Product: idProduct }).populate("Id_User").sort({ createdAt: -1 });
    return res.status(200).json({ result });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

export { sendImageComment, saveReview,getReviewsById };
