import { MercadoPagoConfig, Preference} from 'mercadopago';
 import db from '../database/db';
 import { User } from '../models/user';
import { Price } from '../models/price';
import authorizationService from './authorizationService';
 
 class PaymentService {
     
     async createPayment(trip: any): Promise<any> {
         const userRepository = db.getRepository(User);
         const user = await userRepository.findOne({ where: { id: trip.user_id } });
         const authorization = await authorizationService.getAuthorizationById(trip.authorization_id, { relations: ['user'] });
         if (!authorization) {
             throw new Error('Authorization not found');
         }
         const priceRepository = db.getRepository(Price);
         const price = await priceRepository.findOne({ where: { user: { id: authorization.user.id} },
                                                        order: { date_from: 'DESC' } });
 
         const client = new MercadoPagoConfig({ accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN as string });
         const preference = new Preference(client);
         let total = 0;
         const items = [] as any;
            if(trip.selected_dates.length < 20) 
            { total = trip.selected_dates.length * (price?.daily_price ?? 0);
              items.push({
              id: 'trip',
              title: 'Transporte',
              description: 'Transporte por día',
              quantity: trip.selected_dates.length,
              unit_price: price?.daily_price ?? 0
            });
            } else if (trip.selected_dates.length === 20) {
            total = price?.monthly_price ?? 0;
            items.push({
              id: 'monthly_fee',
              title: 'Precio por más de 20 días',
              description: 'Mes siguiente',
              quantity: 1,
              unit_price: price?.monthly_price ?? 0
            });
            } else {
            total = trip.selected_dates.length - 20 * (price?.daily_price ?? 0) + (price?.monthly_price ?? 0);
            items.push({
              id: 'trip',
              title: 'Transporte',
              description: 'Transporte por día',
              quantity: trip.selected_dates.length - 20,
              unit_price: price?.daily_price ?? 0
            });
            items.push({
                id: 'monthly_fee',    
                title: 'Precio por más de 20 días', 
                description: 'Mes siguiente',
                quantity: 1,
                unit_price: price?.monthly_price ?? 0
            });
          }
     
         const result = await preference.create({
             body: {
                 items,
                 payer: 
                 {
                     email: user?.email || "example@e.com"
                 },
                 back_urls: {
                     success: "https://gestion-transporte-escolar-two.vercel.app/success",
                     failure: "https://gestion-transporte-escolar-two.vercel.app/failure",
                     pending: "https://gestion-transporte-escolar-two.vercel.app/pending"
                 },
                 metadata: {
                     child_id: trip.child_id,
                     authorization_id: trip.authorization_id,
                     selected_dates: trip.selected_dates,
                     price: total
                 },
                 auto_return: "approved",
                 notification_url: "https://gestion-transporte-escolar-be-production-e770.up.railway.app/payment/webhook"
             }
         });
     
         return result;
     }
 }
 
 export default new PaymentService();