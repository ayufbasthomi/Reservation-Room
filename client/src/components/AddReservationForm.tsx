import { useEffect, useState } from 'react';
import axios from 'axios';
const API = import.meta.env.VITE_API_BASE_URL;

export default function ReservationForm() {
  type Room = { _id: string; name: string };
  const [rooms, setRooms] = useState<Room[]>([]);
  const [roomId, setRoomId] = useState('');
  const [reservedBy, setReservedBy] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  const fetchRooms = async () => {
    const res = await axios.get<Room[]>(`${API}/rooms`);
    setRooms(res.data);
  };

  const bookRoom = async () => {
    await axios.post(`${API}/reservations`, {
      roomId,
      reservedBy,
      startTime,
      endTime,
    });
    alert('Room booked!');
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  return (
    <div className="w-full px-4 max-w-4xl mx-auto text-white rounded-xl shadow mt-6">
      <h2 className="text-xl font-bold mb-4 text-center">Book a Room</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          bookRoom();
        }}
        className="space-y-4"
      >
        <select
          className="w-full p-2 border rounded"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
        >
          <option value="">Select Room</option>
          {rooms.map((room: any) => (
            <option key={room._id} value={room._id}>
              {room.name}
            </option>
          ))}
        </select>
        <input
          className="w-full p-2 border rounded"
          placeholder="Your Name"
          value={reservedBy}
          onChange={(e) => setReservedBy(e.target.value)}
        />
        <input
          className="w-full p-2 border rounded"
          type="datetime-local"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
        />
        <input
          className="w-full p-2 border rounded"
          type="datetime-local"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
        />
        <button className="w-full bg-blue-600 text-white py-2 rounded">
          Book Room
        </button>
      </form>
    </div>
  );
}
