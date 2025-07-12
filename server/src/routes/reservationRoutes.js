"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Reservation_1 = __importDefault(require("../models/Reservation"));
const Room_1 = __importDefault(require("../models/Room"));
const router = express_1.default.Router();
// GET all reservations
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const reservations = yield Reservation_1.default.find(filter).populate('room');
        res.json(reservations);
    }
    catch (error) {
        console.error('❌ Failed to fetch reservations:', error);
        res.status(500).json({ error: 'Failed to fetch reservations' });
    }
}));
// POST new reservation
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { roomId, reservedBy, startTime, endTime } = req.body;
        // Validasi waktu
        if (!reservedBy || !startTime || !endTime || !roomId) {
            return res.status(400).json({ message: 'Missing required fields' });
        }
        // Cek tumpang tindih waktu
        const overlapping = yield Reservation_1.default.findOne({
            room: roomId,
            $or: [
                { startTime: { $lt: endTime }, endTime: { $gt: startTime } }
            ]
        });
        if (overlapping) {
            return res.status(409).json({ message: 'Time slot already booked for this room' });
        }
        const reservation = new Reservation_1.default({ room: roomId, reservedBy, startTime, endTime });
        yield reservation.save();
        yield Room_1.default.findByIdAndUpdate(roomId, { status: 'reserved' });
        res.status(201).json(reservation);
    }
    catch (err) {
        console.error('Error creating reservation:', err);
        res.status(500).json({ message: 'Server error' });
    }
}));
// Cleanup route to delete expired reservations
router.delete('/cleanup', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const now = new Date();
        const result = yield Reservation_1.default.deleteMany({ endTime: { $lt: now } });
        res.json({ deletedCount: result.deletedCount });
    }
    catch (error) {
        console.error('Cleanup error:', error);
        res.status(500).json({ error: 'Failed to clean up expired reservations' });
    }
}));
exports.default = router;
