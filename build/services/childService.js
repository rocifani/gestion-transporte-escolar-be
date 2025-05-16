"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("../database/db"));
const child_1 = require("../models/child");
const typeorm_1 = require("typeorm");
class ChildService {
    async getAllChildren() {
        const childRepository = db_1.default.getRepository(child_1.Child);
        return await childRepository.find({ where: { deleted_at: (0, typeorm_1.IsNull)() } });
    }
    async getChildByUser(id) {
        const childRepository = db_1.default.getRepository(child_1.Child);
        return await childRepository.createQueryBuilder("children")
            .where("children.user_id = :user_id", { user_id: id })
            .andWhere("children.deleted_at IS NULL")
            .getMany();
    }
    async getChildById(child_id) {
        const childRepository = db_1.default.getRepository(child_1.Child);
        const child = await childRepository.findOne({ where: { child_id, deleted_at: (0, typeorm_1.IsNull)() } });
        return child ?? undefined;
    }
    async postChild(data) {
        const childRepository = db_1.default.getRepository(child_1.Child);
        const result = await childRepository.save(data);
        return result ? result : undefined;
    }
    async putChild(child_id, data) {
        const childRepository = db_1.default.getRepository(child_1.Child);
        const child = await childRepository.findOne({ where: { child_id, deleted_at: (0, typeorm_1.IsNull)() } });
        if (child) {
            child.name = data.name || child.name;
            child.last_name = data.last_name || child.last_name;
            child.age = data.age || child.age;
            child.school_name = data.school_name || child.school_name;
            child.school_address = data.school_address || child.school_address;
            child.user = child.user;
            child.school_shift = data.school_shift || child.school_shift;
            await childRepository.save(child);
            return child;
        }
        return undefined;
    }
    async deleteChild(child_id) {
        const childRepository = db_1.default.getRepository(child_1.Child);
        const child = await childRepository.findOne({ where: { child_id, deleted_at: (0, typeorm_1.IsNull)() } });
        if (child) {
            child.deleted_at = new Date().toString();
            await childRepository.save(child);
            return true;
        }
        return false;
    }
}
exports.default = new ChildService();
