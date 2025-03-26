"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const user_1 = __importDefault(require("../models/user"));
const token_1 = __importDefault(require("../models/token"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
class AuthService {
    // Registrasi pengguna baru
    register(data) {
        return __awaiter(this, void 0, void 0, function* () {
            // Periksa apakah email sudah terdaftar
            const existingUser = yield user_1.default.findOne({
                where: { email: data.email }
            });
            if (existingUser) {
                const error = new Error('Email sudah terdaftar');
                error.statusCode = 409;
                throw error;
            }
            // Buat pengguna baru
            const user = yield user_1.default.create({
                name: data.name,
                email: data.email,
                password: data.password,
                phone_number: data.phone_number,
                asal_sekolah: data.asal_sekolah
            });
            return user;
        });
    }
    // Login pengguna
    login(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            // Cari pengguna berdasarkan email
            const user = yield user_1.default.findOne({ where: { email } });
            // Cek apakah pengguna ada dan passwordnya benar
            if (!user || !(yield bcryptjs_1.default.compare(password, user.password))) {
                const error = new Error('Email atau password salah');
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
            yield user.save(); // Simpan perubahan ke database
            // Buat token (accessToken dan refreshToken)
            const accessToken = this.generateAccessToken(user);
            const refreshToken = this.generateRefreshToken(user);
            return {
                user,
                message: 'Akun Anda berhasil diaktifkan.',
                accessToken,
                refreshToken
            };
        });
    }
    // Refresh token
    refreshToken(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Verifikasi refresh token
                const decoded = jsonwebtoken_1.default.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
                // Cari token di database
                const tokenRecord = yield token_1.default.findOne({
                    where: { token: refreshToken },
                    include: [{ model: user_1.default, as: 'user' }]
                });
                if (!tokenRecord || tokenRecord.expiresAt < new Date()) {
                    const error = new Error('Token tidak valid');
                    error.statusCode = 401;
                    throw error;
                }
                const user = yield user_1.default.findByPk(tokenRecord.UserId);
                if (!user) {
                    const error = new Error('Pengguna tidak ditemukan');
                    error.statusCode = 404;
                    throw error;
                }
                // Generate token baru
                const newAccessToken = this.generateAccessToken(user);
                const newRefreshToken = this.generateRefreshToken(user);
                // Update token di database
                yield tokenRecord.update({
                    token: newRefreshToken,
                    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                });
                return {
                    accessToken: newAccessToken,
                    refreshToken: newRefreshToken
                };
            }
            catch (error) {
                const customError = new Error('Gagal memperbarui token');
                customError.statusCode = 401;
                throw customError;
            }
        });
    }
    logout(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!userId) {
                const error = new Error('ID pengguna tidak valid');
                error.statusCode = 400;
                throw error;
            }
            // Hapus semua token milik pengguna
            yield token_1.default.destroy({
                where: { userId }
            });
            // Set isActive menjadi false
            const user = yield user_1.default.findByPk(userId);
            if (user) {
                user.isActive = false; // Ubah status isActive menjadi false
                yield user.save(); // Simpan perubahan ke database
            }
        });
    }
    // Generate Access Token
    generateAccessToken(user) {
        return jsonwebtoken_1.default.sign({
            id: user.id,
            email: user.email
        }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
    }
    // Generate Refresh Token
    generateRefreshToken(user) {
        return jsonwebtoken_1.default.sign({
            id: user.id
        }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
    }
}
exports.AuthService = AuthService;
