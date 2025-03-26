import dotenv from 'dotenv';
import express from 'express';
import { AuthRoutes } from './routes/API/AuthApi';
// Memuat variabel environment
dotenv.config();

const app = express();

// Cek apakah secret sudah terisi
if (!process.env.ACCESS_TOKEN_SECRET || !process.env.REFRESH_TOKEN_SECRET) {
  console.error('FATAL: Token secrets belum dikonfigurasi!');
  process.exit(1);
}

// Middleware untuk parsing JSON
app.use(express.json());

// Gunakan routes
app.use('/api/auth', AuthRoutes);

// Error handler global
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
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

export default app;