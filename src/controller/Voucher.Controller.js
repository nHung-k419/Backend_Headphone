import { Voucher } from "../models/Voucher.model.js";
import { Order } from "../models/Order.model.js";
const CreateVoucher = async (req, res) => {
  try {
    const { code, description, discountType, discountValue, minOrderValue, maxDiscount } = req.body;
    // console.log(req.body);

    const newVoucher = new Voucher({
      code,
      description,
      discountType,
      discountValue,
      minOrderValue,
      maxDiscount,
      startDate: new Date(),
      expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    });
    // console.log(newVoucher);

    const result = await newVoucher.save();
    console.log(result);

    if (!result) {
      return res.status(400).json({ message: "Voucher not created" });
    }
    return res.status(201).json({
      message: "Voucher created successfully",
    });
  } catch (error) {}
};

const checkVoucher = async (req, res) => {
  const { code, orderTotal, idUser } = req.body;

  try {
    const isUsedVoucher = await Order.findOne({ Id_User: idUser, voucherCode: code });
    // console.log(isUsedVoucher);
    
    const voucher = await Voucher.findOne({ code });

    if (!voucher) {
      return res.status(400).json({ message: "Voucher không tồn tại" });
    }
    if (isUsedVoucher) {
      return res.status(400).json({ message: "Bạn đã sử dụng voucher này rồi!" });
    }
    if (voucher.expiryDate && new Date() > voucher.expiryDate) {
      return res.status(400).json({ message: "Voucher đã hết hạn" });
    }

    if (voucher.usageLimit <= voucher.usedCount) {
      return res.status(400).json({ message: "Voucher đã hết lượt sử dụng" });
    }

    let discount = 0;

    if (voucher.discountType === "percentage") {
      discount = Math.floor((voucher.discountValue / 100) * orderTotal); // Làm tròn để tránh số lẻ
    } else {
      discount = voucher.discountValue;
    }
    // console.log(discount);

    // Nếu bạn có giới hạn giảm tối đa
    // if (voucher.maxDiscount && discount > voucher.maxDiscount) {
    //   discount = voucher.maxDiscount;
    // }

    const discountedTotal = orderTotal - discount;
    // console.log(discountedTotal);

    return res.status(200).json({
      success: true,
      discount,
      discountedTotal,
      code: voucher.code,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

export { CreateVoucher, checkVoucher };
