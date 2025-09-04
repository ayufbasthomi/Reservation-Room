"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const Room_1 = __importDefault(require("../models/Room"));
const router = (0, express_1.Router)();
// Configure multer for file uploads (store in /uploads)
const storage = multer_1.default.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, "uploads/");
    },
    filename: (_req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    },
});
const upload = (0, multer_1.default)({ storage });
// GET all rooms
router.get("/", async (_req, res) => {
    const rooms = await Room_1.default.find();
    res.json(rooms);
});
// CREATE a room (with optional image)
router.post("/", upload.single("image"), async (req, res) => {
    try {
        const { name, capacity } = req.body;
        const image = req.file ? `/uploads/${req.file.filename}` : undefined;
        const room = new Room_1.default({
            name,
            status: "available",
            capacity,
            image,
        });
        await room.save();
        res.status(201).json(room);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// DELETE a room
router.delete("/:id", async (req, res) => {
    try {
        const deletedRoom = await Room_1.default.findByIdAndDelete(req.params.id);
        if (!deletedRoom) {
            return res.status(404).json({ message: "Room not found" });
        }
        res.json({ message: "Room deleted", deletedRoom });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
exports.default = router;
