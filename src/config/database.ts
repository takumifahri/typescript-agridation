import dotenv from 'dotenv';
import { Sequelize } from 'sequelize';

dotenv.config();

console.log("DB_HOST:", process.env.DB_HOST);
console.log("DB_USER:", process.env.DB_USER);
console.log("DB_NAME:", process.env.DB_NAME);
console.log("DB_PORT:", process.env.DB_PORT);

export const db = new Sequelize(
    process.env.DB_NAME as string,  // Nama database
    process.env.DB_USER as string,  // Username MySQL
    process.env.DB_PASSWORD as string,  // Password
    {
      host: process.env.DB_HOST,
      dialect: 'mysql', // Sesuaikan dengan database yang digunakan
      port: Number(process.env.DB_PORT),
      logging: console.log, // Matikan logging query SQL di terminal
    }
);

// Cek koneksi
db
  .authenticate()
  .then(() => console.log('Database connected!'))
  .catch((err) => console.error('Database connection failed:', err));
