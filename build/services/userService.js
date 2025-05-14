"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("../database/db"));
const user_1 = require("../models/user");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
class UserService {
    getAllUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            const userRepository = db_1.default.getRepository(user_1.User);
            return yield userRepository.find();
        });
    }
    getUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const userRepository = db_1.default.getRepository(user_1.User);
            const user = yield userRepository.findOne({ where: { id } });
            return user !== null && user !== void 0 ? user : undefined;
        });
    }
    login(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const userRepository = db_1.default.getRepository(user_1.User);
            const user = yield userRepository.findOne({ where: { email } });
            if (user && (yield bcryptjs_1.default.compare(password, user.password))) {
                return user;
            }
            return undefined;
        });
    }
    confirmUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const userRepository = db_1.default.getRepository(user_1.User);
            const user = yield userRepository.findOne({ where: { id } });
            if (user) {
                user.is_confirmed = true;
                yield userRepository.save(user);
                return user;
            }
            return undefined;
        });
    }
    signup(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const userRepository = db_1.default.getRepository(user_1.User);
            data.password = yield bcryptjs_1.default.hash(data.password, 10);
            const result = yield userRepository.save(data);
            return result ? result : undefined;
        });
    }
    signUpWithGoogle(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const userRepository = db_1.default.getRepository(user_1.User);
            const result = yield userRepository.save(data);
            return result ? result : undefined;
        });
    }
    getUserByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const userRepository = db_1.default.getRepository(user_1.User);
            const user = yield userRepository.findOne({ where: { email } });
            return user !== null && user !== void 0 ? user : undefined;
        });
    }
    putUser(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const userRepository = db_1.default.getRepository(user_1.User);
            const user = yield userRepository.findOne({ where: { id } });
            if (user) {
                user.email = data.email || user.email;
                user.password = data.password ? yield bcryptjs_1.default.hash(data.password, 10) : user.password;
                user.full_name = data.full_name || user.full_name;
                user.phone_number = data.phone_number || user.phone_number;
                user.address = data.address || user.address;
                user.profile_picture = data.profile_picture || user.profile_picture;
                user.birth_date = data.birth_date || user.birth_date;
                user.role_id = data.role_id || user.role_id;
                user.dni = data.dni || user.dni;
                yield userRepository.save(user);
                return user;
            }
            return undefined;
        });
    }
    forgotPassword(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const userRepository = db_1.default.getRepository(user_1.User);
            const user = yield userRepository.findOne({ where: { email } });
            return user !== null && user !== void 0 ? user : undefined;
        });
    }
    getAdminUser() {
        return __awaiter(this, void 0, void 0, function* () {
            const userRepository = db_1.default.getRepository(user_1.User);
            const adminUser = yield userRepository.findOne({ where: { role_id: 3 } });
            return adminUser !== null && adminUser !== void 0 ? adminUser : undefined;
        });
    }
}
exports.default = new UserService();
