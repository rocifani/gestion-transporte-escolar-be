"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const webhookController = {
    async handleWebhook(req, res, _next) {
        try {
            const { action, data } = req.body;
            if (action === 'payment.created' || action === 'payment.updated') {
                const paymentId = data.id;
                // Consultás el pago a Mercado Pago para obtener su estado
                const response = await axios_1.default.get(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
                    headers: {
                        Authorization: `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}`,
                    },
                });
                const payment = response.data;
                if (payment.status === 'approved') {
                    const userEmail = payment.payer.email;
                    console.log('✅ Trip creado para', userEmail);
                }
            }
            return res.status(200).send('OK');
        }
        catch (err) {
            console.error('Error en webhook:', err);
            return res.status(500).send('Webhook error');
        }
    }
};
exports.default = webhookController;
