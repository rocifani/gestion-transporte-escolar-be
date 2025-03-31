import db from "../database/db";
import { Authorization } from "../models/authorization";

class AuthorizationService {

    async getAllAuthorizations(): Promise<Authorization[]> {
        const authorizationRepository = db.getRepository(Authorization);  
        return await authorizationRepository.find(); 
    }

    async getAuthorizationById(authorization_id: number): Promise<Authorization | undefined> {
        const authorizationRepository = db.getRepository(Authorization);
        const authorization = await authorizationRepository.findOne({ where: { authorization_id } });  
        return authorization ?? undefined;
    }

    async postAuthorization(data: Authorization): Promise<Authorization | undefined> {
        const authorizationRepository = db.getRepository(Authorization);          
        const result = await authorizationRepository.save(data);  

        return result ? result : undefined; 
    }

    async putAuthorization(id: number, data: Authorization): Promise<Authorization | undefined> {
        const authorizationRepository = db.getRepository(Authorization); 
        const authorization = await authorizationRepository.createQueryBuilder("authorizations").where("authorizations.user_id = :user_id", { user_id: id }).getOne();

        if (authorization) {
            authorization.driver_name = data.driver_name;
            authorization.address = data.address;
            authorization.phone = data.phone;
            authorization.gender = data.gender;
            authorization.school = data.school;
            authorization.work_shift = data.work_shift;
            authorization.vehicle_make = data.vehicle_make;
            authorization.vehicle_model = data.vehicle_model;
            authorization.vehicle_year = data.vehicle_year;
            authorization.vehicle_license_plate = data.vehicle_license_plate;
            authorization.vehicle_capacity = data.vehicle_capacity;
            authorization.vehicle_authorization_pdf = data.vehicle_authorization_pdf;
            authorization.driver_authorization_pdf = data.driver_authorization_pdf;
            authorization.due_date_vehicle = data.due_date_vehicle;
            authorization.due_date_driver = data.due_date_driver;
          
            await authorizationRepository.save(authorization);
            return authorization;
        }

        return undefined;  
    }    

    async getAuthorizationByUser(id: number): Promise<Authorization[] | null> {
        const authorizationRepository = db.getRepository(Authorization); 
        return await authorizationRepository.createQueryBuilder("authorizations").
        where("authorizations.user_id = :user", { user: id }).getMany();
    }

    

}

export default new AuthorizationService();




