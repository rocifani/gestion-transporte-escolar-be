import db from "../database/db";
import { User } from "../models/user";
import bcrypt from "bcrypt";

class UserService {

    async getAllUsers(): Promise<User[]> {
        const userRepository = db.getRepository(User);
        return await userRepository.find();  
    }

    async getUserById(id: number): Promise<User | undefined> {
        const userRepository = db.getRepository(User);  
        const user = await userRepository.findOne({ where: { id } });  
        return user ?? undefined;
    }

    async login(email: string, password: string): Promise<User | undefined> {
        const userRepository = db.getRepository(User);  
        const user = await userRepository.findOne({ where: { email } });  
        if (user && await bcrypt.compare(password, user.password)) {
            return user;
        }
        return undefined;
    }

    async confirmUser(id: number): Promise<User | undefined> {
        const userRepository = db.getRepository(User);
        const user = await userRepository.findOne({ where: { id } });
    
        if (user) {
            user.is_confirmed = true;
            await userRepository.save(user);
            return user;
        }
    
        return undefined;
    }    

    async signup(data: User): Promise<User | undefined> {
        const userRepository = db.getRepository(User);  

        data.password = await bcrypt.hash(data.password, 10);  
        const result = await userRepository.save(data);  

        return result ? result : undefined;  
    }

    async getUserByEmail(email: string): Promise<User | undefined> {
        const userRepository = db.getRepository(User); 
        const user = await userRepository.findOne({ where: { email } }); 
        return user ?? undefined;
    }

    async putUser(id: number, data: User): Promise<User | undefined> {
        const userRepository = db.getRepository(User); 
        const user = await userRepository.findOne({ where: { id } });

        if (user) {
     
            user.email = data.email || user.email;
            user.password = data.password ? await bcrypt.hash(data.password, 10) : user.password;
            user.full_name = data.full_name || user.full_name;
            user.phone_number = data.phone_number || user.phone_number;
            user.address = data.address || user.address;
            user.updated_at = new Date().toISOString();  
            user.profile_picture = data.profile_picture || user.profile_picture;
            user.birth_date = data.birth_date || user.birth_date;

            await userRepository.save(user);
            return user;
        }

        return undefined;  
    }

    

    // TO DO: implementar delete. No se si hacer un borrado definitivo o un borrado lógico.

}

export default new UserService();