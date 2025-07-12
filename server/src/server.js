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
    .then(() => __awaiter(void 0, void 0, void 0, function* () {
    console.log('✅ Connected to MongoDB');
    yield createDefaultRooms();
    app.listen(PORT, () => {
        console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
}))
    .catch(err => console.error('❌ MongoDB connection error:', err));
function createDefaultRooms() {
    return __awaiter(this, void 0, void 0, function* () {
        const count = yield Room_1.default.countDocuments();
        if (count === 0) {
            console.log('📦 Creating default rooms...');
            yield Room_1.default.insertMany([
                { name: 'Room A', status: 'available' },
                { name: 'Room B', status: 'available' },
                { name: 'Room C', status: 'available' }
            ]);
            console.log('✅ Default rooms created');
        }
        else {
            // ✅ Optional: reset all statuses back to "available"
            yield Room_1.default.updateMany({}, { status: 'available' });
            console.log('🔁 Rooms already exist. Status reset to "available".');
        }
    });
}
