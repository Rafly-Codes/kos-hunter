import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: any;
}

// 🔐 AUTHENTICATE (CEK TOKEN)
export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Token tidak ditemukan' });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_key');
    req.user = decoded;

    // 🔥 DEBUG (opsional, boleh hapus nanti)
    console.log('DECODED USER:', req.user);

    next();
  } catch {
    res.status(401).json({ message: 'Token tidak valid' });
  }
};

// 👑 OWNER ONLY
export const authorizeOwner = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user?.role?.toUpperCase() !== 'OWNER') {
    res.status(403).json({ message: 'Akses hanya untuk owner' });
    return;
  }
  next();
};

// 👤 USER ONLY
export const authorizeSociety = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user?.role?.toUpperCase() !== 'USER') {
    res.status(403).json({ message: 'Akses hanya untuk user' });
    return;
  }
  next();
};