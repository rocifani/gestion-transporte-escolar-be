"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("../database/db"));
const notification_1 = require("../models/notification");
const typeorm_1 = require("typeorm");
class NotificationService {
    getAllNotifications() {
        return __awaiter(this, void 0, void 0, function* () {
            const notificationRepository = db_1.default.getRepository(notification_1.Notification);
            return yield notificationRepository.find({ where: { deleted_at: (0, typeorm_1.IsNull)() } });
        });
    }
    getNotificationByUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const notificationRepository = db_1.default.getRepository(notification_1.Notification);
            return yield notificationRepository.createQueryBuilder("notification")
                .where("notification.user_id = :user_id", { user_id: id })
                .andWhere("notification.deleted_at IS NULL")
                .getMany();
        });
    }
    getNotificationById(notification_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const notificationRepository = db_1.default.getRepository(notification_1.Notification);
            const notification = yield notificationRepository.findOne({ where: { notification_id, deleted_at: (0, typeorm_1.IsNull)() } });
            return notification !== null && notification !== void 0 ? notification : undefined;
        });
    }
    postNotification(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const notificationRepository = db_1.default.getRepository(notification_1.Notification);
            const result = yield notificationRepository.save(data);
            return result ? result : undefined;
        });
    }
    deleteNotification(notification_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const notificationRepository = db_1.default.getRepository(notification_1.Notification);
            const notification = yield notificationRepository.findOne({ where: { notification_id, deleted_at: (0, typeorm_1.IsNull)() } });
            if (notification) {
                notification.deleted_at = new Date().toString();
                yield notificationRepository.save(notification);
                return true;
            }
            return false;
        });
    }
    markNotificationAsRead(notification_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const notificationRepository = db_1.default.getRepository(notification_1.Notification);
            const notification = yield notificationRepository.findOne({ where: { notification_id, deleted_at: (0, typeorm_1.IsNull)() } });
            if (notification) {
                notification.is_read = true;
                yield notificationRepository.save(notification);
                return true;
            }
            return false;
        });
    }
}
exports.default = new NotificationService();
