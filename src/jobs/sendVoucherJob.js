import nodeCron from "node-cron";
import { Users } from "../models/User.model.js";
import { Voucher } from "../models/Voucher.model.js";
import { Notification } from "../models/Notification.model.js";
import { getSocket } from "../socket/socket.js";

// Lấy voucher hợp lệ
const getActiveVouchers = async (now) => {
  return await Voucher.find({
    status: "Hoạt động",
    isActive: true,
    startDate: { $lte: now },
    expiresAt: { $gte: now },
  });
};

// Lấy user chưa nhận voucher
const getUsersWithoutVoucher = async (voucherCode) => {
  return await Users.find({
    VoucherSent: { $nin: [voucherCode] },
  }).select("_id");
};

// Update user đã nhận voucher
const updateUsersVoucher = async (userIds, voucherCode) => {
  await Users.updateMany(
    { _id: { $in: userIds } },
    { $addToSet: { VoucherSent: voucherCode } }
  );
};

// Tạo notification
const createNotifications = async (userIds, voucher) => {
  const notifications = userIds.map((id) => ({
    userId: id,
    title: voucher.title || "🎁 Ưu đãi mới!",
    message: `🎉 ${voucher.description} Nhập mã ${voucher.code} để hưởng ưu đãi!`,
    type: "voucher",
  }));

  return await Notification.insertMany(notifications);
};

// Gửi realtime socket
const emitNotifications = (io, notifications) => {
  notifications.forEach((noti) => {
    io.to(noti.userId.toString()).emit("new-notification", noti);
  });
};

// Check voucher hết hạn 
const checkIsExpiredVoucher = async () => {
  const now = new Date();

  const result = await Voucher.updateMany(
    { expiresAt: { $lt: now }, status: { $ne: "Hết hạn" } },
    { $set: { status: "Hết hạn" } }
  );
  // console.log('result', result);

  if (result.modifiedCount > 0) {
    console.log(`Đã cập nhật ${result.modifiedCount} voucher hết hạn`);
  }

  return result;
};

// xử lý gửi voucher cho user
const processVoucher = async (voucher, io) => {
  const users = await getUsersWithoutVoucher(voucher.code);

  if (!users.length) return;

  console.log(`Voucher ${voucher.code} gửi cho ${users.length} user`);

  const userIds = users.map((u) => u._id);

  await updateUsersVoucher(userIds, voucher.code);

  const insertedNotifications = await createNotifications(userIds, voucher);

  emitNotifications(io, insertedNotifications);
};

nodeCron.schedule("*/10 * * * *", async () => {
  const io = getSocket();

  if (!io) {
    console.log("Socket chưa init");
    return;
  }

  try {
    const now = new Date();

    console.log("Socket đã init");
    console.log("Cron chạy lúc:", now);
    await checkIsExpiredVoucher();
    const vouchers = await getActiveVouchers(now);

    if (!vouchers.length) return;

    for (const voucher of vouchers) {
      await processVoucher(voucher, io);
    }

  } catch (error) {
    console.error("Cron notification error:", error);
  }
});