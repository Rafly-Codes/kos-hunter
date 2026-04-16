// src/index.ts

import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Routes
import authRoutes from './routes/auth.routes';
import kosRoutes from './routes/kos.routes';
import facilityRoutes from './routes/facility.routes';
import reviewRoutes from './routes/review.routes';
import bookingRoutes from './routes/booking.routes';
import userRoutes from './routes/user.routes';
app.use('/auth', authRoutes);
app.use('/kos', kosRoutes);
app.use('/kos/:kosId/facilities', facilityRoutes);
app.use('/kos/:kosId/reviews', reviewRoutes);
app.use('/bookings', bookingRoutes);
app.use('/users', userRoutes);app.get('/', (req, res) => {
  res.send('API Kos Hunter jalan 🚀');
});


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

export default app;