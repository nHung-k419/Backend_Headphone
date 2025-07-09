import { CommentLike } from "../models/LikeComment.model.js";
import { Reviews } from "../models/Reviews.model.js";
const CreateCommentLike = async ({UserId,CommentId}) => {
  try {
    const isLike = await CommentLike.findOne({ UserId, CommentId });
    if (!isLike) {
      const result = await CommentLike.create({ UserId, CommentId });
      return result;
      // return res.status(200).json({ result });
    }
   const deleteLike = await CommentLike.deleteOne({ UserId, CommentId });
   return deleteLike;
    // return res.status(200).json({ deleteLike });
  } catch (error) {
    // return res.status(500).json({ error: error.message });
  }
};

const getLikeComment = async (req, res) => {
  const { UserId } = req.params;
  try {
    const result = await CommentLike.find({ UserId }).populate("CommentId");
    // const coundDocument = await CommentLike.countDocuments({ UserId });
    // console.log("coundDocument", result);
    
    return res.status(200).json({ result });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export { CreateCommentLike,getLikeComment };
