import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema({
  name: { type: String, required: true },
  status: { type: String, enum: ['available', 'booked'], default: 'available' }
});

export default mongoose.model('Room', roomSchema);
