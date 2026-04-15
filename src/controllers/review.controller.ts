// src/controllers/review.controller.ts

import { Request, Response } from 'express';
import prisma from '../prisma';
import { AuthRequest } from '../middlewares/auth.middleware';

// GET reviews
export const getReviews = async (req: Request, res: Response) => {
  try {
    const kosId = Number(req.params.kosId);

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

// POST review
export const createReview = async (req: AuthRequest, res: Response) => {
  try {
    const kosId = Number(req.params.kosId);
    const { comment, rating } = req.body;

    const review = await prisma.review.create({
      data: {
        comment,
        rating,
        user: { connect: { id: req.user.id } }, // ✅ FIX
        kos: { connect: { id: kosId } }, // ✅ FIX
      },
    });

    res.status(201).json({ message: 'Review berhasil', review });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};