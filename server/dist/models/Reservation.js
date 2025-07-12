"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const reservationSchema = new mongoose_1.default.Schema({
    room: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Room', required: true },
    reservedBy: { type: String, required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true }
});
exports.default = mongoose_1.default.model('Reservation', reservationSchema);
