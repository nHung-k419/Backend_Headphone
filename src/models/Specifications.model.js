import mongoose from "mongoose";

const SpecificationsSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId},
  productId: { type: mongoose.Schema.Types.ObjectId}, // Liên kết với Products
  type: { type: String}, // Loại tai nghe (Over-ear/In-ear)
  sound: { type: String}, // Âm thanh (Driver 40mm, Hi-Res,...)
  microphone: { type: String}, // Micro (Có/Không, ENC/ANC,...)
  connectivity: { type: String}, // Bluetooth 5.3, Jack 3.5mm
  battery: { type: String}, // 30h nghe nhạc, sạc nhanh 10p = 5h
  weight: { type: String}, // 250g
  features: { type: [String]}, // ["Chống ồn chủ động (ANC)", "IPX4", ...]
});
const Specification = mongoose.model("Specifications", SpecificationsSchema);

export { Specification };