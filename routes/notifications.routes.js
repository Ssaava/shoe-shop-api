import { Router } from "express";
import {
  createNotification,
  getNotifications,
  getNotification,
  updateNotificationStatus,
  deleteNotification,
} from "../controllers/notifications.controller.js";
import {
  checkAdminUser,
  checkAuthentication,
} from "../middlewares/auth.middleware.js";
const notificationsRouter = new Router();

notificationsRouter.post(
  "/notifications/create",
  checkAuthentication,
  createNotification
);
notificationsRouter.get("/notifications/all", checkAdminUser, getNotifications);
notificationsRouter.get(
  "/notifications/:notificationId/notification",
  checkAdminUser,
  getNotification
);
notificationsRouter.patch(
  "/notifications/:notificationId/notification",
  checkAdminUser,
  updateNotificationStatus
);
notificationsRouter.delete(
  "/notifications/:notificationId/notification",
  checkAdminUser,
  deleteNotification
);

export default notificationsRouter;
