// src/controllers/booking.controller.ts

import { Response } from 'express';
import prisma from '../prisma';
import { AuthRequest } from '../middlewares/auth.middleware';

// GET /bookings — histori booking milik society yang login
export const getMyBookings = async (req: AuthRequest, res: Response) => {
  try {
    const bookings = await prisma.book.findMany({
      where: { userId: req.user.id },
      include: {
        kos: { select: { id: true, name: true, address: true, pricePerMonth: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// GET /bookings/owner — histori booking kos milik owner (bisa filter by tanggal/bulan)
export const getOwnerBookings = async (req: AuthRequest, res: Response) => {
  try {
    const { month, year } = req.query;

    // Ambil semua kos milik owner
    const myKos = await prisma.kos.findMany({
      where: { userId: req.user.id },
      select: { id: true },
    });
    const kosIds = myKos.map((k) => k.id);

    // Filter by bulan dan tahun jika ada
    let dateFilter = {};
    if (month && year) {
      const start = new Date(Number(year), Number(month) - 1, 1);
      const end = new Date(Number(year), Number(month), 0, 23, 59, 59);
      dateFilter = { createdAt: { gte: start, lte: end } };
    }

    const bookings = await prisma.book.findMany({
      where: { kosId: { in: kosIds }, ...dateFilter },
      include: {
        kos: { select: { id: true, name: true, address: true } },
        user: { select: { id: true, name: true, phone: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// POST /bookings — society buat booking
export const createBooking = async (req: AuthRequest, res: Response) => {
  try {
    const { kosId, startDate, endDate } = req.body;

    const kos = await prisma.kos.findUnique({ where: { id: Number(kosId) } });
    if (!kos) {
      res.status(404).json({ message: 'Kos tidak ditemukan' });
      return;
    }

    const booking = await prisma.book.create({
      data: {
        kosId: Number(kosId),
        userId: req.user.id,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        status: 'pending',
      },
    });

    res.status(201).json({ message: 'Booking berhasil dibuat', booking });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// PATCH /bookings/:id/status — owner update status booking
export const updateBookingStatus = async (req: AuthRequest, res: Response) => {
  try {
    const id = Number(req.params.id as string);
    const { status } = req.body;

    if (!['accept', 'reject'].includes(status)) {
      res.status(400).json({ message: 'Status tidak valid, gunakan accept atau reject' });
      return;
    }

    const booking = await prisma.book.findUnique({
      where: { id },
      include: { kos: true },
    });

    if (!booking) {
      res.status(404).json({ message: 'Booking tidak ditemukan' });
      return;
    }

    if (booking.kos.userId !== req.user.id) {
      res.status(403).json({ message: 'Bukan kos milik Anda' });
      return;
    }

    const updated = await prisma.book.update({
      where: { id },
      data: { status },
    });

    res.json({ message: `Booking berhasil di-${status}`, booking: updated });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// GET /bookings/:id — detail booking (untuk cetak nota)
export const getBookingById = async (req: AuthRequest, res: Response) => {
  try {
    const id = Number(req.params.id as string);

    const booking = await prisma.book.findUnique({
      where: { id },
      include: {
        kos: {
          include: {
            user: { select: { id: true, name: true, phone: true } },
          },
        },
        user: { select: { id: true, name: true, phone: true, email: true } },
      },
    });

    if (!booking) {
      res.status(404).json({ message: 'Booking tidak ditemukan' });
      return;
    }

    // Hanya pemilik booking atau owner kos yang bisa lihat
    if (booking.userId !== req.user.id && booking.kos.userId !== req.user.id) {
      res.status(403).json({ message: 'Akses ditolak' });
      return;
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};