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
exports.AuthMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = __importDefault(require("../models/user"));
class AuthMiddleware {
    // Middleware untuk memverifikasi access token
    static authenticate(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
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
                const decoded = jsonwebtoken_1.default.verify(token, process.env.ACCESS_TOKEN_SECRET);
                // Cari pengguna
                const user = yield user_1.default.findOne({
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
            }
            catch (error) {
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
        });
    }
    // Middleware untuk otorisasi admin (opsional)
    static adminOnly(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
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
            }
            catch (error) {
                res.status(500).json({
                    status: 'error',
                    message: 'Kesalahan server'
                });
            }
        });
    }
    static Penilaian(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Pastikan pengguna sudah terautentikasi
                if (req.user) {
                    if (req.user.role === 'juri') {
                        next();
                    }
                    else {
                        return res.status(403).json({
                            status: 'error',
                            message: 'Akses ditolak'
                        });
                    }
                }
                else {
                    return res.status(401).json({
                        status: 'error',
                        message: 'Tidak terautentikasi'
                    });
                }
            }
            catch (error) {
                res.status(500).json({
                    status: 'error',
                    message: 'Kesalahan server'
                });
            }
        });
    }
}
exports.AuthMiddleware = AuthMiddleware;
