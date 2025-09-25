import nodeCron from "node-cron";
import { Users } from "../models/User.model.js";
import { Voucher } from "../models/Voucher.model.js";
import { Notification } from "../models/Notification.model.js";

nodeCron.schedule("* * * * *", async () => {
  const now = new Date();
  console.log("⏰ Cron chạy lúc:", now);

  const vouchers = await Voucher.find({
    status: "Hoạt động",
    isActive: true,
    startDate: { $lte: now },
    expiresAt: { $gte: now },
  });

  console.log("Voucher tìm được:", vouchers.length);

  for (const voucher of vouchers) {
    // lấy user chưa có voucher này
    const users = await Users.find({
      VoucherSent: { $nin: [voucher.code] },
    });

    console.log(`Voucher ${voucher.code} gửi cho ${users.length} user`);

    for (const user of users) {
      // cập nhật voucher vào user
      await Users.findByIdAndUpdate(user._id, {
        $addToSet: { VoucherSent: voucher.code },
      });

      // tạo nội dung dựa trên voucher
      const message = `🎉 ${voucher.description} Nhập mã *${voucher.code}* để hưởng ưu đãi đặc biệt!`;
      console.log("Thông báo:", message);

      // gửi thông báo
      await Notification.create({
        userId: user._id,
        title: voucher.title || "🎁 Ưu đãi mới!",
        message,
        type: "voucher",
      });
    }
  }
});
