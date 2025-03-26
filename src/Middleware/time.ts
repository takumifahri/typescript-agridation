import { Request, Response, NextFunction } from "express";

export function time( req:Request, res:Response, next:NextFunction ) {
    // console.log(`Time: ${new Date().toLocaleString()}`);
    req.timestamp = Date.now();
    next();
}