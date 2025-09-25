import { Voucher } from "../models/Voucher.model.js";
import { Order } from "../models/Order.model.js";
const CreateVoucher = async (req, res) => {
  try {
    const { code, description, discountType,title, discountValue, minOrderValue, maxDiscount, totalUsageLimit, startDate, expiresAt } = req.body;
    const isExitsVoucher = await Voucher.findOne({ code });
    if (isExitsVoucher) {
      return res.status(400).json({ message: "Voucher đã tồn tại!" });
    }
    const newVoucher = new Voucher({
      code,
      description,
      discountType,
      title,
      discountValue,
      minOrderValue,
      maxDiscount,
      totalUsageLimit,
      startDate,
      expiresAt,
    });
    // console.log(newVoucher);

    const result = await newVoucher.save();
    if (!result) {
      return res.status(400).json({ message: "Lỗi khi tạo voucher!" });
    }
    return res.status(201).json({
      message: "Tạo voucher thành công!",
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const checkVoucher = async (req, res) => {
  const { code, orderTotal, idUser } = req.body;

  try {
    const isUsedVoucher = await Order.findOne({ Id_User: idUser, voucherCode: code });
    console.log(isUsedVoucher);

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

const getAllVouchers = async (req, res) => {
  try {
    const vouchers = await Voucher.find();
    res.status(200).json(vouchers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export { CreateVoucher, checkVoucher,getAllVouchers };
