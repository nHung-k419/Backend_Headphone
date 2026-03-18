import { cancleRequests } from "../models/cancel_requests .model.js";
import { Order } from "../models/Order.model.js";
import { Notification } from "../models/Notification.model.js";
import { mailRejectOrder } from "../services/RejectCancleOrder.js";
import { mailAcceptCancleOrder } from "../services/AcceptCancleOrder.js";
import { getSocket } from "../socket/socket.js";
const requestCancle = async (req, res) => {
  try {
    const { orderId, userId, reason, note } = req.body;
    const isCheckRequest = await cancleRequests.findOne({ orderId, userId });
    if (isCheckRequest) {
      return res.status(400).json({ message: "Request already exists" });
    }
    const newRequest = new cancleRequests({ orderId, userId, reason, note });
    await newRequest.save();
    return res.status(201).json({ message: "Request created successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getAllCancleRequests = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const allRequests = await cancleRequests
      .find()
      .select("_id reason status requestedAt orderId")
      .sort({ requestedAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("orderId", "_id Fullname")
      .lean();

    const totalRequests = await cancleRequests.countDocuments();
    const totalPages = Math.ceil(totalRequests / limit);

    return res.status(200).json({ 
      allRequests,
      currentPage: page,
      totalPages,
      totalRequests
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
const updateStatusCancleRequest = async (req, res) => {
  const io = getSocket();
  try {
    const { id } = req.params;
    const { status, orderId } = req.body;
    let query = {};
    if (status === "Xác nhận") {
      query.Status = "Đã hủy";
    } else {
      query.Status = "Chờ xác nhận";
    }
    const [updateRequest, updateOrder] = await Promise.all([
      cancleRequests.findOneAndUpdate({ _id: id }, { status }, { new: true }),
      Order.findOneAndUpdate({ _id: orderId }, { $set: query }, { new: true }),
    ]);

    // Gửi email bất đồng bộ, không đợi để tránh block API response (Tối ưu performance)
    if (status === "Xác nhận") {
      mailAcceptCancleOrder(
        updateOrder.Email,
        updateRequest.reason,
        updateOrder.Fullname,
        updateOrder._id,
        updateOrder.CreateAt,
        updateOrder.PaymentMethod
      ).catch(err => console.error("Lỗi gửi mail xác nhận hủy đơn:", err));
    } else {
      mailRejectOrder(
        updateOrder.Email, 
        updateOrder.Fullname, 
        updateOrder._id, 
        updateOrder.CreateAt, 
        updateOrder.Status
      ).catch(err => console.error("Lỗi gửi mail từ chối hủy đơn:", err));
    }

    const newNotification = await Notification.create({
      userId: updateOrder.Id_User,
      title: "Thông báo từ hệ thống!",
      message: `Yêu cầu hủy đơn hàng ${orderId} đã ${status === "Xác nhận" ? "được xác nhận" : "bị từ chối"}!`,
    });
    
    // Gửi Socket event về client
    io.to(updateOrder.Id_User.toString()).emit("new-notification", newNotification);

    io.to(updateOrder.Id_User.toString()).emit("order-status-updated", {
      orderId: orderId,
      status: `Đơn hàng ${orderId} đã được ${status === "Xác nhận" ? "xác nhận" : "từ chối"} yêu cầu hủy`,
    });

    return res.status(200).json({ messages: "Accept request successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
export { requestCancle, getAllCancleRequests, updateStatusCancleRequest };
