import db from "../database/db";
import { Authorization } from "../models/authorization";
import { Child } from "../models/child";

class AuthorizationService {

    async getAllAuthorizations(): Promise<Authorization[]> {
        const authorizationRepository = db.getRepository(Authorization);  
        return await authorizationRepository.find(); 
    }

    async getAuthorizationById(authorization_id: number, options = {}): Promise<Authorization | null> {
        return db.getRepository(Authorization).findOne({
          where: { authorization_id },
          relations: ['user'], 
          ...options
        });
      }

    async postAuthorization(data: Authorization): Promise<Authorization | undefined> {
        const authorizationRepository = db.getRepository(Authorization);          
        const result = await authorizationRepository.save(data);  

        return result ? result : undefined; 
    }

    async putAuthorization(authorization_id: number, data: Authorization): Promise<Authorization | undefined> {
        const authorizationRepository = db.getRepository(Authorization); 
        const authorization = await authorizationRepository.findOne({ where: { authorization_id } });

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
            authorization.state = data.state;
            authorization.dni = data.dni;
            authorization.rejection_reason = data.rejection_reason;
          
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

    async getChildAuthorizations(child_id: number): Promise<Authorization[] | null> {
        const childRepository = db.getRepository(Child); 
        const child = await childRepository.findOne({ where: { child_id } });    
    
        if (!child) {
            console.warn(`No se encontró el hijo con ID ${child_id}`);
            return null;
        }
    
        const school = child.school;
        const shift = child.school_shift;
    
        const authorizationRepository = db.getRepository(Authorization);
        const authorizations = await authorizationRepository
            .createQueryBuilder("authorization")
            .leftJoinAndSelect("authorization.trips", "trip")
            .leftJoinAndSelect("authorization.user", "user")
            .where("authorization.school = :school", { school })
            .andWhere("authorization.work_shift = :shift", { shift })
            .andWhere("authorization.state = :state", { state: 2 })
            .andWhere("authorization.due_date_driver >= :currentDate", { currentDate: new Date() }) 
            .andWhere("authorization.due_date_vehicle >= :currentDate", { currentDate: new Date() })
            .andWhere("trip.available_capacity > 0")
            .getMany();
            console.log(authorizations);

        return authorizations;
    }
    
    

}

export default new AuthorizationService();




