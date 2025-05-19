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
const authorization_1 = require("../models/authorization");
const child_1 = require("../models/child");
const user_1 = require("../models/user");
class AuthorizationService {
    getAllAuthorizations() {
        return __awaiter(this, void 0, void 0, function* () {
            const authorizationRepository = db_1.default.getRepository(authorization_1.Authorization);
            return yield authorizationRepository.find();
        });
    }
    getAuthorizationById(authorization_id_1) {
        return __awaiter(this, arguments, void 0, function* (authorization_id, options = {}) {
            return db_1.default.getRepository(authorization_1.Authorization).findOne(Object.assign({ where: { authorization_id }, relations: ['user'] }, options));
        });
    }
    postAuthorization(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const authorizationRepository = db_1.default.getRepository(authorization_1.Authorization);
            const result = yield authorizationRepository.save(data);
            return result ? result : undefined;
        });
    }
    putAuthorization(authorization_id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const authorizationRepository = db_1.default.getRepository(authorization_1.Authorization);
            const authorization = yield authorizationRepository.findOne({ where: { authorization_id } });
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
                yield authorizationRepository.save(authorization);
                return authorization;
            }
            return undefined;
        });
    }
    getAuthorizationByUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const authorizationRepository = db_1.default.getRepository(authorization_1.Authorization);
            return yield authorizationRepository.createQueryBuilder("authorizations").
                where("authorizations.user_id = :user", { user: id }).getMany();
        });
    }
    getChildAuthorizations(child_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const childRepository = db_1.default.getRepository(child_1.Child);
            const child = yield childRepository.findOne({ where: { child_id } });
            if (!child) {
                console.warn(`No se encontró el hijo con ID ${child_id}`);
                return null;
            }
            const shift = child.school_shift;
            const authorizationRepository = db_1.default.getRepository(authorization_1.Authorization);
            const authorizations = yield authorizationRepository
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
        });
    }
    getUsersWithAuthorizations() {
        return __awaiter(this, void 0, void 0, function* () {
            const userRepository = db_1.default.getRepository(user_1.User);
            const users = yield userRepository
                .createQueryBuilder('user')
                .distinct(true)
                .innerJoin('user.authorizations', 'authorization') // Relación desde User hacia Authorization
                .getMany();
            return users;
        });
    }
    getLastApprovedAuthorization(user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const authorizationRepository = db_1.default.getRepository(authorization_1.Authorization);
            const authorizations = yield authorizationRepository
                .createQueryBuilder("authorization")
                .where("authorization.user_id = :user_id", { user_id })
                .andWhere("authorization.state = :state", { state: 2 })
                .orderBy("authorization.created_at", "DESC")
                .getMany();
            return authorizations.length > 0 ? authorizations[0] : null;
        });
    }
}
exports.default = new AuthorizationService();
