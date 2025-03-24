import db from "../database/db";
import { Child } from "../models/child";

class ChildService {

    async getAllChildren(): Promise<Child[]> {
        const childRepository = db.getRepository(Child);  
        return await childRepository.find();  
    } 

    async getChildByUser(id: number): Promise<Child[]> {
        const vehicleRepository = db.getRepository(Child); 
        return await vehicleRepository.createQueryBuilder("children")
            .where("children.userId = :user_id", { user_id: id })
            .getMany();  
    }

    async getChildById(child_id: number): Promise<Child | undefined> {
        const childRepository = db.getRepository(Child);
        const child = await childRepository.findOne({ where: { child_id } });  
        return child ?? undefined;
    }

    async postChild(data: Child): Promise<Child | undefined> {
        const childRepository = db.getRepository(Child);  
        const result = await childRepository.save(data);  

        return result ? result : undefined; 
    }

    async putChild(child_id: number, data: Child): Promise<Child | undefined> {
        const childRepository = db.getRepository(Child); 
        const child = await childRepository.findOne({ where: { child_id } });

        if (child) {
            child.name = data.name || child.name;
            child.last_name = data.last_name || child.last_name;
            child.age = data.age || child.age;
            child.school = data.school || child.school;
            child.user = child.user;
          
            await childRepository.save(child);
            return child;
        }

        return undefined;  
    }

    

}

export default new ChildService();




