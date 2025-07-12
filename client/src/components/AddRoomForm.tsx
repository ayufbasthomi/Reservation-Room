import { useEffect, useState } from 'react';
import axios from 'axios';
const API = import.meta.env.VITE_API_BASE_URL;

export default function RoomManager() {
  const [roomName, setRoomName] = useState('');
  type Room = { _id: string; name: string };
  const [rooms, setRooms] = useState<Room[]>([]);

  const fetchRooms = async () => {
    const res = await axios.get(`${API}/rooms`);
    setRooms(res.data as Room[]);
  };

  const addRoom = async () => {
    await axios.post(`${API}/rooms`, { name: roomName });
    setRoomName('');
    fetchRooms();
  };

  const deleteRoom = async (id: string) => {
    await axios.delete(`${API}/rooms/${id}`);
    fetchRooms();
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  return (
    <div className="w-full px-4 max-w-4xl mx-auto text-white rounded-xl shadow mt-6">
      <h2 className="text-xl font-bold mb-4 text-center">Manage Rooms</h2>
      <div className="flex space-x-2 mb-4">
        <input
          className="w-full flex-1 p-2 border rounded"
          placeholder="Room Name"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
        />
        <button className="bg-green-600 text-white px-4 rounded" onClick={addRoom}>
          Add
        </button>
      </div>
      <ul className="w-full space-y-2">
        {rooms.map((room: any) => (
          <li key={room._id} className="flex justify-between items-center p-2 bg-white rounded text-gray-600">
            <span>{room.name}</span>
            <button className="text-red-600" onClick={() => deleteRoom(room._id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
