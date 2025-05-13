import db from "../database/db";
import { Trip } from "../models/trip";
import { Authorization } from "../models/authorization";
import notificationService from "./notificationService";

class TripService {

    async getAllTrips(): Promise<Trip[]> {
        const tripRepository = db.getRepository(Trip);  
        return await tripRepository.find();  
    } 

    async getTripByUser(id: number): Promise<Trip[]> {
        const tripRepository = db.getRepository(Trip); 
        console.log("ID: ", id);
        const trips = await tripRepository.createQueryBuilder("trip")
        .innerJoin("trip.trip_child", "trip_child")
        .leftJoinAndSelect("trip.authorization", "authorization")
        .leftJoinAndSelect("authorization.user", "user")
        .where("user.id = :user_id", { user_id: id })
        .groupBy("trip.trip_id")
        .addGroupBy("authorization.authorization_id") // necesario si hay GROUP BY
        .select(["trip.trip_id", "trip.date", "trip.status", "authorization"])
        .getMany();
        console.log("Trips: ", trips);
        return trips;
    }

    async getTripById(trip_id: number): Promise<Trip | undefined> {
        const tripRepository = db.getRepository(Trip);
        const trip = await tripRepository.findOne({ where: { trip_id } });  
        return trip ?? undefined;
    }

    async postTrip(data: Trip): Promise<Trip | undefined> {
        const tripRepository = db.getRepository(Trip);  
        const result = await tripRepository.save(data);  

        return result ? result : undefined; 
    }

    async postTripByUserEmail(authorization_id: number): Promise<Trip | undefined> {
        const authorizationRepository = db.getRepository(Authorization);
        const authorization = await authorizationRepository.findOne({ where: { authorization_id } });
        const trip = new Trip();
        trip.status = "pending";
        trip.authorization = authorization as Authorization;
        const tripRepository = db.getRepository(Trip);  
        const result = await tripRepository.save(trip); 

        return result ? result : undefined;
    }

    async putTripByAuthorizationAndShift(authorization: number, child_shift: string, selected_date: string, price: number): Promise<Trip | undefined> {
        const tripRepository = db.getRepository(Trip);  
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

    async getSchoolByTripId(trip_id: number): Promise<string> {
        const tripRepository = db.getRepository(Trip);
          
        const trip = await tripRepository
            .createQueryBuilder("trip")
            .leftJoin("trip.authorization", "authorization")
            .select("authorization.school_address", "school")
            .where("trip.trip_id = :tripId", { tripId: trip_id })
            .getRawOne();
          
        return trip ? trip.school : '';
    }

    async getDriverAddressByTripId(trip_id: number): Promise<string> {
        const tripRepository = db.getRepository(Trip);
          
        const driver = await tripRepository
            .createQueryBuilder("trip")
            .leftJoin("trip.authorization", "authorization")
            .select("authorization.address", "address")
            .where("trip.trip_id = :tripId", { tripId: trip_id })
            .getRawOne();
          
        return driver ? driver.address : '';
    }

    async getPaymentsByDriver(): Promise<any[]> {
        const today = new Date();
        const previousMonthDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        const formattedMonth = previousMonthDate.toISOString().slice(0, 7); // "YYYY-MM"

        const tripRepository = db.getRepository(Trip);
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

    async markTripsAsPaid(userId: number, month: string): Promise<void> {
        const subquery = db.getRepository("authorization")
            .createQueryBuilder("auth")
            .select("auth.authorization_id")
            .where("auth.user = :userId");

        await db.getRepository(Trip)
            .createQueryBuilder()
            .update()
            .set({ is_paid: true })
            .where("DATE_FORMAT(date, '%Y-%m') = :month", { month })
            .andWhere(`authorization IN (${subquery.getQuery()})`)
            .setParameters({ userId })
            .execute();
    }

    async startTrip(tripId: number): Promise<string> {
        const tripRepo = db.getRepository(Trip);
        const trip = await tripRepo.findOne({
        where: { trip_id: tripId },
        relations: ["trip_child", "trip_child.child", "trip_child.child.user"],
        });

        if (!trip) throw new Error("Trip not found");

        for (const tripChild of trip.trip_child) {
        const userNotif = tripChild.child.user;

        if (userNotif) {
            await notificationService.postNotification({
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

    async finishTrip(tripId: number): Promise<string> {
        const tripRepo = db.getRepository(Trip);
        const trip = await tripRepo.findOne({
        where: { trip_id: tripId },
        relations: ["trip_child", "trip_child.child", "trip_child.child.user"],
        });
        if (!trip) throw new Error("Trip not found");

        for (const tripChild of trip.trip_child) {
        const userNotif = tripChild.child.user;

        if (userNotif) {
            await notificationService.postNotification({
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
}

export default new TripService();




