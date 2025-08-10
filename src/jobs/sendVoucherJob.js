import nodeCron from "node-cron";
import { Users } from "../models/User.model.js";
import { Voucher } from "../models/Voucher.model.js";
import { Notification } from "../models/Notification.model.js";
// const { sendEmail } = require("../utils/sendEmail");

nodeCron.schedule("* * * * *", async () => {
  console.log("🎯 Running voucher check job...");

  const threeDaysAgo = new Date();
  threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

  const now = new Date();

  const users = await Users.find({
    CreateAt: {
      $gte: threeDaysAgo, // lớn hơn hoặc bằng 3 ngày trước
      $lte: now, // nhỏ hơn hoặc bằng thời điểm hiện tại
    },
    VoucherSent: { $ne: "NEWUSER50" },
  });

  if (users.length === 0) return console.log("⏳ No users to send voucher");

  const voucher = await Voucher.findOne({ code: "NEWUSER50" });

  if (!voucher) return console.log("⚠️ Voucher not found!");
  if (users && users.length > 0) {
    for (const user of users) {
      await Notification.create({
        userId: user._id,
        title: "🎁 Ưu đãi chào mừng khách hàng!",
        message: `Nhập mã ${voucher.code} để được giảm giá đơn hàng đầu tiên.`,
        type: "voucher",
        createdAt: new Date(),
      });

      // await sendEmail({
      //   to: user.email,
      //   subject: "🎁 Nhận mã giảm giá độc quyền cho bạn!",
      //   html: `<p>Chào mừng bạn đến với hệ thống của chúng tôi. Mã <b>${voucher.code}</b> sẽ giúp bạn tiết kiệm trong đơn hàng đầu tiên!</p>`,
      // });

      user.VoucherSent.push(voucher.code);
      await user.save();
    }
    console.log(`✅ Sent voucher to ${users.length} users`);
  }
  // VOUCHER SỰ KIỆN 2/9/2025
  const eventStart = new Date("2025-08-09T00:00:00");
  const eventEnd = new Date("2025-09-02T23:59:59");
  if (now >= eventStart && now <= eventEnd) {
    const eventVoucher = await Voucher.findOne({ code: "QUOCKHANH29" });

    if (eventVoucher) {
      const eventUsers = await Users.find({
        VoucherSent: { $ne: "QUOCKHANH29" },
      });

      for (const user of eventUsers) {
        await Notification.create({
          userId: user._id,
          title: "🔥 Khuyến mãi Mừng Quốc Khánh 2/9!",
          message: `Nhân dịp đại lễ Quốc Khánh 2-9 Soundora dành tăng quý khách gói voucher giảm giá 30% cho 1 đơn hàng bất kỳ. Nhập mã ${eventVoucher.code} để hưởng ưu đãi đặc biệt.`,
          type: "voucher",
          createdAt: now,
        });

        user.VoucherSent.push(eventVoucher.code);
        await user.save();
      }
      console.log(`✅ Sent QUOCKHANH29 to ${eventUsers.length} users`);
    }
  }
});
