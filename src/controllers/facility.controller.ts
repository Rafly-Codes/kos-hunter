// src/controllers/fasility.controller.ts

import { Response } from 'express';
import prisma from '../prisma';
import { AuthRequest } from '../middlewares/auth.middleware';

export const getFasilities = async (req: AuthRequest, res: Response) => {
  try {
    const kosId = Number(req.params.kosId);

    const fasilities = await prisma.facility.findMany({
      where: { kosId },
    });

    res.json(fasilities);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const createFasility = async (req: AuthRequest, res: Response) => {
  try {
    const kosId = Number(req.params.kosId);
    const { name } = req.body;

    const newFasility = await prisma.facility.create({
      data: {
        name,
        kos: { connect: { id: kosId } }, // ✅ FIX
      },
    });

    res.status(201).json(newFasility);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};