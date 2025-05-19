"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("../database/db"));
const notification_1 = require("../models/notification");
const typeorm_1 = require("typeorm");
class NotificationService {
    async getAllNotifications() {
        const notificationRepository = db_1.default.getRepository(notification_1.Notification);
        return await notificationRepository.find({ where: { deleted_at: (0, typeorm_1.IsNull)() } });
    }
    async getNotificationByUser(id) {
        const notificationRepository = db_1.default.getRepository(notification_1.Notification);
        return await notificationRepository.createQueryBuilder("notification")
            .where("notification.user_id = :user_id", { user_id: id })
            .andWhere("notification.deleted_at IS NULL")
            .getMany();
    }
    async getNotificationById(notification_id) {
        const notificationRepository = db_1.default.getRepository(notification_1.Notification);
        const notification = await notificationRepository.findOne({ where: { notification_id, deleted_at: (0, typeorm_1.IsNull)() } });
        return notification ?? undefined;
    }
    async postNotification(data) {
        const notificationRepository = db_1.default.getRepository(notification_1.Notification);
        const result = await notificationRepository.save(data);
        return result ? result : undefined;
    }
    async deleteNotification(notification_id) {
        const notificationRepository = db_1.default.getRepository(notification_1.Notification);
        const notification = await notificationRepository.findOne({ where: { notification_id, deleted_at: (0, typeorm_1.IsNull)() } });
        if (notification) {
            notification.deleted_at = new Date().toString();
            await notificationRepository.save(notification);
            return true;
        }
        return false;
    }
    async markNotificationAsRead(notification_id) {
        const notificationRepository = db_1.default.getRepository(notification_1.Notification);
        const notification = await notificationRepository.findOne({ where: { notification_id, deleted_at: (0, typeorm_1.IsNull)() } });
        if (notification) {
            notification.is_read = true;
            await notificationRepository.save(notification);
            return true;
        }
        return false;
    }
}
exports.default = new NotificationService();
