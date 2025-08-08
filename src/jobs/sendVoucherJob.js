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
    VoucherSent: { $ne: true },
  });

  if (users.length === 0) return console.log("⏳ No users to send voucher");

  const voucher = await Voucher.findOne({ code: "NEWUSER50" });

  if (!voucher) return console.log("⚠️ Voucher not found!");

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

    user.VoucherSent = true;
    await user.save();
  }

  console.log(`✅ Sent voucher to ${users.length} users`);
});
