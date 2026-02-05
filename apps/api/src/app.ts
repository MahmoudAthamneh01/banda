import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { authRoutes } from './modules/auth/auth.routes';
import productRoutes from './modules/products/products.routes';
import rfqRoutes from './modules/rfq/rfq.routes';

export const app = express();

// Security & Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Request Logger Middleware
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Health Check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', service: 'banda-chao-api' });
});

// API Routes
app.use('/auth', authRoutes);
app.use('/products', productRoutes);
app.use('/rfq', rfqRoutes);

// 404 Handler
app.use((req, res) => {
    res.status(404).json({ error: 'Not Found', code: 'ROUTE_NOT_FOUND' });
});

// Global Error Handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error', code: 'INTERNAL_ERROR' });
});
