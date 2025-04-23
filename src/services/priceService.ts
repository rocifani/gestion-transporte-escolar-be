import db from "../database/db";
import { Price } from "../models/price";
import { IsNull } from "typeorm";

class PriceService {

    async getAllPrices(): Promise<Price[]> {
        const priceRepository = db.getRepository(Price);  
        return await priceRepository.find({ where: { deleted_at: IsNull() } });  
    } 

    async getPriceByUser(id: number): Promise<Price[]> {
        const priceRepository = db.getRepository(Price); 
        return await priceRepository.createQueryBuilder("prices")
            .where("prices.user_id = :user_id", { user_id: id })
            .andWhere("prices.deleted_at IS NULL")
            .getMany();  
    }

    async getPriceById(price_id: number): Promise<Price | undefined> {
        const priceRepository = db.getRepository(Price);
        const price = await priceRepository.findOne({ where: { price_id, deleted_at: IsNull() } });  
        return price ?? undefined;
    }

    async getPriceByUserAuthorization(id: number): Promise<Price | null> {
        const priceRepository = db.getRepository(Price); 
        return await priceRepository.createQueryBuilder("prices")
            .where("prices.user_id = :user_id", { user_id: id })
            .andWhere("prices.deleted_at IS NULL")
            .orderBy("prices.date_from", "DESC")
            .getOne(); 
    }

    async postPrice(data: Price): Promise<Price | undefined> {
        const priceRepository = db.getRepository(Price);  
        const result = await priceRepository.save(data);  

        return result ? result : undefined; 
    }

    async deletePrice(price_id: number): Promise<boolean> {
        const priceRepository = db.getRepository(Price);
        const price = await priceRepository.findOne({ where: { price_id, deleted_at: IsNull() } });

        if (price) {
            price.deleted_at = new Date().toString();
            await priceRepository.save(price);
            return true;
        }
        return false;
    }
}

export default new PriceService();
