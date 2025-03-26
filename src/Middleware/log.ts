import { Request, Response, NextFunction } from "express";
// Middleware
export function logger(req: Request, res: Response, next: NextFunction ) {
    console.log(`${req.timestamp} ${req.method} ${req.ip}${req.originalUrl}`);
    next(); // untuk seperti return pada middleware route
}