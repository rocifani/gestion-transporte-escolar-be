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
const price_1 = require("../models/price");
const typeorm_1 = require("typeorm");
class PriceService {
    getAllPrices() {
        return __awaiter(this, void 0, void 0, function* () {
            const priceRepository = db_1.default.getRepository(price_1.Price);
            return yield priceRepository.find({ where: { deleted_at: (0, typeorm_1.IsNull)() } });
        });
    }
    getPriceByUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const priceRepository = db_1.default.getRepository(price_1.Price);
            return yield priceRepository.createQueryBuilder("prices")
                .where("prices.user = :user_id", { user_id: id })
                .andWhere("prices.deleted_at IS NULL")
                .getMany();
        });
    }
    getPriceById(price_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const priceRepository = db_1.default.getRepository(price_1.Price);
            const price = yield priceRepository.findOne({ where: { price_id, deleted_at: (0, typeorm_1.IsNull)() } });
            return price !== null && price !== void 0 ? price : undefined;
        });
    }
    getPriceByUserAuthorization(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const priceRepository = db_1.default.getRepository(price_1.Price);
            return yield priceRepository.createQueryBuilder("prices")
                .where("prices.user = :user_id", { user_id: id })
                .andWhere("prices.deleted_at IS NULL")
                .orderBy("prices.date_from", "DESC")
                .getOne();
        });
    }
    postPrice(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const priceRepository = db_1.default.getRepository(price_1.Price);
            const result = yield priceRepository.save(data);
            return result ? result : undefined;
        });
    }
    deletePrice(price_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const priceRepository = db_1.default.getRepository(price_1.Price);
            const price = yield priceRepository.findOne({ where: { price_id, deleted_at: (0, typeorm_1.IsNull)() } });
            if (price) {
                price.deleted_at = new Date().toString();
                yield priceRepository.save(price);
                return true;
            }
            return false;
        });
    }
}
exports.default = new PriceService();
