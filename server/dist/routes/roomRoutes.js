"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Room_1 = __importDefault(require("../models/Room"));
const router = express_1.default.Router();
router.get('/', async (_req, res) => {
    const rooms = await Room_1.default.find();
    res.json(rooms);
});
router.post('/', async (req, res) => {
    const { name, status } = req.body;
    const room = new Room_1.default({ name, status });
    await room.save();
    res.status(201).json(room);
});
router.delete("/:id", async (req, res) => {
    try {
        const deletedRoom = await Room_1.default.findByIdAndDelete(req.params.id);
        if (!deletedRoom) {
            return res.status(404).json({ message: "Room not found" });
        }
        res.json({ message: "Room deleted", deletedRoom });
    }
    catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        res.status(500).json({ error: errorMessage });
    }
});
exports.default = router;
