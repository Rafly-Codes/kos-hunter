// src/controllers/review.controller.ts

import { Request, Response } from 'express';
import prisma from '../prisma';
import { AuthRequest } from '../middlewares/auth.middleware';

// GET /kos/:kosId/reviews
export const getReviews = async (req: Request, res: Response) => {
  try {
    const kosId = Number(req.params.kosId as string);

    const reviews = await prisma.review.findMany({
      where: { kosId },
      include: {
        user: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// POST /kos/:kosId/reviews — society only
export const createReview = async (req: AuthRequest, res: Response) => {
  try {
    const kosId = Number(req.params.kosId as string);
    const { comment } = req.body;

    const kos = await prisma.kos.findUnique({ where: { id: kosId } });
    if (!kos) {
      res.status(404).json({ message: 'Kos tidak ditemukan' });
      return;
    }

    const review = await prisma.review.create({
      data: {
        kosId,
        userId: req.user.id,
        comment,
      },
    });

    res.status(201).json({ message: 'Review berhasil ditambahkan', review });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// DELETE /kos/:kosId/reviews/:id — society (pemilik review) only
export const deleteReview = async (req: AuthRequest, res: Response) => {
  try {
    const id = Number(req.params.id as string);

    const review = await prisma.review.findUnique({ where: { id } });
    if (!review) {
      res.status(404).json({ message: 'Review tidak ditemukan' });
      return;
    }

    if (review.userId !== req.user.id) {
      res.status(403).json({ message: 'Bukan review milik Anda' });
      return;
    }

    await prisma.review.delete({ where: { id } });
    res.json({ message: 'Review berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};