"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const roomRoutes_1 = __importDefault(require("./routes/roomRoutes"));
const reservationRoutes_1 = __importDefault(require("./routes/reservationRoutes"));
const Room_1 = __importDefault(require("./models/Room"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use('/api/rooms', roomRoutes_1.default);
app.use('/api/reservations', reservationRoutes_1.default);
mongoose_1.default.connect(process.env.MONGO_URI)
    .then(async () => {
    console.log('✅ Connected to MongoDB');
    await createDefaultRooms();
    app.listen(PORT, () => {
        console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
})
    .catch(err => console.error('❌ MongoDB connection error:', err));
async function createDefaultRooms() {
    const count = await Room_1.default.countDocuments();
    if (count === 0) {
        console.log('📦 Creating default rooms...');
        await Room_1.default.insertMany([
            { name: 'Room A', status: 'available' },
            { name: 'Room B', status: 'available' },
            { name: 'Room C', status: 'available' }
        ]);
        console.log('✅ Default rooms created');
    }
    else {
        // ✅ Optional: reset all statuses back to "available"
        await Room_1.default.updateMany({}, { status: 'available' });
        console.log('🔁 Rooms already exist. Status reset to "available".');
    }
}
