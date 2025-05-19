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
const paymentService_1 = __importDefault(require("../services/paymentService"));
const requestHandlers_1 = require("../utils/requestHandlers");
const axios_1 = __importDefault(require("axios"));
const childService_1 = __importDefault(require("../services/childService"));
const tripChildService_1 = __importDefault(require("../services/tripChildService"));
const tripService_1 = __importDefault(require("../services/tripService"));
class PaymentController {
    createPayment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const trip = req.body;
                const payment = yield paymentService_1.default.createPayment(trip);
                return (0, requestHandlers_1.sendSuccess)(res, { preferenceId: payment.id });
            }
            catch (error) {
                console.error("Error creating payment:", error);
                res.status(500).json({ error: "Internal server error" });
            }
        });
    }
    handleWebhook(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { action, data } = req.body;
                if (action === 'payment.created' || action === 'payment.updated') {
                    const paymentId = data.id;
                    const response = yield axios_1.default.get(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
                        headers: {
                            Authorization: `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}`
                        }
                    });
                    const payment = response.data;
                    if (payment.status === 'approved') {
                        const { child_id, authorization_id, selected_dates, price } = payment.metadata;
                        const child = yield childService_1.default.getChildById(child_id);
                        if (selected_dates.length === 0) {
                            console.log("No hay fechas seleccionadas para el viaje");
                            throw new Error("No hay fechas seleccionadas para el viaje");
                        }
                        for (let i = 0; i < selected_dates.length; i++) {
                            if (!(child === null || child === void 0 ? void 0 : child.school_shift)) {
                                throw new Error("Child's school shift is undefined");
                            }
                            const trip = yield tripService_1.default.putTripByAuthorizationAndShift(authorization_id, child.school_shift, selected_dates[i], price);
                            console.log("Trip para fecha " + selected_dates[i] + ": ", trip + "actualizado");
                            if (trip) {
                                const trip_child = yield tripChildService_1.default.postTripChild(trip.trip_id, child_id);
                                console.log("Trip_child para fecha " + selected_dates[i] + ": ", trip_child + "creado");
                            }
                        }
                        return (0, requestHandlers_1.sendSuccess)(res, { message: "Transportes creados" });
                    }
                }
            }
            catch (err) {
                console.error('Error en webhook:', err);
                (0, requestHandlers_1.sendError)(res, 'Error processing webhook', 500);
            }
        });
    }
}
;
exports.default = new PaymentController;
