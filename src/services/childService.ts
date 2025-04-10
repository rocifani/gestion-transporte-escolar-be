import db from "../database/db";
import { Child } from "../models/child";
import { IsNull } from "typeorm";

class ChildService {

    async getAllChildren(): Promise<Child[]> {
        const childRepository = db.getRepository(Child);  
        return await childRepository.find({ where: { deleted_at: IsNull() } });  
    } 

    async getChildByUser(id: number): Promise<Child[]> {
        const childRepository = db.getRepository(Child); 
        return await childRepository.createQueryBuilder("children")
            .where("children.userId = :user_id", { user_id: id })
            .andWhere("children.deleted_at IS NULL")
            .getMany();  
    }

    async getChildById(child_id: number): Promise<Child | undefined> {
        const childRepository = db.getRepository(Child);
        const child = await childRepository.findOne({ where: { child_id, deleted_at: IsNull() } });  
        return child ?? undefined;
    }

    async postChild(data: Child): Promise<Child | undefined> {
        const childRepository = db.getRepository(Child);  
        const result = await childRepository.save(data);  

        return result ? result : undefined; 
    }

    async putChild(child_id: number, data: Child): Promise<Child | undefined> {
        const childRepository = db.getRepository(Child); 
        const child = await childRepository.findOne({ where: { child_id, deleted_at: IsNull() } });

        if (child) {
            child.name = data.name || child.name;
            child.last_name = data.last_name || child.last_name;
            child.age = data.age || child.age;
            child.school = data.school || child.school;
            child.user = child.user;
            child.school_shift = data.school_shift || child.school_shift;
          
            await childRepository.save(child);
            return child;
        }

        return undefined;  
    }

    async deleteChild(child_id: number): Promise<boolean> {
        const childRepository = db.getRepository(Child);
        const child = await childRepository.findOne({ where: { child_id, deleted_at: IsNull() } });

        if (child) {
            child.deleted_at = new Date().toString();
            await childRepository.save(child);
            return true;
        }
        return false;
    }
}

export default new ChildService();
