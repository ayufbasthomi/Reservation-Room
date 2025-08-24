"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Reservation_1 = __importDefault(require("../models/Reservation"));
const Room_1 = __importDefault(require("../models/Room"));
const router = express_1.default.Router();
// GET all reservations (with optional status filter)
router.get('/', async (req, res) => {
    const { startTime, endTime, status } = req.query;
    let filter = {};
    if (startTime && endTime) {
        filter = {
            ...filter,
            $or: [
                {
                    startTime: { $lt: new Date(endTime) },
                    endTime: { $gt: new Date(startTime) },
                },
            ],
        };
    }
    if (status) {
        filter.status = status;
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
// POST new reservation (default status = pending)
router.post('/', async (req, res) => {
    try {
        const { roomId, reservedBy, startTime, endTime } = req.body;
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
        const reservation = new Reservation_1.default({
            room: roomId,
            reservedBy,
            startTime,
            endTime,
            status: 'pending', // 👈 always start as pending
        });
        await reservation.save();
        res.status(201).json(reservation);
    }
    catch (err) {
        console.error('Error creating reservation:', err);
        res.status(500).json({ message: 'Server error' });
    }
});
// PUT update reservation status (approve / reject)
router.put('/:id', async (req, res) => {
    try {
        const { status } = req.body;
        if (!['approved', 'rejected'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }
        const reservation = await Reservation_1.default.findByIdAndUpdate(req.params.id, { status }, { new: true }).populate('room');
        if (!reservation) {
            return res.status(404).json({ message: 'Reservation not found' });
        }
        // if rejected, free up the room
        if (status === 'rejected') {
            await Room_1.default.findByIdAndUpdate(reservation.room._id, { status: 'available' });
        }
        // if approved, keep the room reserved
        if (status === 'approved') {
            await Room_1.default.findByIdAndUpdate(reservation.room._id, { status: 'reserved' });
        }
        res.json(reservation);
    }
    catch (error) {
        console.error('❌ Failed to update reservation:', error);
        res.status(500).json({ error: 'Failed to update reservation' });
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
