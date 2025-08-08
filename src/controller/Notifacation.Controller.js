import { Notification } from "../models/Notification.model.js";

const getNotificationById = async (req, res) => {
  const { id } = req.params;
  //   console.log(id);
  try {
    const result = await Notification.find({ userId: id }).sort({ createdAt: -1 });
    return res.status(200).json({ result });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const noti = await Notification.updateMany({ userId: id, isRead: false }, { isRead: true });
    if (!noti) return res.status(404).json({ message: "Noti not found" });
    res.status(200).json(noti);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export { getNotificationById, markAsRead };
