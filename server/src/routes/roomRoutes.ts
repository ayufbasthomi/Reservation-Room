import { Router, Request, Response } from "express";
import multer from "multer";
import Room, { IRoom } from "../models/Room";

const router = Router();

// Configure multer for file uploads (store in /uploads)
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, "uploads/");
  },
  filename: (_req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// GET all rooms
router.get("/", async (_req: Request, res: Response) => {
  const rooms: IRoom[] = await Room.find();
  res.json(rooms);
});

// CREATE a room (with optional image)
router.post("/", upload.single("image"), async (req: Request, res: Response) => {
  try {
    const { name, capacity } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : undefined;

    const room = new Room({
      name,
      status: "available",
      capacity,
      image,
    });

    await room.save();
    res.status(201).json(room);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE a room
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const deletedRoom = await Room.findByIdAndDelete(req.params.id);
    if (!deletedRoom) {
      return res.status(404).json({ message: "Room not found" });
    }
    res.json({ message: "Room deleted", deletedRoom });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
