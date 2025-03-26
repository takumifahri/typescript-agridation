"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const sequelize_1 = require("sequelize");
dotenv_1.default.config();
console.log("DB_HOST:", process.env.DB_HOST);
console.log("DB_USER:", process.env.DB_USER);
console.log("DB_NAME:", process.env.DB_NAME);
console.log("DB_PORT:", process.env.DB_PORT);
exports.db = new sequelize_1.Sequelize(process.env.DB_NAME, // Nama database
process.env.DB_USER, // Username MySQL
process.env.DB_PASSWORD, // Password
{
    host: process.env.DB_HOST,
    dialect: 'mysql', // Sesuaikan dengan database yang digunakan
    port: Number(process.env.DB_PORT),
    logging: console.log, // Matikan logging query SQL di terminal
});
// Cek koneksi
exports.db
    .authenticate()
    .then(() => console.log('Database connected!'))
    .catch((err) => console.error('Database connection failed:', err));
