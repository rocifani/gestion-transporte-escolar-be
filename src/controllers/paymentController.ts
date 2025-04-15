import paymentService from "../services/paymentService";
import { Request, Response } from "express";
import { sendError, sendSuccess } from "../utils/requestHandlers";
import axios from "axios";
import childService from "../services/childService";
import tripChildService from "../services/tripChildService";
import tripService from "../services/tripService";

class PaymentController{

  async createPayment(req: Request, res: Response) {
    try {
      const trip = req.body;
      console.log(trip.user_id);
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
            const {child_id, authorization_id, selected_dates} = payment.metadata; 
            const child = await childService.getChildById(child_id);
            if(selected_dates.length === 0){
              console.log("No hay fechas seleccionadas para el viaje");
              throw new Error("No hay fechas seleccionadas para el viaje");
            }
            for (let i = 0; i < selected_dates.length; i++){
              if (!child?.school_shift) {
                throw new Error("Child's school shift is undefined");
              }
              const trip = await tripService.putTripByAuthorizationAndShift(authorization_id, child.school_shift, selected_dates[i]);
              console.log("Trip para fecha " + selected_dates[i] + ": ", trip + "actualizado");
              if(trip){
                const trip_child= await tripChildService.postTripChild(trip.trip_id, child_id);
                console.log("Trip_child para fecha " + selected_dates[i] + ": ", trip_child + "creado");
              }
             } 
            
              return sendSuccess(res, { message: "Transportes creados" });
          }
      }
  } catch (err) {
      console.error('Error en webhook:', err);
      sendError(res, 'Error processing webhook', 500);
  }
}

};

export default new PaymentController;

