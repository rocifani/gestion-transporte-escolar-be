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
const trip_1 = require("../models/trip");
const authorization_1 = require("../models/authorization");
const notificationService_1 = __importDefault(require("./notificationService"));
class TripService {
    getAllTrips() {
        return __awaiter(this, void 0, void 0, function* () {
            const tripRepository = db_1.default.getRepository(trip_1.Trip);
            return yield tripRepository.find();
        });
    }
    getTripByUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const tripRepository = db_1.default.getRepository(trip_1.Trip);
            return yield tripRepository.createQueryBuilder("trip")
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
        });
    }
    getTripById(trip_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const tripRepository = db_1.default.getRepository(trip_1.Trip);
            const trip = yield tripRepository.findOne({ where: { trip_id } });
            return trip !== null && trip !== void 0 ? trip : undefined;
        });
    }
    postTrip(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const tripRepository = db_1.default.getRepository(trip_1.Trip);
            const result = yield tripRepository.save(data);
            return result ? result : undefined;
        });
    }
    postTripByUserEmail(authorization_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const authorizationRepository = db_1.default.getRepository(authorization_1.Authorization);
            const authorization = yield authorizationRepository.findOne({ where: { authorization_id } });
            const trip = new trip_1.Trip();
            trip.status = "pending";
            trip.authorization = authorization;
            const tripRepository = db_1.default.getRepository(trip_1.Trip);
            const result = yield tripRepository.save(trip);
            return result ? result : undefined;
        });
    }
    putTripByAuthorizationAndShift(authorization, child_shift, selected_date, price) {
        return __awaiter(this, void 0, void 0, function* () {
            const tripRepository = db_1.default.getRepository(trip_1.Trip);
            const trip = yield tripRepository.findOne({
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
                yield tripRepository.save(trip);
            }
            return trip ? trip : undefined;
        });
    }
    getSchoolByTripId(trip_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const tripRepository = db_1.default.getRepository(trip_1.Trip);
            const trip = yield tripRepository
                .createQueryBuilder("trip")
                .leftJoin("trip.authorization", "authorization")
                .select("authorization.school_address", "school")
                .where("trip.trip_id = :tripId", { tripId: trip_id })
                .getRawOne();
            return trip ? trip.school : '';
        });
    }
    getDriverAddressByTripId(trip_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const tripRepository = db_1.default.getRepository(trip_1.Trip);
            const driver = yield tripRepository
                .createQueryBuilder("trip")
                .leftJoin("trip.authorization", "authorization")
                .select("authorization.address", "address")
                .where("trip.trip_id = :tripId", { tripId: trip_id })
                .getRawOne();
            return driver ? driver.address : '';
        });
    }
    getPaymentsByDriver() {
        return __awaiter(this, void 0, void 0, function* () {
            const today = new Date();
            const previousMonthDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
            const formattedMonth = previousMonthDate.toISOString().slice(0, 7); // "YYYY-MM"
            const tripRepository = db_1.default.getRepository(trip_1.Trip);
            const payments = yield tripRepository.createQueryBuilder("trip")
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
        });
    }
    markTripsAsPaid(userId, month) {
        return __awaiter(this, void 0, void 0, function* () {
            const subquery = db_1.default.getRepository("authorization")
                .createQueryBuilder("auth")
                .select("auth.authorization_id")
                .where("auth.user = :userId");
            yield db_1.default.getRepository(trip_1.Trip)
                .createQueryBuilder()
                .update()
                .set({ is_paid: true })
                .where("DATE_FORMAT(date, '%Y-%m') = :month", { month })
                .andWhere(`authorization IN (${subquery.getQuery()})`)
                .setParameters({ userId })
                .execute();
        });
    }
    startTrip(tripId) {
        return __awaiter(this, void 0, void 0, function* () {
            const tripRepo = db_1.default.getRepository(trip_1.Trip);
            const trip = yield tripRepo.findOne({
                where: { trip_id: tripId },
                relations: ["trip_child", "trip_child.child", "trip_child.child.user"],
            });
            if (!trip)
                throw new Error("Trip not found");
            for (const tripChild of trip.trip_child) {
                const userNotif = tripChild.child.user;
                if (userNotif) {
                    yield notificationService_1.default.postNotification({
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
            yield tripRepo.save(trip);
            return "Viaje iniciado y notificaciones enviadas";
        });
    }
    finishTrip(tripId) {
        return __awaiter(this, void 0, void 0, function* () {
            const tripRepo = db_1.default.getRepository(trip_1.Trip);
            const trip = yield tripRepo.findOne({
                where: { trip_id: tripId },
                relations: ["trip_child", "trip_child.child", "trip_child.child.user"],
            });
            if (!trip)
                throw new Error("Trip not found");
            for (const tripChild of trip.trip_child) {
                const userNotif = tripChild.child.user;
                if (userNotif) {
                    yield notificationService_1.default.postNotification({
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
            yield tripRepo.save(trip);
            return "Viaje finalizado y notificaciones enviadas";
        });
    }
    cancelTripById(tripId, cancelReason) {
        return __awaiter(this, void 0, void 0, function* () {
            const tripRepo = db_1.default.getRepository(trip_1.Trip);
            const trip = yield tripRepo.findOne({
                where: { trip_id: tripId },
                relations: ["trip_child", "trip_child.child", "trip_child.child.user"],
            });
            if (!trip)
                throw new Error("Trip not found");
            for (const tripChild of trip.trip_child) {
                const userNotif = tripChild.child.user;
                if (userNotif) {
                    yield notificationService_1.default.postNotification({
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
            yield tripRepo.save(trip);
            return "Viaje cancelado y notificaciones enviadas";
        });
    }
}
exports.default = new TripService();
