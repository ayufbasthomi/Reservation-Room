import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

import roomRoutes from './routes/roomRoutes';
import reservationRoutes from './routes/reservationRoutes';
import Room from './models/Room';
import authRoutes from './routes/auth';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/rooms', roomRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/auth', authRoutes);

mongoose.connect(process.env.MONGO_URI!)
  .then(async () => {
    console.log('✅ Connected to MongoDB');
    await createDefaultRooms();
    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  })
  .catch(err => console.error('❌ MongoDB connection error:', err));


async function createDefaultRooms() {
  const count = await Room.countDocuments();

  if (count === 0) {
    console.log('📦 Creating default rooms...');
    await Room.insertMany([
      { name: 'Room A', status: 'available' },
      { name: 'Room B', status: 'available' },
      { name: 'Room C', status: 'available' }
    ]);
    console.log('✅ Default rooms created');
  } else {
    // ✅ Optional: reset all statuses back to "available"
    await Room.updateMany({}, { status: 'available' });
    console.log('🔁 Rooms already exist. Status reset to "available".');
  }
}

