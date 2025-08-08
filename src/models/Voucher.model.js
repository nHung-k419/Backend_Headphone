import mongoose from "mongoose";

const voucherSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
    },
    description: {
      type: String,
    },
    discountType: {
      type: String,
      enum: ["percentage", "fixed"], // 'percentage' = %, 'fixed' = số tiền
      required: true,
    },
    discountValue: {
      type: Number,
      required: true,
    },
    minOrderValue: {
      type: Number,
      default: 0,
    },
    maxDiscount: {
      type: Number, // áp dụng nếu discountType là % để giới hạn
    },
    totalUsageLimit: {
      type: Number, // số lần voucher này có thể được dùng tổng cộng (tùy chọn)\
      default: 0,
    },
    usedCount: {
      type: Number,
      default: 0,
    },
    startDate: {
      type: Date,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Voucher =  mongoose.model("Voucher", voucherSchema);
export { Voucher };
