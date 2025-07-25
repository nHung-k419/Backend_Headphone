import { Products } from "../models/Product.model.js";
import axios from "axios";

const buildPrompt = (question, products) => {
  const productDescriptions = products
    .map(
      (p) =>
        `Tên: ${p.Name}, Mô tả: ${p.Description},Hình ảnh: ${p.ImageUrl.path}, Giá: ${p.Price.toLocaleString()} VND`
    )
    .join("\n");

  return `
Người dùng hỏi: "${question}"
Dưới đây là danh sách sản phẩm phù hợp hiện có:
${productDescriptions}

Dựa vào các câu hỏi hãy trả lời thật chính xác cho người dùng.
`;
};
// sản phẩm trên, hãy gợi ý sản phẩm tốt nhất và giải thích lý do

const handleChat = async (req, res) => {
  const { question } = req.body;
  if (!question) return res.status(400).json({ error: "Câu hỏi trống!" });

  try {
    const products = await Products.find().limit(8);
    const prompt = buildPrompt(question, products);

    const geminiRes = await axios.post(
      "https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent",
      {
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }],
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": process.env.GEMINI_API_KEY, // ✅ đúng chuẩn GCP
        },
      }
    );

    const aiReply = geminiRes.data?.candidates?.[0]?.content?.parts?.[0]?.text;
   return res.json({ answer: aiReply || "Không có phản hồi từ AI" });
  } catch (error) {
    console.error("Lỗi chat:", error.response?.data || error.message);
    res.status(500).json({
      error: "Lỗi hệ thống hoặc API Gemini",
      detail: error.response?.data || error.message,
    });
  }
};

export { handleChat };
