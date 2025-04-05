import { Router } from "express";
import paymentController from "../controllers/paymentController";
const paymentRouter = Router();

paymentRouter.post("/webhook", paymentController.handleWebhook);
paymentRouter.post("/", paymentController.createPayment);
paymentRouter.get("/success", (_req, res) => {
  res.send("Payment successful");
}
);


export default paymentRouter;