import { Products } from "../models/Product.model.js";
import axios from "axios";
import { ProductVariants } from "../models/Product_Variants.js";

const buildPrompt = (question, products) => {
//  const ac = products.map((p) => p.Id_Products.Name)qư
//  console.log(products);
 
  
  const productDescriptions = products
    .map(
      (p) =>
        `Tên: ${p.Id_Products.Name}, Mô tả: ${p.Id_Products.Description},Hình ảnh: ${p.Id_Products.ImageUrl.path}, Giá: ${p.Price.toLocaleString()} VND, Đánh giá :${p.Id_Products.Rating}`
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
    const products = await ProductVariants.find().populate("Id_Products")
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
