"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("../database/db"));
const price_1 = require("../models/price");
const typeorm_1 = require("typeorm");
class PriceService {
    async getAllPrices() {
        const priceRepository = db_1.default.getRepository(price_1.Price);
        return await priceRepository.find({ where: { deleted_at: (0, typeorm_1.IsNull)() } });
    }
    async getPriceByUser(id) {
        const priceRepository = db_1.default.getRepository(price_1.Price);
        return await priceRepository.createQueryBuilder("prices")
            .where("prices.user = :user_id", { user_id: id })
            .andWhere("prices.deleted_at IS NULL")
            .getMany();
    }
    async getPriceById(price_id) {
        const priceRepository = db_1.default.getRepository(price_1.Price);
        const price = await priceRepository.findOne({ where: { price_id, deleted_at: (0, typeorm_1.IsNull)() } });
        return price ?? undefined;
    }
    async getPriceByUserAuthorization(id) {
        const priceRepository = db_1.default.getRepository(price_1.Price);
        return await priceRepository.createQueryBuilder("prices")
            .where("prices.user = :user_id", { user_id: id })
            .andWhere("prices.deleted_at IS NULL")
            .orderBy("prices.date_from", "DESC")
            .getOne();
    }
    async postPrice(data) {
        const priceRepository = db_1.default.getRepository(price_1.Price);
        const result = await priceRepository.save(data);
        return result ? result : undefined;
    }
    async deletePrice(price_id) {
        const priceRepository = db_1.default.getRepository(price_1.Price);
        const price = await priceRepository.findOne({ where: { price_id, deleted_at: (0, typeorm_1.IsNull)() } });
        if (price) {
            price.deleted_at = new Date().toString();
            await priceRepository.save(price);
            return true;
        }
        return false;
    }
}
exports.default = new PriceService();
