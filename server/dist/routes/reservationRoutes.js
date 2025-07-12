"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Reservation_1 = __importDefault(require("../models/Reservation"));
const Room_1 = __importDefault(require("../models/Room"));
const router = express_1.default.Router();
// GET all reservations
router.get('/', async (req, res) => {
    const { startTime, endTime } = req.query;
    let filter = {};
    if (startTime && endTime) {
        filter = {
            $or: [
                {
                    startTime: { $lt: new Date(endTime) },
                    endTime: { $gt: new Date(startTime) },
                },
            ],
        };
    }
    try {
        const reservations = await Reservation_1.default.find(filter).populate('room');
        res.json(reservations);
    }
    catch (error) {
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
        const overlapping = await Reservation_1.default.findOne({
            room: roomId,
            $or: [
                { startTime: { $lt: endTime }, endTime: { $gt: startTime } }
            ]
        });
        if (overlapping) {
            return res.status(409).json({ message: 'Time slot already booked for this room' });
        }
        const reservation = new Reservation_1.default({ room: roomId, reservedBy, startTime, endTime });
        await reservation.save();
        await Room_1.default.findByIdAndUpdate(roomId, { status: 'reserved' });
        res.status(201).json(reservation);
    }
    catch (err) {
        console.error('Error creating reservation:', err);
        res.status(500).json({ message: 'Server error' });
    }
});
// Cleanup route to delete expired reservations
router.delete('/cleanup', async (req, res) => {
    try {
        const now = new Date();
        const result = await Reservation_1.default.deleteMany({ endTime: { $lt: now } });
        res.json({ deletedCount: result.deletedCount });
    }
    catch (error) {
        console.error('Cleanup error:', error);
        res.status(500).json({ error: 'Failed to clean up expired reservations' });
    }
});
exports.default = router;
