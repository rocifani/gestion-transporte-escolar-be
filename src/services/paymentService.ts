
import { MercadoPagoConfig, Preference} from 'mercadopago';
import userService from './userService';

class PaymentService {
    
    async createPayment(trip: any): Promise<any> {
        const user= await userService.getUserById(trip.user_id);

        const client = new MercadoPagoConfig({ accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN as string });
        const preference = new Preference(client);
    
        const result = await preference.create({
            body: {
                items: [
                    {
                        id: 'trip',
                        title: 'Transporte',
                        description: 'Transporte de pasajeros',
                        quantity: 1,
                        unit_price: 58
                    }
                ],
                payer: 
                {
                    email: user?.email || "example@e.com"
                },
                back_urls: {
                    success: "http://localhost:8100/success",
                    failure: "http://localhost:3000/failure",
                    pending: "http://localhost:3000/pending"
                },
                metadata: {
                    child_id: trip.child_id,
                    authorization_id: trip.authorization_id,
                    selected_dates: trip.selected_dates
                },
                auto_return: "approved",
                notification_url: "https://4643-190-2-108-159.ngrok-free.app/payment/webhook"
            }
        });
    
        return result;
    }
}

export default new PaymentService();