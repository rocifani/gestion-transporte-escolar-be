"use strict";
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
            const users = yield db_1.default.query("SELECT * FROM user");
            return users;
        });
    }
    getUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield db_1.default.query("SELECT * FROM user WHERE id = ?", id);
            if (Array.isArray(user) && user.length > 0) {
                return user[0];
            }
            return undefined;
        });
    }
    login(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield db_1.default.query("SELECT * FROM user WHERE email = ?", email);
            if (user.length > 0) {
                const passMatch = yield bcryptjs_1.default.compare(password, user[0].password);
                if (passMatch) {
                    return user[0];
                }
            }
            return undefined;
        });
    }
    signup(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const userInstance = new user_1.User();
            data.password = yield userInstance.encryptPassword(data.password);
            const result = yield db_1.default.query("INSERT INTO user SET ?", data);
            if (result.insertId) {
                return yield this.getUserById(result.insertId);
            }
            return undefined;
        });
    }
    getUserByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield db_1.default.query("SELECT * FROM user WHERE email = ?", email);
            if (Array.isArray(user) && user.length > 0) {
                return user[0];
            }
            return undefined;
        });
    }
    putUser(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield db_1.default.query("UPDATE user SET ? WHERE id = ?", [data, id]);
            if (result.affectedRows) {
                return yield this.getUserById(id);
            }
            return undefined;
        });
    }
}
exports.default = new UserService();
