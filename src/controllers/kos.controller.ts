// src/controllers/kos.controller.ts

import { Request, Response } from 'express';
import prisma from '../prisma';
import { AuthRequest } from '../middlewares/auth.middleware';

// GET /kos?gender=male
export const getAllKos = async (req: Request, res: Response) => {
  try {
    const { gender } = req.query;

    const kos = await prisma.kos.findMany({
      where: gender ? { gender: gender as any } : {},
      include: {
        images: true,
        fasilities: true,
        user: { select: { id: true, name: true, phone: true } },
      },
    });

    res.json(kos);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// GET /kos/my
export const getMyKos = async (req: AuthRequest, res: Response) => {
  try {
    const kos = await prisma.kos.findMany({
      where: { userId: req.user.id },
      include: {
        images: true,
        fasilities: true,
      },
    });

    res.json(kos);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// GET /kos/:id
export const getKosById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id as string);

    const kos = await prisma.kos.findUnique({
      where: { id },
      include: {
        images: true,
        fasilities: true,
        reviews: {
          include: {
            user: { select: { id: true, name: true } },
          },
        },
        user: { select: { id: true, name: true, phone: true } },
      },
    });

    if (!kos) {
      res.status(404).json({ message: 'Kos tidak ditemukan' });
      return;
    }

    res.json(kos);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// POST /kos
export const createKos = async (req: AuthRequest, res: Response) => {
  try {
    const { name, address, pricePerMonth, gender } = req.body;

    const kos = await prisma.kos.create({
      data: {
        userId: req.user.id,
        name,
        address,
        pricePerMonth,
        gender,
      },
    });

    res.status(201).json({ message: 'Kos berhasil dibuat', kos });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// PUT /kos/:id
export const updateKos = async (req: AuthRequest, res: Response) => {
  try {
    const id = Number(req.params.id as string);
    const { name, address, pricePerMonth, gender } = req.body;

    const kos = await prisma.kos.findUnique({ where: { id } });
    if (!kos) {
      res.status(404).json({ message: 'Kos tidak ditemukan' });
      return;
    }

    if (kos.userId !== req.user.id) {
      res.status(403).json({ message: 'Bukan kos milik Anda' });
      return;
    }

    const updated = await prisma.kos.update({
      where: { id },
      data: { name, address, pricePerMonth, gender },
    });

    res.json({ message: 'Kos berhasil diupdate', kos: updated });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// DELETE /kos/:id
export const deleteKos = async (req: AuthRequest, res: Response) => {
  try {
    const id = Number(req.params.id as string);

    const kos = await prisma.kos.findUnique({ where: { id } });
    if (!kos) {
      res.status(404).json({ message: 'Kos tidak ditemukan' });
      return;
    }

    if (kos.userId !== req.user.id) {
      res.status(403).json({ message: 'Bukan kos milik Anda' });
      return;
    }

    await prisma.kos.delete({ where: { id } });
    res.json({ message: 'Kos berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};