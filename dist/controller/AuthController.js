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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const express_validator_1 = require("express-validator");
const AuthService_1 = require("../services/AuthService");
class AuthController {
    constructor() {
        this.authService = new AuthService_1.AuthService();
    }
    // Registrasi pengguna baru
    register(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Validasi input dari express-validator
                const errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    res.status(400).json({
                        status: 'error',
                        errors: errors.array()
                    });
                    return;
                }
                const { name, email, password, phone_number, asal_sekolah } = req.body;
                // Proses registrasi
                const user = yield this.authService.register({
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
                        user
                    }
                });
            }
            catch (error) {
                res.status(error.statusCode || 500).json({
                    status: 'error',
                    message: error.message || 'Gagal mendaftarkan pengguna'
                });
            }
        });
    }
    // Login pengguna
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Validasi input dari express-validator
                const errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    res.status(400).json({
                        status: 'error',
                        errors: errors.array()
                    });
                    return;
                }
                const { email, password } = req.body;
                // Proses login
                const loginResult = yield this.authService.login(email, password);
                res.status(200).json({
                    status: 'success',
                    message: loginResult.message, // Ambil pesan dari loginResult
                    data: {
                        user: {
                            id: loginResult.user.id,
                            name: loginResult.user.name,
                            email: loginResult.user.email
                        },
                        tokens: {
                            accessToken: loginResult.accessToken,
                            refreshToken: loginResult.refreshToken
                        }
                    }
                });
            }
            catch (error) {
                res.status(error.statusCode || 500).json({
                    status: 'error',
                    message: error.message || 'Gagal login'
                });
            }
        });
    }
    // Refresh token
    refreshToken(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { refreshToken } = req.body;
                const newTokens = yield this.authService.refreshToken(refreshToken);
                res.status(200).json({
                    status: 'success',
                    message: 'Token berhasil diperbarui',
                    data: {
                        accessToken: newTokens.accessToken,
                        refreshToken: newTokens.refreshToken
                    }
                });
            }
            catch (error) {
                res.status(error.statusCode || 500).json({
                    status: 'error',
                    message: error.message || 'Gagal memperbarui token'
                });
            }
        });
    }
    // Logout
    logout(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id; // Diasumsikan middleware autentikasi menambahkan user ke request
                yield this.authService.logout(userId);
                res.status(200).json({
                    status: 'success',
                    message: 'Logout berhasil'
                });
            }
            catch (error) {
                res.status(error.statusCode || 500).json({
                    status: 'error',
                    message: error.message || 'Gagal logout'
                });
            }
        });
    }
}
exports.AuthController = AuthController;
