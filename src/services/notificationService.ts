import db from "../database/db";
import { Notification } from "../models/notification";
import { IsNull } from "typeorm";

class NotificationService {

    async getAllNotifications(): Promise<Notification[]> {
        const notificationRepository = db.getRepository(Notification);  
        return await notificationRepository.find({ where: { deleted_at: IsNull() } });  
    } 

    async getNotificationByUser(id: number): Promise<Notification[]> {
        const notificationRepository = db.getRepository(Notification); 
        return await notificationRepository.createQueryBuilder("notification")
            .where("notification.user_id = :user_id", { user_id: id })
            .andWhere("notification.deleted_at IS NULL")
            .getMany();  
    }

    async getNotificationById(notification_id: number): Promise<Notification | undefined> {
        const notificationRepository = db.getRepository(Notification);
        const notification = await notificationRepository.findOne({ where: { notification_id, deleted_at: IsNull() } });  
        return notification ?? undefined;
    }

    async postNotification(data: Notification): Promise<Notification | undefined> {
        const notificationRepository = db.getRepository(Notification);  
        const result = await notificationRepository.save(data);  

        return result ? result : undefined; 
    }


    async deleteNotification(notification_id: number): Promise<boolean> {
        const notificationRepository = db.getRepository(Notification);
        const notification = await notificationRepository.findOne({ where: { notification_id, deleted_at: IsNull() } });

        if (notification) {
            notification.deleted_at = new Date().toString();
            await notificationRepository.save(notification);
            return true;
        }
        return false;
    }

    async markNotificationAsRead(notification_id: number): Promise<boolean> {
        const notificationRepository = db.getRepository(Notification);
        const notification = await notificationRepository.findOne({ where: { notification_id, deleted_at: IsNull() } });

        if (notification) {
            notification.is_read = true;
            await notificationRepository.save(notification);
            return true;
        }
        return false;
    }
}

export default new NotificationService();
