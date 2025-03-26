import User from '../models/user';
import Token from '../models/token';
import { comparePassword } from '../utils/HashPassword';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs'
interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone_number?: string;
  asal_sekolah: string;
  isActive: boolean;
}

export class AuthService {
  // Registrasi pengguna baru
  async register(data: RegisterData): Promise<User> {
    // Periksa apakah email sudah terdaftar
    const existingUser = await User.findOne({ 
      where: { email: data.email } 
    });

    if (existingUser) {
      const error: any = new Error('Email sudah terdaftar');
      error.statusCode = 409;
      throw error;
    }

    // Buat pengguna baru
    const user = await User.create({
      name: data.name,
      email: data.email,
      password: data.password,
      phone_number: data.phone_number,
      asal_sekolah: data.asal_sekolah
    });

    return user;
  }

  // Login pengguna
  async login(email: string, password: string) {
    // Cari pengguna berdasarkan email
    const user = await User.findOne({ where: { email } });
  
    // Cek apakah pengguna ada dan passwordnya benar
    if (!user || !(await bcrypt.compare(password, user.password))) {
      const error: any = new Error('Email atau password salah');
      error.statusCode = 401;
      throw error;
    }
  
    // Jika pengguna sudah aktif
    if (user.isActive) {
      // Berikan notifikasi bahwa akun sudah aktif
      return {
        user,
        message: 'Akun Anda sudah aktif. Silakan periksa akun Anda.',
        accessToken: this.generateAccessToken(user),
        refreshToken: this.generateRefreshToken(user)
      };
    }
  
    // Jika pengguna belum aktif, set isActive menjadi true
    user.isActive = true;
    await user.save(); // Simpan perubahan ke database
  
    // Buat token (accessToken dan refreshToken)
    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user);
  
    return {
      user,
      message: 'Akun Anda berhasil diaktifkan.',
      accessToken,
      refreshToken
    };
  }

  // Refresh token
  async refreshToken(refreshToken: string) {
    try {
      // Verifikasi refresh token
      const decoded = jwt.verify(
        refreshToken, 
        process.env.REFRESH_TOKEN_SECRET!
      ) as { id: number };

      // Cari token di database
      const tokenRecord = await Token.findOne({
        where: { token: refreshToken },
        include: [{ model: User, as: 'user' }]
      });

      if (!tokenRecord || tokenRecord.expiresAt < new Date()) {
        const error: any = new Error('Token tidak valid');
        error.statusCode = 401;
        throw error;
      }

      const user = await User.findByPk(tokenRecord.UserId);

      if (!user) {
        const error: any = new Error('Pengguna tidak ditemukan');
        error.statusCode = 404;
        throw error;
      }

      // Generate token baru
      const newAccessToken = this.generateAccessToken(user);
      const newRefreshToken = this.generateRefreshToken(user);

      // Update token di database
      await tokenRecord.update({
        token: newRefreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      });

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken
      };
    } catch (error: any) {
      const customError: any = new Error('Gagal memperbarui token');
      customError.statusCode = 401;
      throw customError;
    }
  }

  async logout(userId?: number) {
    if (!userId) {
      const error: any = new Error('ID pengguna tidak valid');
      error.statusCode = 400;
      throw error;
    }
  
    // Hapus semua token milik pengguna
    await Token.destroy({
      where: { userId }
    });
  
    // Set isActive menjadi false
    const user = await User.findByPk(userId);
    if (user) {
      user.isActive = false; // Ubah status isActive menjadi false
      await user.save(); // Simpan perubahan ke database
    }
  }

  // Generate Access Token
  private generateAccessToken(user: User): string {
    return jwt.sign(
      { 
        id: user.id, 
        email: user.email 
      }, 
      process.env.ACCESS_TOKEN_SECRET!, 
      { expiresIn: '15m' }
    );
  }

  // Generate Refresh Token
  private generateRefreshToken(user: User): string {
    return jwt.sign(
      { 
        id: user.id 
      }, 
      process.env.REFRESH_TOKEN_SECRET!, 
      { expiresIn: '7d' }
    );
  }
}