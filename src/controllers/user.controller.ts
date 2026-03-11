// src/controllers/user.controller.ts

import { Response } from 'express';
import prisma from '../prisma';
import { AuthRequest } from '../middlewares/auth.middleware';
import bcrypt from 'bcrypt';

// GET /users/me — lihat profile sendiri
export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, name: true, email: true, phone: true, role: true, createdAt: true },
    });

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// PUT /users/me — update profile sendiri
export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const { name, phone, password } = req.body;

    let hashedPassword;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    const updated = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        name,
        phone,
        ...(hashedPassword && { password: hashedPassword }),
      },
      select: { id: true, name: true, email: true, phone: true, role: true },
    });

    res.json({ message: 'Profile berhasil diupdate', user: updated });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};