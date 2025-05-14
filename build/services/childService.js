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
const child_1 = require("../models/child");
const typeorm_1 = require("typeorm");
class ChildService {
    getAllChildren() {
        return __awaiter(this, void 0, void 0, function* () {
            const childRepository = db_1.default.getRepository(child_1.Child);
            return yield childRepository.find({ where: { deleted_at: (0, typeorm_1.IsNull)() } });
        });
    }
    getChildByUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const childRepository = db_1.default.getRepository(child_1.Child);
            return yield childRepository.createQueryBuilder("children")
                .where("children.user_id = :user_id", { user_id: id })
                .andWhere("children.deleted_at IS NULL")
                .getMany();
        });
    }
    getChildById(child_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const childRepository = db_1.default.getRepository(child_1.Child);
            const child = yield childRepository.findOne({ where: { child_id, deleted_at: (0, typeorm_1.IsNull)() } });
            return child !== null && child !== void 0 ? child : undefined;
        });
    }
    postChild(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const childRepository = db_1.default.getRepository(child_1.Child);
            const result = yield childRepository.save(data);
            return result ? result : undefined;
        });
    }
    putChild(child_id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const childRepository = db_1.default.getRepository(child_1.Child);
            const child = yield childRepository.findOne({ where: { child_id, deleted_at: (0, typeorm_1.IsNull)() } });
            if (child) {
                child.name = data.name || child.name;
                child.last_name = data.last_name || child.last_name;
                child.age = data.age || child.age;
                child.school_name = data.school_name || child.school_name;
                child.school_address = data.school_address || child.school_address;
                child.user = child.user;
                child.school_shift = data.school_shift || child.school_shift;
                yield childRepository.save(child);
                return child;
            }
            return undefined;
        });
    }
    deleteChild(child_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const childRepository = db_1.default.getRepository(child_1.Child);
            const child = yield childRepository.findOne({ where: { child_id, deleted_at: (0, typeorm_1.IsNull)() } });
            if (child) {
                child.deleted_at = new Date().toString();
                yield childRepository.save(child);
                return true;
            }
            return false;
        });
    }
}
exports.default = new ChildService();
