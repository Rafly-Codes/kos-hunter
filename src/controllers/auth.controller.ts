// src/controllers/auth.controller.ts

import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../prisma';

// REGISTER
export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, phone, role } = req.body;

    // cek email
    const existing = await prisma.user.findUnique({
      where: { email },
    });

      if (existing) {
      return res.status(400).json({
        message: 'Email sudah terdaftar',
      });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phone,
        role: role ?? 'USER', // ✅ FIX DISINI
      },
    });

    const { password: _, ...result } = user;

    res.status(201).json({
      message: 'Registrasi berhasil',
      user: result,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error,
    });
  }
};

// LOGIN
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // cek user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({
        message: 'Email atau password salah',
      });
    }

    // cek password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: 'Email atau password salah',
      });
    }

    // generate token
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role, // ✅ penting buat auth
      },
      process.env.JWT_SECRET || 'secret_key',
      { expiresIn: '7d' }
    );

    const { password: _, ...result } = user;

    res.json({
      message: 'Login berhasil',
      access_token: token,
      user: result,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error,
    });
  }
};