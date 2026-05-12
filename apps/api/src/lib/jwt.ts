import jwt from 'jsonwebtoken';

const DEV_ONLY_SECRET = 'dev-only-fallback-secret';
const EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

function getSecret(): string {
    if (process.env.JWT_SECRET) {
        return process.env.JWT_SECRET;
    }

    if (process.env.NODE_ENV === 'production') {
        throw new Error('JWT_SECRET is required in production');
    }

    return DEV_ONLY_SECRET;
}

export interface TokenPayload {
    userId: string;
    email: string;
    role: string;
}

export const signToken = (payload: TokenPayload): string => {
    return jwt.sign(payload, getSecret(), { expiresIn: EXPIRES_IN as jwt.SignOptions['expiresIn'] });
};

export const verifyToken = (token: string): TokenPayload | null => {
    try {
        return jwt.verify(token, getSecret()) as TokenPayload;
    } catch (error) {
        return null;
    }
};
