// controllers/qaController.js
import QuestionModel from "../models/Question.model.js";
import MessageQuestionModel from "../models/MessageQuestion.model.js";

// 1. User tạo câu hỏi
export const createQuestion = async (req, res) => {
  try {
    const question = new QuestionModel({
      userId: req.body.userId,
      productId: req.body.productId,
      title: req.body.title,
    });
    await question.save();

    res.status(201).json({ success: true, data: question });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// 2. Thêm tin nhắn (Admin hoặc User trả lời)
export const addMessage = async (req, res) => {
  try {
    const message = new MessageQuestionModel({
      questionId: req.body.questionId,
      senderId: req.body.senderId,
      role: req.body.role,
      content: req.body.content,
      parentId: req.body.parentId || null,
    });
    await message.save();

    res.status(201).json({ success: true, data: message });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// 3. Lấy thread hội thoại (bao gồm reply nhiều lớp)
export const getConversation = async (req, res) => {
  try {
    const { questionId } = req.params;

    const messages = await MessageQuestionModel.find({ questionId })
      .populate("senderId", "Name Image.path")
      .populate({
        path: "parentId",
        populate: {
          path: "senderId",
          select: "Name Image.path",
        },
      })
      .lean();

    // Hàm dựng cây
    const buildTree = (parentId) =>
      messages
        .filter((m) => (parentId ? String(m.parentId?._id || m.parentId) === String(parentId) : !m.parentId))
        .map((m) => ({
          ...m,
          replyToName: m.parentId?.senderId?.Name || null,
          replies: buildTree(m._id),
        }));

    // ✅ Bắt đầu từ các tin nhắn gốc (parentId = null)
    const tree = buildTree(null);

    res.json({ success: true, data: tree });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const GetAllConversation = async (req, res) => {
  try {
    const { productId } = req.params;
    const questions = await QuestionModel.find({productId}).populate("userId", "Name Image").sort({ createdAt: -1 }).lean();
    res.json({ success: true, data: questions });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
// export const getQuestions = async (req, res) => {
//   try {
//     // Lấy toàn bộ messages
//     const messages = await MessageQuestionModel.find()
//       .populate("senderId", "Name Image.path")
//       .lean();

//     // Gom nhóm theo questionId
//     const conversations = {};

//     // Hàm dựng cây cho từng questionId
//     const buildTree = (msgs, parentId = null) =>
//       msgs
//         .filter((m) => String(m.parentId) === String(parentId))
//         .map((m) => ({
//           ...m,
//           replies: buildTree(msgs, m._id),
//         }));

//     messages.forEach((msg) => {
//       const qId = String(msg.questionId);
//       if (!conversations[qId]) {
//         conversations[qId] = [];
//       }
//     });

//     // Với mỗi questionId → build tree riêng
//     Object.keys(conversations).forEach((qId) => {
//       conversations[qId] = buildTree(
//         messages.filter((m) => String(m.questionId) === qId),
//         qId
//       );
//     });

//     res.json({ success: true, data: conversations });
//   } catch (err) {
//     res.status(500).json({ success: false, error: err.message });
//   }
// };
