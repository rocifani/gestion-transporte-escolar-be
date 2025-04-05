import paymentService from "../services/paymentService";
import { Request, Response } from "express";
import { sendError, sendSuccess } from "../utils/requestHandlers";
import axios from "axios";
import tripService from "../services/tripService";

class PaymentController{

  async createPayment(req: Request, res: Response) {
    try {
      const trip = req.body;
      const payment = await paymentService.createPayment(trip);
      return sendSuccess(res, { preferenceId: payment.id });
      
    } catch (error) {
      console.error("Error creating payment:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

async handleWebhook(req: Request, res: Response) {
  try {
      const { action, data } = req.body;

      if (action === 'payment.created' || action === 'payment.updated') {
          const paymentId = data.id;

          const response = await axios.get(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
              headers: {
                  Authorization: `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}`
              }
          });

          const payment = response.data;

          if (payment.status === 'approved') {
              const { user_id, child_id, authorization_id } = payment.metadata;
              const trip= await tripService.postTripByUserEmail(user_id, child_id, authorization_id);

              return sendSuccess(res, { message: "Payment approved", trip });
          }
      }
  } catch (err) {
      console.error('Error en webhook:', err);
      sendError(res, 'Error processing webhook', 500);
  }
}

};

export default new PaymentController;

