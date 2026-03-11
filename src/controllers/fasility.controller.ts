// src/controllers/fasility.controller.ts

import { Response } from 'express';
import prisma from '../prisma';
import { AuthRequest } from '../middlewares/auth.middleware';

// GET /kos/:kosId/fasilities
export const getFasilities = async (req: AuthRequest, res: Response) => {
  try {
    const kosId = Number(req.params.kosId as string);

    const fasilities = await prisma.kosFasility.findMany({
      where: { kosId },
    });

    res.json(fasilities);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// POST /kos/:kosId/fasilities
export const createFasility = async (req: AuthRequest, res: Response) => {
  try {
    const kosId = Number(req.params.kosId as string);
    const { fasility } = req.body;

    // Cek kos milik owner yang login
    const kos = await prisma.kos.findUnique({ where: { id: kosId } });
    if (!kos) {
      res.status(404).json({ message: 'Kos tidak ditemukan' });
      return;
    }
    if (kos.userId !== req.user.id) {
      res.status(403).json({ message: 'Bukan kos milik Anda' });
      return;
    }

    const newFasility = await prisma.kosFasility.create({
      data: { kosId, fasility },
    });

    res.status(201).json({ message: 'Fasilitas berhasil ditambahkan', fasility: newFasility });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// PUT /kos/:kosId/fasilities/:id
export const updateFasility = async (req: AuthRequest, res: Response) => {
  try {
    const id = Number(req.params.id as string);
    const kosId = Number(req.params.kosId as string);
    const { fasility } = req.body;

    // Cek kos milik owner yang login
    const kos = await prisma.kos.findUnique({ where: { id: kosId } });
    if (!kos) {
      res.status(404).json({ message: 'Kos tidak ditemukan' });
      return;
    }
    if (kos.userId !== req.user.id) {
      res.status(403).json({ message: 'Bukan kos milik Anda' });
      return;
    }

    const updated = await prisma.kosFasility.update({
      where: { id },
      data: { fasility },
    });

    res.json({ message: 'Fasilitas berhasil diupdate', fasility: updated });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// DELETE /kos/:kosId/fasilities/:id
export const deleteFasility = async (req: AuthRequest, res: Response) => {
  try {
    const id = Number(req.params.id as string);
    const kosId = Number(req.params.kosId as string);

    // Cek kos milik owner yang login
    const kos = await prisma.kos.findUnique({ where: { id: kosId } });
    if (!kos) {
      res.status(404).json({ message: 'Kos tidak ditemukan' });
      return;
    }
    if (kos.userId !== req.user.id) {
      res.status(403).json({ message: 'Bukan kos milik Anda' });
      return;
    }

    await prisma.kosFasility.delete({ where: { id } });
    res.json({ message: 'Fasilitas berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};