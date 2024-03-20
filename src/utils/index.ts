import CryptoJS from 'crypto-js';
import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from 'express';

// Encrypt function
export function apiKeyGen(text: string): string {
    return CryptoJS.AES.encrypt(text, process.env.SECRET_KEY as string).toString();
}

// Decrypt function
export function decryptApiKey(ciphertext: string): string {
    const bytes = CryptoJS.AES.decrypt(ciphertext, process.env.SECRET_KEY as string);
    return bytes.toString(CryptoJS.enc.Utf8);
}

// Middleware function to generate JWT token
export const generateToken = (payload: any): string => {
    console.log(payload);
    return jwt.sign(payload, process.env.SECRET_KEY as string, { expiresIn: '1h' }); // Token expires in 1 hour
};

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization; // Assuming token is in the format "Bearer <token>"
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    jwt.verify(token, process.env.SECRET_KEY as string, (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        req.user = decoded as any; // Add decoded user information to the request object
        next();
    });
};