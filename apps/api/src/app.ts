import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { authRoutes } from './modules/auth/auth.routes';
import productRoutes from './modules/products/products.routes';
import rfqRoutes from './modules/rfq/rfq.routes';
import userRoutes from './modules/users/users.routes';
import orderRoutes from './modules/orders/orders.routes';
import referralRoutes from './modules/referrals/referrals.routes';
import walletRoutes from './modules/wallet-ledger/wallet.routes';
import aiRoutes from './modules/ai/ai.routes';

export const app = express();

const defaultOrigins = ['http://localhost:3000', 'http://127.0.0.1:3000'];
const allowedOrigins = (process.env.ALLOWED_ORIGINS || defaultOrigins.join(','))
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

// Security & Middleware
app.use(helmet());
app.use(
    cors({
        credentials: true,
        origin(origin, callback) {
            if (!origin || allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
                callback(null, true);
                return;
            }

            callback(new Error(`CORS origin not allowed: ${origin}`));
        },
    }),
);
app.use(express.json());

// Request Logger Middleware
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Health Check
const healthCheck = (req: Request, res: Response) => {
    res.json({ status: 'ok', service: 'banda-chao-api' });
};

app.get('/health', healthCheck);
app.get('/api/health', healthCheck);

// API Routes
const apiRouter = express.Router();

apiRouter.use('/auth', authRoutes);
apiRouter.use('/users', userRoutes);
apiRouter.use('/products', productRoutes);
apiRouter.use('/orders', orderRoutes);
apiRouter.use('/referrals', referralRoutes);
apiRouter.use('/wallets', walletRoutes);
apiRouter.use('/ai', aiRoutes);
apiRouter.use('/rfq', rfqRoutes);

app.use('/api', apiRouter);

// Legacy mounts retained for existing local clients and older docs.
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/referrals', referralRoutes);
app.use('/wallets', walletRoutes);
app.use('/ai', aiRoutes);
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
