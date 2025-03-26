import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user';

// Extend Request interface untuk menambahkan user
declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

export class AuthMiddleware {
  // Middleware untuk memverifikasi access token
  static async authenticate(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Ambil token dari header
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({
          status: 'error',
          message: 'Token tidak tersedia'
        });
        return;
      }

      const token = authHeader.split(' ')[1];

      // Verifikasi token
      const decoded = jwt.verify(
        token, 
        process.env.ACCESS_TOKEN_SECRET!
      ) as { id: number, email: string };

      // Cari pengguna
      const user = await User.findOne({
        where: { 
          id: decoded.id, 
          email: decoded.email,
          isActive: true 
        }
      });

      if (!user) {
        res.status(401).json({
          status: 'error',
          message: 'Pengguna tidak valid'
        });
        return;
      }

      // Tambahkan informasi pengguna ke request
      req.user = user;
      next();
    } catch (error: any) {
      if (error.name === 'TokenExpiredError') {
        res.status(401).json({
          status: 'error',
          message: 'Token kedaluwarsa'
        });
        return;
      }

      res.status(401).json({
        status: 'error',
        message: 'Tidak terautentikasi'
      });
    }
  }

  // Middleware untuk otorisasi admin (opsional)
  static async adminOnly(req: Request, res: Response, next: NextFunction) {
    try {
      // Pastikan pengguna sudah terautentikasi
      if (!req.user) {
        return res.status(401).json({
          status: 'error',
          message: 'Tidak terautentikasi'
        });
      }

      // Tambahkan logika pengecekan admin di sini
      // Misalnya dengan menambahkan kolom role di model User
      if (req.user.role !== 'admin') {
        return res.status(403).json({
          status: 'error',
          message: 'Akses ditolak'
        });
      }

      next();
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: 'Kesalahan server'
      });
    }
  }
}