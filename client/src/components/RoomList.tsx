import { useEffect, useState } from 'react';
import axios from 'axios';
const API = import.meta.env.VITE_API_BASE_URL;

export default function RoomList() {
  const [rooms, setRooms] = useState<any[]>([]);
  const [reservations, setReservations] = useState<any[]>([]);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  const fetchRooms = async () => {
    const res = await axios.get(`${API}/rooms`);
    setRooms(res.data as any[]);
  };

    const fetchReservations = async () => {
    if (!startTime || !endTime) return;

    const res = await axios.get(`${API}/reservations`, {
        params: {
        startTime,
        endTime
        }
    });

    setReservations(res.data as any[]);
    };

  useEffect(() => {
    fetchRooms();
  }, []);

  const checkAvailability = (roomId: string) => {
    return !reservations.some((r) =>
      r.room._id === roomId &&
      new Date(r.startTime) < new Date(endTime) &&
      new Date(r.endTime) > new Date(startTime)
    );
  };

  return (
    <div className="w-full px-4 max-w-4xl mx-auto text-white rounded-xl shadow mt-6 overflow-visible">
      <h2 className="text-xl font-bold mb-4 text-center">Room Availability</h2>

        <div className="flex flex-wrap items-end justify-center gap-4 mb-6 w-full">
            {/* From */}
            <div className="relative">
                <label className="text-sm font-medium text-gray-600 mb-1">From</label>
                <input
                type="datetime-local"
                className="bg-gray-400 text-black border p-2 rounded w-full sm:w-[150px]"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                />
            </div>

            {/* To */}
            <div className="relative">
                <label className="text-sm font-medium text-gray-600 mb-1">To</label>
                <input
                type="datetime-local"
                className="bg-gray-400 text-black border p-2 rounded w-full sm:w-[150px]"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                />
            </div>

            {/* Button */}
            <button
                onClick={fetchReservations}
                className="bg-blue-600 text-white px-4 py-2 rounded h-[42px] mt-2 sm:mt-6 hover:bg-blue-700 transition"
            >
                Check
            </button>
        </div>

      {/* Room List */}
      <ul className="space-y-3">
        {rooms.map((room) => (
          <li key={room._id} className="p-4 bg-gray-50 rounded-xl shadow flex justify-between items-center w-full">
            <div>
              <p className="text-lg text-gray-600 font-semibold">{room.name}</p>
              <p className={`text-sm ${checkAvailability(room._id) ? 'text-green-600' : 'text-red-600'}`}>
                {checkAvailability(room._id) ? 'Available' : 'Booked'}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
