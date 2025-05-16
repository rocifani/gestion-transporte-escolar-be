"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("../database/db"));
const user_1 = require("../models/user");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
class UserService {
    async getAllUsers() {
        const userRepository = db_1.default.getRepository(user_1.User);
        return await userRepository.find();
    }
    async getUserById(id) {
        const userRepository = db_1.default.getRepository(user_1.User);
        const user = await userRepository.findOne({ where: { id } });
        return user ?? undefined;
    }
    async login(email, password) {
        const userRepository = db_1.default.getRepository(user_1.User);
        const user = await userRepository.findOne({ where: { email } });
        if (user && await bcryptjs_1.default.compare(password, user.password)) {
            return user;
        }
        return undefined;
    }
    async confirmUser(id) {
        const userRepository = db_1.default.getRepository(user_1.User);
        const user = await userRepository.findOne({ where: { id } });
        if (user) {
            user.is_confirmed = true;
            await userRepository.save(user);
            return user;
        }
        return undefined;
    }
    async signup(data) {
        const userRepository = db_1.default.getRepository(user_1.User);
        data.password = await bcryptjs_1.default.hash(data.password, 10);
        const result = await userRepository.save(data);
        return result ? result : undefined;
    }
    async signUpWithGoogle(data) {
        const userRepository = db_1.default.getRepository(user_1.User);
        const result = await userRepository.save(data);
        return result ? result : undefined;
    }
    async getUserByEmail(email) {
        const userRepository = db_1.default.getRepository(user_1.User);
        const user = await userRepository.findOne({ where: { email } });
        return user ?? undefined;
    }
    async putUser(id, data) {
        const userRepository = db_1.default.getRepository(user_1.User);
        const user = await userRepository.findOne({ where: { id } });
        if (user) {
            user.email = data.email || user.email;
            user.password = data.password ? await bcryptjs_1.default.hash(data.password, 10) : user.password;
            user.full_name = data.full_name || user.full_name;
            user.phone_number = data.phone_number || user.phone_number;
            user.address = data.address || user.address;
            user.profile_picture = data.profile_picture || user.profile_picture;
            user.birth_date = data.birth_date || user.birth_date;
            user.role_id = data.role_id || user.role_id;
            user.dni = data.dni || user.dni;
            await userRepository.save(user);
            return user;
        }
        return undefined;
    }
    async forgotPassword(email) {
        const userRepository = db_1.default.getRepository(user_1.User);
        const user = await userRepository.findOne({ where: { email } });
        return user ?? undefined;
    }
    async getAdminUser() {
        const userRepository = db_1.default.getRepository(user_1.User);
        const adminUser = await userRepository.findOne({ where: { role_id: 3 } });
        return adminUser ?? undefined;
    }
}
exports.default = new UserService();
