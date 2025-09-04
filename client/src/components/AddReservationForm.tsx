import { useEffect, useState } from "react";
import axios from "axios";
import { formatDateTime } from "../utils/date"; 

const API = import.meta.env.VITE_API_BASE_URL;

export default function ReservationForm() {
  type Room = { _id: string; name: string; capacity?: number; image?: string };

  const [rooms, setRooms] = useState<Room[]>([]);
  const [roomId, setRoomId] = useState("");
  const [reservedBy, setReservedBy] = useState("");

  // keep date separate
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const [availability, setAvailability] = useState<string | null>(null);

  // build ISO string: "YYYY-MM-DDTHH:mm"
  const buildDateTime = (d: string, t: string) => {
    if (!d || !t) return "";
    return `${d}T${t}`;
  };

  // Fetch room list
  const fetchRooms = async () => {
    const res = await axios.get<Room[]>(`${API}/rooms`);
    const roomsWithImages = res.data.map((room: Room, index: number) => ({
      ...room,
      image: `/room${index + 1}.jpg`,
    }));
    setRooms(roomsWithImages);
  };

  // Book room
  const bookRoom = async () => {
    const startDateTime = buildDateTime(date, startTime);
    const endDateTime = buildDateTime(date, endTime);

    if (!roomId || !reservedBy || !startDateTime || !endDateTime) {
      alert("Please fill all fields");
      return;
    }

    await axios.post(`${API}/reservations`, {
      roomId,
      reservedBy,
      startTime: startDateTime,
      endTime: endDateTime,
    });

    alert("Room booked!");
    setReservedBy("");
    setDate("");
    setStartTime("");
    setEndTime("");
    setAvailability(null);
  };

  // Check availability
  const checkAvailability = async () => {
    const startDateTime = buildDateTime(date, startTime);
    const endDateTime = buildDateTime(date, endTime);

    if (!roomId || !startDateTime || !endDateTime) {
      setAvailability(null);
      return;
    }

    try {
      const res = await axios.get(`${API}/reservations`, {
        params: { roomId, startTime: startDateTime, endTime: endDateTime },
      });
      const reservations = res.data as any[];
      if (reservations.length === 0) {
        setAvailability("Available ✅");
      } else {
        setAvailability("Booked ❌");
      }
    } catch (err) {
      console.error(err);
      setAvailability("⚠️ Error checking availability");
    }
  };

  useEffect(() => {
    checkAvailability();
  }, [roomId, date, startTime, endTime]);

  useEffect(() => {
    fetchRooms();
  }, []);

  return (
    <div className="w-full px-6 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left: Room List */}
        <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map((room) => (
            <div
              key={room._id}
              className={`border rounded-lg p-4 flex flex-col items-center text-center ${
                roomId === room._id ? "border-blue-500 shadow-lg" : ""
              }`}
            >
              <div className="border rounded-lg w-full h-44 flex items-center justify-center mb-3 bg-gray-100 overflow-hidden">
                {room.image ? (
                  <img
                    src={room.image}
                    alt={room.name}
                    className="w-full h-50 object-cover rounded mb-3"
                  />
                ) : (
                  <div className="w-full h-50 bg-gray-300 rounded mb-3 flex items-center justify-center text-gray-500">
                    No Image
                  </div>
                )}
              </div>
              <p className="font-semibold">{room.name}</p>
              <p className="text-sm text-gray-500">
                Kapasitas {room.capacity ?? "..."} orang
              </p>
              <button
                onClick={() => setRoomId(room._id)}
                className={`mt-3 px-6 py-1 rounded-full border transition 
                            ${
                              roomId === room._id
                                ? "bg-blue-600 text-white border-blue-600"
                                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                            }`}
              >
                Pilih
              </button>
            </div>
          ))}
        </div>

        {/* Right: Booking Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            bookRoom();
          }}
          className="border rounded-lg p-6 flex flex-col space-y-4"
        >
          {/* Date */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Tanggal Pemakaian
            </label>
            <input
              type="date"
              className="w-full border rounded px-3 py-2 bg-gray-100"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          {/* Availability */}
          <div>
            <label className="block text-sm font-medium mb-1">Ketersediaan</label>
            <input
              type="text"
              disabled
              value={availability || ""}
              placeholder="(Auto check availability here)"
              className={`w-full border rounded px-3 py-2 bg-gray-100 ${
                availability?.includes("Available")
                  ? "text-green-600 font-semibold"
                  : availability?.includes("Booked")
                  ? "text-red-600 font-semibold"
                  : ""
              }`}
            />
          </div>

          {/* Time */}
          <div className="flex items-center space-x-2">
            <input
              type="time"
              step="60"
              lang="id-ID"   // force 24-hour
              className="w-1/2 border rounded px-3 py-2 bg-gray-100"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
            <span>-</span>
            <input
              type="time"
              step="60"
              lang="id-ID"   // force 24-hour
              className="w-1/2 border rounded px-3 py-2 bg-gray-100"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
            />
          </div>

          {/* PIC */}
          <div>
            <label className="block text-sm font-medium mb-1">PIC</label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2 bg-gray-100"
              value={reservedBy}
              onChange={(e) => setReservedBy(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full mt-4 py-2 rounded-full bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
            disabled={availability === "Booked ❌"}
          >
            Kirim Pengajuan
          </button>
        </form>
      </div>
    </div>
  );
}
