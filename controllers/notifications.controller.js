import Notification from "../models/notifications.model.js";

export const createNotification = async (req, res) => {
  const { subject, message } = req.body;
  const userId = req.userId;

  try {
    if (!subject) {
      return res
        .status(400)
        .json({ error: false, message: "Subject Not Found" });
    }
    const notification = new Notification({ subject, message, user: userId });
    await notification.save();
    return res.status(201).json({ success: true, data: notification });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

export const getNotifications = async (_req, res) => {
  try {
    const notifications = await Notification.find().populate({
      path: "user",
      select: "firstname lastname email contact",
    });
    return res.status(200).json({ data: notifications });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

export const getNotification = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const notification = await Notification.findById(notificationId).populate({
      path: "user",
      select: "firstname lastname email contact",
    });
    if (!notification) {
      return res
        .status(404)
        .json({ success: false, message: "Notification Not Found" });
    }
    return res.status(200).send(notification);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

export const updateNotificationStatus = async (req, res) => {
  const { notificationId } = req.params;
  const { read } = req.body;
  try {
    if (!read) {
      return res
        .status(400)
        .json({ success: false, message: "Can only update status to true" });
    }
    const notification = await Notification.findByIdAndUpdate(
      notificationId,
      { is_read: read },
      { new: true, runValidators: true }
    ).populate({
      path: "user",
      select: "firstname lastname email contact",
    });
    if (!notification) {
      return res
        .status(404)
        .json({ success: false, message: "Notification Not Found" });
    }
    return res.status(200).json({ success: true, data: notification });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

export const deleteNotification = async (req, res) => {
  const { notificationId } = req.params;
  try {
    const notification = await Notification.findByIdAndDelete(notificationId);
    if (!notification) {
      return res
        .status(404)
        .json({ success: false, message: "Notification Not Found" });
    }
    return res
      .status(204)
      .json({ status: true, message: "Notification Deleted Successfully" });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};
