import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface IPayLoad{
    _id: string;
    iat: number;
    exp: number;
}

export const TokenValidation = (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.header('Authorization')?.split(' ')[1];
        if (!token) {
            res.status(401).json({ message: 'Access Denied' });
            return;
        }
        const payload = jwt.verify(token, process.env.SECRET_TOKEN || 'tokentest') as IPayLoad;
        req.userId = payload._id;

        next();
    } catch (error) {
        res.status(403).json({ message: 'Invalid token' });
    }
}

export default TokenValidation;