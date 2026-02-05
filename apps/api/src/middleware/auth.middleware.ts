import { Request, Response, NextFunction } from 'express';
import { verifyToken, TokenPayload } from '../lib/jwt';

export interface AuthRequest extends Request {
    user?: TokenPayload;
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized', code: 'AUTH_REQUIRED' });
    }

    const token = authHeader.split(' ')[1];
    const payload = verifyToken(token);

    if (!payload) {
        return res.status(401).json({ error: 'Invalid Token', code: 'AUTH_INVALID_TOKEN' });
    }

    req.user = payload;
    next();
};

export const authorize = (roles: string[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        if (!req.user) return res.sendStatus(401);

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ error: 'Forbidden', code: 'AUTH_FORBIDDEN' });
        }

        next();
    };
};
