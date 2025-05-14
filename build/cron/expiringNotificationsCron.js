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
exports.startExpiringNotificationsCron = startExpiringNotificationsCron;
exports.changeStatusOfExpiredAuthorizations = changeStatusOfExpiredAuthorizations;
const node_cron_1 = __importDefault(require("node-cron"));
const authorizationService_1 = __importDefault(require("../services/authorizationService"));
const notificationService_1 = __importDefault(require("../services/notificationService"));
const mailService_1 = require("../services/mailService");
function startExpiringNotificationsCron() {
    node_cron_1.default.schedule('0 9 * * *', () => __awaiter(this, void 0, void 0, function* () {
        console.log('[CRON] Checking for upcoming expirations...');
        const today = new Date();
        const in15Days = new Date(today.getTime() + 15 * 24 * 60 * 60 * 1000);
        const users = yield authorizationService_1.default.getUsersWithAuthorizations();
        for (const user of users) {
            const authorization = yield authorizationService_1.default.getLastApprovedAuthorization(user.id);
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
    }));
}
function changeStatusOfExpiredAuthorizations() {
    node_cron_1.default.schedule('0 0 * * *', () => __awaiter(this, void 0, void 0, function* () {
        console.log('[CRON] Changing status of expired authorizations...');
        const today = new Date();
        const authorizations = yield authorizationService_1.default.getAllAuthorizations();
        for (const authorization of authorizations) {
            const dueDriver = authorization.due_date_driver ? new Date(authorization.due_date_driver) : null;
            const dueVehicle = authorization.due_date_vehicle ? new Date(authorization.due_date_vehicle) : null;
            authorization.state = 4;
            if (dueDriver && dueDriver < today) {
                yield authorizationService_1.default.putAuthorization(authorization.authorization_id, authorization);
            }
            if (dueVehicle && dueVehicle < today) {
                yield authorizationService_1.default.putAuthorization(authorization.authorization_id, authorization);
            }
        }
        console.log('[CRON] Status change finished.');
    }));
}
