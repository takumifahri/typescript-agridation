"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const AuthApi_1 = require("./routes/API/AuthApi");
// Memuat variabel environment
dotenv_1.default.config();
const app = (0, express_1.default)();
// Cek apakah secret sudah terisi
if (!process.env.ACCESS_TOKEN_SECRET || !process.env.REFRESH_TOKEN_SECRET) {
    console.error('FATAL: Token secrets belum dikonfigurasi!');
    process.exit(1);
}
// Middleware untuk parsing JSON
app.use(express_1.default.json());
// Gunakan routes
app.use('/api/auth', AuthApi_1.AuthRoutes);
// Error handler global
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({
        status: 'error',
        message: err.message || 'Terjadi kesalahan internal'
    });
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});
exports.default = app;
