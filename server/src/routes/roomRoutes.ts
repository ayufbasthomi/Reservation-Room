import express from 'express';
import Room from '../models/Room';

const router = express.Router();

router.get('/', async (_req, res) => {
  const rooms = await Room.find();
  res.json(rooms);
});

router.post('/', async (req, res) => {
  const { name, status } = req.body;
  const room = new Room({ name, status });
  await room.save();
  res.status(201).json(room);
});

export default router;
