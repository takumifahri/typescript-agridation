import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { AuthService } from '../services/AuthService';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  // Registrasi pengguna baru
  async register(req: Request, res: Response): Promise<void> {
    try {
      // Validasi input dari express-validator
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ 
          status: 'error', 
          errors: errors.array() 
        });
        return;
      }
  
      const { 
        name, 
        email, 
        password, 
        phone_number, 
        asal_sekolah 
      } = req.body;
  
      // Proses registrasi
      const user = await this.authService.register({
        name,
        email,
        password,
        phone_number,
        asal_sekolah,
        isActive: false // Set isActive menjadi false saat pendaftaran
      });
  
      res.status(201).json({
        status: 'success',
        message: 'Pengguna berhasil didaftarkan, tetapi belum aktif.',
        data: {
            id: user.id,
            name: user.name,
            email: user.email,
            phone_number: user.phone_number,
            asal_sekolah: user.asal_sekolah,
            isActive: user.isActive
        }
      });
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        status: 'error',
        message: error.message || 'Gagal mendaftarkan pengguna'
      });
    }
  }

  // Login pengguna
  async login(req: Request, res: Response): Promise<void> {
    try {
      // Validasi input dari express-validator
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ 
          status: 'error', 
          errors: errors.array() 
        });
        return;
      }
  
      const { email, password } = req.body;
  
      // Proses login
      const loginResult = await this.authService.login(email, password);
  
    res.status(200).json({
      status: 'success',
      message: loginResult.message, // Ambil pesan dari loginResult
      data: {
        user: {
            id: loginResult.user.id,
            name: loginResult.user.name,
            email: loginResult.user.email,
            phone_number: loginResult.user.phone_number,
            asal_sekolah: loginResult.user.asal_sekolah,
            isActive: loginResult.user.isActive
        },
        tokens: {
            accessToken: loginResult.accessToken,
            refreshToken: loginResult.refreshToken
        }
      }
    });
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        status: 'error',
        message: error.message || 'Gagal login'
      });
    }
  }

  // Refresh token
  async refreshToken(req: Request, res: Response) {
    try {
      const { refreshToken } = req.body;

      const newTokens = await this.authService.refreshToken(refreshToken);

      res.status(200).json({
        status: 'success',
        message: 'Token berhasil diperbarui',
        data: {
          accessToken: newTokens.accessToken,
          refreshToken: newTokens.refreshToken
        }
      });
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        status: 'error',
        message: error.message || 'Gagal memperbarui token'
      });
    }
  }

  // Logout
  async logout(req: Request, res: Response) {
    try {
      const userId = req.user?.id; // Diasumsikan middleware autentikasi menambahkan user ke request
      
      await this.authService.logout(userId);
  
      res.status(200).json({
        status: 'success',
        message: 'Logout berhasil'
      });
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        status: 'error',
        message: error.message || 'Gagal logout'
      });
    }
  }
}