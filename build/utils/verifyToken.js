"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenValidation = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const TokenValidation = (req, res, next) => {
    try {
        const token = req.header('Authorization')?.split(' ')[1];
        if (!token) {
            res.status(401).json({ message: 'Access Denied' });
            return;
        }
        const payload = jsonwebtoken_1.default.verify(token, process.env.SECRET_TOKEN || 'tokentest');
        req.userId = payload._id;
        next();
    }
    catch (error) {
        res.status(403).json({ message: 'Invalid token' });
    }
};
exports.TokenValidation = TokenValidation;
exports.default = exports.TokenValidation;
