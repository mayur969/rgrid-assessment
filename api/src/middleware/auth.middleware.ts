import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../../env";

export interface AuthRequest extends Request {
    admin?: any;
}
export const protectAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "Unauthorized", });
        }
        const decoded = jwt.verify(token, env.JWT_SECRET);
        
        req.admin = decoded; 
        
        next();

    } catch (error) {
        return res.status(401).json({ message: "Invalid token", });
    }
};