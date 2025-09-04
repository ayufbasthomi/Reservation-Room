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

router.delete("/:id", async (req, res) => {
  try {
    const deletedRoom = await Room.findByIdAndDelete(req.params.id);
    if (!deletedRoom) {
      return res.status(404).json({ message: "Room not found" });
    }
    res.json({ message: "Room deleted", deletedRoom });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    res.status(500).json({ error: errorMessage });
  }
});

export default router;
