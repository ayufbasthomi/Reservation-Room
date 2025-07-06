import mongoose from 'mongoose';

const reservationSchema = new mongoose.Schema({
  room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
  reservedBy: { type: String, required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true }
});

export default mongoose.model('Reservation', reservationSchema);
