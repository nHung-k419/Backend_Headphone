import { cancleRequests } from "../models/cancel_requests .model.js";
import { Order } from "../models/Order.model.js";
import { mailRejectOrder } from "../services/RejectCancleOrder.js";
import { mailAcceptCancleOrder } from "../services/AcceptCancleOrder.js";
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
    const allRequests = await cancleRequests.find().sort({ requestedAt: -1 }).populate("orderId");
    return res.status(200).json({ allRequests });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
const updateStatusCancleRequest = async (req, res) => {
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
    if (status === "Xác nhận") {
      console.log(123);
      await mailAcceptCancleOrder(
        updateOrder.Email,
        updateRequest.reason,
        updateOrder.Fullname,
        updateOrder._id,
        updateOrder.CreateAt,
        updateOrder.PaymentMethod
      );
    } else {
      await mailRejectOrder(updateOrder.Email, updateOrder.Fullname, updateOrder._id, updateOrder.CreateAt, updateOrder.Status);
    }
    // console.log(updateRequest, updateOrder);
    return res.status(200).json({ messages: "Accept request successfully" });
    // const updateRequestnew = await cancleRequests.findOneAndUpdate({ _id: id }, { status }, { new: true });
    // return res.status(200).json({ messages: "Reject request successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
export { requestCancle, getAllCancleRequests, updateStatusCancleRequest };
