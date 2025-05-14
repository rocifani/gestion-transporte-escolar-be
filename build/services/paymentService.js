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
const mercadopago_1 = require("mercadopago");
const db_1 = __importDefault(require("../database/db"));
const user_1 = require("../models/user");
const price_1 = require("../models/price");
const authorizationService_1 = __importDefault(require("./authorizationService"));
class PaymentService {
    createPayment(trip) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f, _g, _h;
            const userRepository = db_1.default.getRepository(user_1.User);
            const user = yield userRepository.findOne({ where: { id: trip.user_id } });
            const authorization = yield authorizationService_1.default.getAuthorizationById(trip.authorization_id, { relations: ['user'] });
            if (!authorization) {
                throw new Error('Authorization not found');
            }
            const priceRepository = db_1.default.getRepository(price_1.Price);
            const price = yield priceRepository.findOne({ where: { user: { id: authorization.user.id } },
                order: { date_from: 'DESC' } });
            const client = new mercadopago_1.MercadoPagoConfig({ accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN });
            const preference = new mercadopago_1.Preference(client);
            let total = 0;
            const items = [];
            if (trip.selected_dates.length < 20) {
                total = trip.selected_dates.length * ((_a = price === null || price === void 0 ? void 0 : price.daily_price) !== null && _a !== void 0 ? _a : 0);
                items.push({
                    id: 'trip',
                    title: 'Transporte',
                    description: 'Transporte por día',
                    quantity: trip.selected_dates.length,
                    unit_price: (_b = price === null || price === void 0 ? void 0 : price.daily_price) !== null && _b !== void 0 ? _b : 0
                });
            }
            else if (trip.selected_dates.length === 20) {
                total = (_c = price === null || price === void 0 ? void 0 : price.monthly_price) !== null && _c !== void 0 ? _c : 0;
                items.push({
                    id: 'monthly_fee',
                    title: 'Precio por más de 20 días',
                    description: 'Mes siguiente',
                    quantity: 1,
                    unit_price: (_d = price === null || price === void 0 ? void 0 : price.monthly_price) !== null && _d !== void 0 ? _d : 0
                });
            }
            else {
                total = trip.selected_dates.length - 20 * ((_e = price === null || price === void 0 ? void 0 : price.daily_price) !== null && _e !== void 0 ? _e : 0) + ((_f = price === null || price === void 0 ? void 0 : price.monthly_price) !== null && _f !== void 0 ? _f : 0);
                items.push({
                    id: 'trip',
                    title: 'Transporte',
                    description: 'Transporte por día',
                    quantity: trip.selected_dates.length - 20,
                    unit_price: (_g = price === null || price === void 0 ? void 0 : price.daily_price) !== null && _g !== void 0 ? _g : 0
                });
                items.push({
                    id: 'monthly_fee',
                    title: 'Precio por más de 20 días',
                    description: 'Mes siguiente',
                    quantity: 1,
                    unit_price: (_h = price === null || price === void 0 ? void 0 : price.monthly_price) !== null && _h !== void 0 ? _h : 0
                });
            }
            const result = yield preference.create({
                body: {
                    items,
                    payer: {
                        email: (user === null || user === void 0 ? void 0 : user.email) || "example@e.com"
                    },
                    back_urls: {
                        success: "http://localhost:8100/success",
                        failure: "https://localhost:8100/failure",
                        pending: "https://localhost:3000/pending"
                    },
                    metadata: {
                        child_id: trip.child_id,
                        authorization_id: trip.authorization_id,
                        selected_dates: trip.selected_dates,
                        price: total
                    },
                    auto_return: "approved",
                    notification_url: "https://92f8-190-2-108-170.ngrok-free.app/payment/webhook"
                }
            });
            return result;
        });
    }
}
exports.default = new PaymentService();
