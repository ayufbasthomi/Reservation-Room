import express from 'express';
import Reservation from '../models/Reservation';
import Room from '../models/Room';

const router = express.Router();

// GET all reservations
router.get('/', async (req, res) => {
  const { startTime, endTime } = req.query;

  let filter: any = {};
  if (startTime && endTime) {
    filter = {
      $or: [
        {
          startTime: { $lt: new Date(endTime as string) },
          endTime: { $gt: new Date(startTime as string) },
        },
      ],
    };
  }

  try {
    const reservations = await Reservation.find(filter).populate('room');
    res.json(reservations);
  } catch (error) {
    console.error('❌ Failed to fetch reservations:', error);
    res.status(500).json({ error: 'Failed to fetch reservations' });
  }
});

// POST new reservation
router.post('/', async (req, res) => {
  try {
    const { roomId, reservedBy, startTime, endTime } = req.body;

    // Validasi waktu
    if (!reservedBy || !startTime || !endTime || !roomId) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Cek tumpang tindih waktu
    const overlapping = await Reservation.findOne({
      room: roomId,
      $or: [
        { startTime: { $lt: endTime }, endTime: { $gt: startTime } }
      ]
    });

    if (overlapping) {
      return res.status(409).json({ message: 'Time slot already booked for this room' });
    }

    const reservation = new Reservation({ room: roomId, reservedBy, startTime, endTime });
    await reservation.save();

    await Room.findByIdAndUpdate(roomId, { status: 'reserved' });
    res.status(201).json(reservation);
  } catch (err) {
    console.error('Error creating reservation:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Cleanup route to delete expired reservations
router.delete('/cleanup', async (req, res) => {
  try {
    const now = new Date();
    const result = await Reservation.deleteMany({ endTime: { $lt: now } });
    res.json({ deletedCount: result.deletedCount });
  } catch (error) {
    console.error('Cleanup error:', error);
    res.status(500).json({ error: 'Failed to clean up expired reservations' });
  }
});

export default router;
