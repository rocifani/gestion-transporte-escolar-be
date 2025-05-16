"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("../database/db"));
const authorization_1 = require("../models/authorization");
const child_1 = require("../models/child");
const user_1 = require("../models/user");
class AuthorizationService {
    async getAllAuthorizations() {
        const authorizationRepository = db_1.default.getRepository(authorization_1.Authorization);
        return await authorizationRepository.find();
    }
    async getAuthorizationById(authorization_id, options = {}) {
        return db_1.default.getRepository(authorization_1.Authorization).findOne({
            where: { authorization_id },
            relations: ['user'],
            ...options
        });
    }
    async postAuthorization(data) {
        const authorizationRepository = db_1.default.getRepository(authorization_1.Authorization);
        const result = await authorizationRepository.save(data);
        return result ? result : undefined;
    }
    async putAuthorization(authorization_id, data) {
        const authorizationRepository = db_1.default.getRepository(authorization_1.Authorization);
        const authorization = await authorizationRepository.findOne({ where: { authorization_id } });
        if (authorization) {
            authorization.driver_name = data.driver_name;
            authorization.address = data.address;
            authorization.phone = data.phone;
            authorization.gender = data.gender;
            authorization.school_name = data.school_name;
            authorization.school_address = data.school_address;
            authorization.work_shift = data.work_shift;
            authorization.vehicle_make = data.vehicle_make;
            authorization.vehicle_model = data.vehicle_model;
            authorization.vehicle_year = data.vehicle_year;
            authorization.vehicle_license_plate = data.vehicle_license_plate;
            authorization.vehicle_capacity = data.vehicle_capacity;
            authorization.vehicle_authorization_pdf = data.vehicle_authorization_pdf;
            authorization.driver_authorization_pdf = data.driver_authorization_pdf;
            authorization.due_date_vehicle = data.due_date_vehicle;
            authorization.due_date_driver = data.due_date_driver;
            authorization.state = data.state;
            authorization.dni = data.dni;
            authorization.rejection_reason = data.rejection_reason;
            await authorizationRepository.save(authorization);
            return authorization;
        }
        return undefined;
    }
    async getAuthorizationByUser(id) {
        const authorizationRepository = db_1.default.getRepository(authorization_1.Authorization);
        return await authorizationRepository.createQueryBuilder("authorizations").
            where("authorizations.user_id = :user", { user: id }).getMany();
    }
    async getChildAuthorizations(child_id) {
        const childRepository = db_1.default.getRepository(child_1.Child);
        const child = await childRepository.findOne({ where: { child_id } });
        if (!child) {
            console.warn(`No se encontró el hijo con ID ${child_id}`);
            return null;
        }
        const shift = child.school_shift;
        const authorizationRepository = db_1.default.getRepository(authorization_1.Authorization);
        const authorizations = await authorizationRepository
            .createQueryBuilder("authorization")
            .leftJoinAndSelect("authorization.trips", "trip")
            .leftJoinAndSelect("authorization.user", "user")
            .where("authorization.work_shift = :shift", { shift })
            .andWhere("authorization.state = :state", { state: 2 })
            .andWhere("authorization.due_date_driver >= :currentDate", { currentDate: new Date() })
            .andWhere("authorization.due_date_vehicle >= :currentDate", { currentDate: new Date() })
            .andWhere("trip.available_capacity > 0")
            .getMany();
        return authorizations;
    }
    async getUsersWithAuthorizations() {
        const userRepository = db_1.default.getRepository(user_1.User);
        const users = await userRepository
            .createQueryBuilder('user')
            .distinct(true)
            .innerJoin('user.authorizations', 'authorization') // Relación desde User hacia Authorization
            .getMany();
        return users;
    }
    async getLastApprovedAuthorization(user_id) {
        const authorizationRepository = db_1.default.getRepository(authorization_1.Authorization);
        const authorizations = await authorizationRepository
            .createQueryBuilder("authorization")
            .where("authorization.user_id = :user_id", { user_id })
            .andWhere("authorization.state = :state", { state: 2 })
            .orderBy("authorization.created_at", "DESC")
            .getMany();
        return authorizations.length > 0 ? authorizations[0] : null;
    }
}
exports.default = new AuthorizationService();
