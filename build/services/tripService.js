"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("../database/db"));
const trip_1 = require("../models/trip");
const authorization_1 = require("../models/authorization");
const notificationService_1 = __importDefault(require("./notificationService"));
class TripService {
    async getAllTrips() {
        const tripRepository = db_1.default.getRepository(trip_1.Trip);
        return await tripRepository.find();
    }
    async getTripByUser(id) {
        const tripRepository = db_1.default.getRepository(trip_1.Trip);
        return await tripRepository.createQueryBuilder("trip")
            .innerJoin("trip.trip_child", "trip_child")
            .leftJoinAndSelect("trip.authorization", "authorization")
            .leftJoinAndSelect("authorization.user", "user")
            .where("user.id = :user_id", { user_id: id })
            .groupBy("trip.trip_id")
            .select([
            "trip.trip_id AS trip_id",
            "trip.date AS date",
            "trip.status AS status",
            "authorization",
            "COUNT(DISTINCT trip_child.trip_child_id) AS childrenCount"
        ])
            .getRawMany();
    }
    async getTripById(trip_id) {
        const tripRepository = db_1.default.getRepository(trip_1.Trip);
        const trip = await tripRepository.findOne({ where: { trip_id } });
        return trip ?? undefined;
    }
    async postTrip(data) {
        const tripRepository = db_1.default.getRepository(trip_1.Trip);
        const result = await tripRepository.save(data);
        return result ? result : undefined;
    }
    async postTripByUserEmail(authorization_id) {
        const authorizationRepository = db_1.default.getRepository(authorization_1.Authorization);
        const authorization = await authorizationRepository.findOne({ where: { authorization_id } });
        const trip = new trip_1.Trip();
        trip.status = "pending";
        trip.authorization = authorization;
        const tripRepository = db_1.default.getRepository(trip_1.Trip);
        const result = await tripRepository.save(trip);
        return result ? result : undefined;
    }
    async putTripByAuthorizationAndShift(authorization, child_shift, selected_date, price) {
        const tripRepository = db_1.default.getRepository(trip_1.Trip);
        const trip = await tripRepository.findOne({
            where: {
                authorization: {
                    authorization_id: authorization,
                    work_shift: child_shift,
                },
                date: selected_date,
            },
            relations: ['authorization'],
        });
        if (trip) {
            trip.available_capacity -= 1;
            trip.total_price += price;
            await tripRepository.save(trip);
        }
        return trip ? trip : undefined;
    }
    async getSchoolByTripId(trip_id) {
        const tripRepository = db_1.default.getRepository(trip_1.Trip);
        const trip = await tripRepository
            .createQueryBuilder("trip")
            .leftJoin("trip.authorization", "authorization")
            .select("authorization.school_address", "school")
            .where("trip.trip_id = :tripId", { tripId: trip_id })
            .getRawOne();
        return trip ? trip.school : '';
    }
    async getDriverAddressByTripId(trip_id) {
        const tripRepository = db_1.default.getRepository(trip_1.Trip);
        const driver = await tripRepository
            .createQueryBuilder("trip")
            .leftJoin("trip.authorization", "authorization")
            .select("authorization.address", "address")
            .where("trip.trip_id = :tripId", { tripId: trip_id })
            .getRawOne();
        return driver ? driver.address : '';
    }
    async getPaymentsByDriver() {
        const today = new Date();
        const previousMonthDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        const formattedMonth = previousMonthDate.toISOString().slice(0, 7); // "YYYY-MM"
        const tripRepository = db_1.default.getRepository(trip_1.Trip);
        const payments = await tripRepository.createQueryBuilder("trip")
            .leftJoin("trip.authorization", "authorization")
            .leftJoin("authorization.user", "user")
            .select("user.id", "userId")
            .addSelect("user.full_name", "full_name")
            .addSelect("trip.date", "tripDate")
            .addSelect("authorization.ubc", "ubc")
            .addSelect("DATE_FORMAT(trip.date, '%Y-%m')", "month")
            .addSelect("SUM(trip.total_price)", "totalAmount")
            .addSelect("MAX(trip.is_paid)", "is_paid")
            .groupBy("user.id")
            .addGroupBy("user.full_name")
            .addGroupBy("month")
            .orderBy("month", "DESC")
            .addOrderBy("user.full_name", "ASC")
            .having("DATE_FORMAT(trip.date, '%Y-%m') = :month", { month: formattedMonth })
            .getRawMany();
        return payments.map((payment) => ({
            userId: payment.userId,
            full_name: payment.full_name,
            totalAmount: parseFloat(payment.totalAmount),
            month: payment.month,
            ubc: payment.ubc,
            is_paid: !!payment.is_paid
        }));
    }
    async markTripsAsPaid(userId, month) {
        const subquery = db_1.default.getRepository("authorization")
            .createQueryBuilder("auth")
            .select("auth.authorization_id")
            .where("auth.user = :userId");
        await db_1.default.getRepository(trip_1.Trip)
            .createQueryBuilder()
            .update()
            .set({ is_paid: true })
            .where("DATE_FORMAT(date, '%Y-%m') = :month", { month })
            .andWhere(`authorization IN (${subquery.getQuery()})`)
            .setParameters({ userId })
            .execute();
    }
    async startTrip(tripId) {
        const tripRepo = db_1.default.getRepository(trip_1.Trip);
        const trip = await tripRepo.findOne({
            where: { trip_id: tripId },
            relations: ["trip_child", "trip_child.child", "trip_child.child.user"],
        });
        if (!trip)
            throw new Error("Trip not found");
        for (const tripChild of trip.trip_child) {
            const userNotif = tripChild.child.user;
            if (userNotif) {
                await notificationService_1.default.postNotification({
                    notification_id: 0,
                    title: "Viaje iniciado",
                    detail: `El viaje del día ${trip.date} ha comenzado.`,
                    user: userNotif,
                    is_read: false,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                });
            }
        }
        trip.status = "in progress";
        await tripRepo.save(trip);
        return "Viaje iniciado y notificaciones enviadas";
    }
    async finishTrip(tripId) {
        const tripRepo = db_1.default.getRepository(trip_1.Trip);
        const trip = await tripRepo.findOne({
            where: { trip_id: tripId },
            relations: ["trip_child", "trip_child.child", "trip_child.child.user"],
        });
        if (!trip)
            throw new Error("Trip not found");
        for (const tripChild of trip.trip_child) {
            const userNotif = tripChild.child.user;
            if (userNotif) {
                await notificationService_1.default.postNotification({
                    notification_id: 0,
                    title: "Viaje finalizado",
                    detail: `El viaje del día ${trip.date} ha finalizado.`,
                    user: userNotif,
                    is_read: false,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                });
            }
        }
        trip.status = "completed";
        await tripRepo.save(trip);
        return "Viaje finalizado y notificaciones enviadas";
    }
    async cancelTripById(tripId, cancelReason) {
        const tripRepo = db_1.default.getRepository(trip_1.Trip);
        const trip = await tripRepo.findOne({
            where: { trip_id: tripId },
            relations: ["trip_child", "trip_child.child", "trip_child.child.user"],
        });
        if (!trip)
            throw new Error("Trip not found");
        for (const tripChild of trip.trip_child) {
            const userNotif = tripChild.child.user;
            if (userNotif) {
                await notificationService_1.default.postNotification({
                    notification_id: 0,
                    title: "Viaje cancelado",
                    detail: `El viaje del día ${trip.date} ha sido cancelado. La razón es: ${cancelReason}`,
                    user: userNotif,
                    is_read: false,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                });
            }
        }
        trip.status = "cancelled";
        trip.cancel_reason = cancelReason;
        await tripRepo.save(trip);
        return "Viaje cancelado y notificaciones enviadas";
    }
}
exports.default = new TripService();
