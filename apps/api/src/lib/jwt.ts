import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET || 'fallback-secret';

export interface TokenPayload {
    userId: string;
    email: string;
    role: string;
}

export const signToken = (payload: TokenPayload): string => {
    return jwt.sign(payload, SECRET, { expiresIn: '7d' });
};

export const verifyToken = (token: string): TokenPayload | null => {
    try {
        return jwt.verify(token, SECRET) as TokenPayload;
    } catch (error) {
        return null;
    }
};
