
import { Request, Response } from 'express';
import axios from 'axios';

const webhookController = {
  async handleWebhook(req: Request, res: Response, _next: any) {
    try {
      const { action, data } = req.body;
      if (action === 'payment.created' || action === 'payment.updated') {
        const paymentId = data.id;

        // Consultás el pago a Mercado Pago para obtener su estado
        const response = await axios.get(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
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
    } catch (err) {
      console.error('Error en webhook:', err);
      return res.status(500).send('Webhook error');
    }
  }
};

export default webhookController;
