import cron from 'node-cron';
import authorizationService from '../services/authorizationService';
import notificationService from '../services/notificationService';
import { sendExpiringMail } from '../services/mailService';

export function startExpiringNotificationsCron() {
    cron.schedule('0 9 * * *', async () => {
        console.log('[CRON] Checking for upcoming expirations...');

        const today = new Date();
        const in15Days = new Date(today.getTime() + 15 * 24 * 60 * 60 * 1000);

        const users = await authorizationService.getUsersWithAuthorizations();

        for (const user of users) {
            const authorization = await authorizationService.getLastApprovedAuthorization(user.id);
            if (!authorization) continue;

            const dueDriver = authorization.due_date_driver ? new Date(authorization.due_date_driver) : null;
            const dueVehicle = authorization.due_date_vehicle ? new Date(authorization.due_date_vehicle) : null;

            const isExpiringSoon =
                (dueDriver && dueDriver >= today && dueDriver <= in15Days) ||
                (dueVehicle && dueVehicle >= today && dueVehicle <= in15Days);

            if (isExpiringSoon) {
                notificationService.postNotification({
                                                        notification_id: 0, 
                                                        title: "Habilitación próxima a vencer",
                                                        detail: `Recordá que la última habilitación generada está próxima a vencerse. Por favor, ingresá a la sección de habilitaciones y generá una nueva.`,
                                                        user: user,
                                                        is_read: false,
                                                        created_at: new Date().toISOString(),
                                                        updated_at: new Date().toISOString()
                                                    });
                sendExpiringMail(user.full_name, user.email);
            }
        }

        console.log('[CRON] Expiration check finished.');
    });
}

export function changeStatusOfExpiredAuthorizations() {
    cron.schedule('0 0 * * *', async () => {
        console.log('[CRON] Changing status of expired authorizations...');

        const today = new Date();

        const authorizations = await authorizationService.getAllAuthorizations();
        for (const authorization of authorizations) {
            const dueDriver = authorization.due_date_driver ? new Date(authorization.due_date_driver) : null;
            const dueVehicle = authorization.due_date_vehicle ? new Date(authorization.due_date_vehicle) : null;
            authorization.state = 4;

            if (dueDriver && dueDriver < today) {
                await authorizationService.putAuthorization(authorization.authorization_id, authorization);
            }
            if (dueVehicle && dueVehicle < today) {
                await authorizationService.putAuthorization(authorization.authorization_id, authorization);
            }
        }

        console.log('[CRON] Status change finished.');
    });
}