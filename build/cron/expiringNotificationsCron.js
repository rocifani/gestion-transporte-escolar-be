"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startExpiringNotificationsCron = startExpiringNotificationsCron;
exports.changeStatusOfExpiredAuthorizations = changeStatusOfExpiredAuthorizations;
const node_cron_1 = __importDefault(require("node-cron"));
const authorizationService_1 = __importDefault(require("../services/authorizationService"));
const notificationService_1 = __importDefault(require("../services/notificationService"));
const mailService_1 = require("../services/mailService");
function startExpiringNotificationsCron() {
    node_cron_1.default.schedule('0 9 * * *', async () => {
        console.log('[CRON] Checking for upcoming expirations...');
        const today = new Date();
        const in15Days = new Date(today.getTime() + 15 * 24 * 60 * 60 * 1000);
        const users = await authorizationService_1.default.getUsersWithAuthorizations();
        for (const user of users) {
            const authorization = await authorizationService_1.default.getLastApprovedAuthorization(user.id);
            if (!authorization)
                continue;
            const dueDriver = authorization.due_date_driver ? new Date(authorization.due_date_driver) : null;
            const dueVehicle = authorization.due_date_vehicle ? new Date(authorization.due_date_vehicle) : null;
            const isExpiringSoon = (dueDriver && dueDriver >= today && dueDriver <= in15Days) ||
                (dueVehicle && dueVehicle >= today && dueVehicle <= in15Days);
            if (isExpiringSoon) {
                notificationService_1.default.postNotification({
                    notification_id: 0,
                    title: "Habilitación próxima a vencer",
                    detail: `Recordá que la última habilitación generada está próxima a vencerse. Por favor, ingresá a la sección de habilitaciones y generá una nueva.`,
                    user: user,
                    is_read: false,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                });
                (0, mailService_1.sendExpiringMail)(user.full_name, user.email);
            }
        }
        console.log('[CRON] Expiration check finished.');
    });
}
function changeStatusOfExpiredAuthorizations() {
    node_cron_1.default.schedule('0 0 * * *', async () => {
        console.log('[CRON] Changing status of expired authorizations...');
        const today = new Date();
        const authorizations = await authorizationService_1.default.getAllAuthorizations();
        for (const authorization of authorizations) {
            const dueDriver = authorization.due_date_driver ? new Date(authorization.due_date_driver) : null;
            const dueVehicle = authorization.due_date_vehicle ? new Date(authorization.due_date_vehicle) : null;
            authorization.state = 4;
            if (dueDriver && dueDriver < today) {
                await authorizationService_1.default.putAuthorization(authorization.authorization_id, authorization);
            }
            if (dueVehicle && dueVehicle < today) {
                await authorizationService_1.default.putAuthorization(authorization.authorization_id, authorization);
            }
        }
        console.log('[CRON] Status change finished.');
    });
}
