import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface IPayLoad{
    _id: string;
    iat: number;
    exp: number;
}

export const TokenValidation = (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.header('auth-token');
        if (!token) {
            res.status(401).json({ message: 'Access Denied' });
            return;
        }

        // 🔹 Verificar el token con el secreto
        const payload = jwt.verify(token, process.env.SECRET_TOKEN || 'tokentest') as IPayLoad;

        // 🔹 Guardar la información del usuario en la request
        req.userId = payload._id;

        // 🔹 Pasar al siguiente middleware
        next();
    } catch (error) {
        res.status(403).json({ message: 'Invalid token' });
    }
}

export default TokenValidation;