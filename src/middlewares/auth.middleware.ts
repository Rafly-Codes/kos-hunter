// src/middlewares/auth.middleware.ts

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: any;
}

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
    next();
  } catch {
    res.status(401).json({ message: 'Token tidak valid' });
  }
};

export const authorizeOwner = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user?.role !== 'owner') {
    res.status(403).json({ message: 'Akses hanya untuk owner' });
    return;
  }
  next();
};

export const authorizeSociety = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user?.role !== 'society') {
    res.status(403).json({ message: 'Akses hanya untuk society' });
    return;
  }
  next();
};