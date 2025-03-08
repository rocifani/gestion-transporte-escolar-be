import db from "../database/db";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import { User } from "../models/user";

class UserService {

    async getAllUsers(): Promise<User[]> {
        const users = await db.query<RowDataPacket[]>("SELECT * FROM user");
        return users as User[];
    }

    async getUserById(id: number): Promise<User | undefined> {
        const user = await db.query<RowDataPacket[]>("SELECT * FROM user WHERE id = ?", id);
        if(Array.isArray(user) && user.length > 0){
            return user[0] as User;
        }
        return undefined;
    }

    async getUserByEmail(email: string): Promise<User | undefined> {
        const user = await db.query<RowDataPacket[]>("SELECT * FROM user WHERE email = ?", email);
        if(Array.isArray(user) && user.length > 0){
            return user[0] as User;
        }
        return undefined;
    }

    async postUser(data: User): Promise<User | undefined> {
        const result = await db.query<ResultSetHeader>("INSERT INTO user SET ?", data);
        if(result.insertId){
            return await this.getUserById(result.insertId);
        }
        return undefined;
    }

    async putUser(id: number, data: User): Promise<User | undefined> {
        const result = await db.query<ResultSetHeader>("UPDATE user SET ? WHERE id = ?", [data, id]);
        if(result.affectedRows){
            return await this.getUserById(id);
        }
        return undefined;
    }

    // TO DO: implementar delete. No se si hacer un borrado definitivo o un borrado lógico.

}

export default new UserService();