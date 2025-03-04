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
    postUser(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield db_1.default.query("INSERT INTO user SET ?", data);
            if (result.insertId) {
                return yield this.getUserById(result.insertId);
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
