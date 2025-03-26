import { Request, Response, NextFunction } from "express";
import { db } from "../config/database";

export const getUsers = async (req: Request, res: Response) => {
    try {
      const [rows] = await db.query('SELECT * FROM users');
      res.json(rows);
    } catch (error) {
      res.status(500).json({ error: 'Database error', details: error });
    }
};
