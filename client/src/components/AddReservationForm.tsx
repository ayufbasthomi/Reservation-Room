import { useEffect, useState } from "react";
import axios from "axios";
const API = import.meta.env.VITE_API_BASE_URL;

export default function ReservationForm() {
  type Room = { _id: string; name: string; capacity?: number; image?: string };
  const [rooms, setRooms] = useState<Room[]>([]);
  const [roomId, setRoomId] = useState("");
  const [reservedBy, setReservedBy] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [availability, setAvailability] = useState<string | null>(null);

  // Fetch room list
  const fetchRooms = async () => {
    const res = await axios.get<Room[]>(`${API}/rooms`);
    const roomsWithImages = res.data.map((room: Room, index: number) => ({
      ...room,
      // Assign images from public folder based on index
      image: `/room${index + 1}.jpg`, 
    }));
    setRooms(roomsWithImages);
  };

  // Book room
  const bookRoom = async () => {
    if (!roomId || !reservedBy || !startTime || !endTime) {
      alert("Please fill all fields");
      return;
    }
    await axios.post(`${API}/reservations`, {
      roomId,
      reservedBy,
      startTime,
      endTime,
    });
    alert("Room booked!");
    setReservedBy("");
    setStartTime("");
    setEndTime("");
    setAvailability(null);
  };

  // Check availability
  const checkAvailability = async () => {
    if (!roomId || !startTime || !endTime) {
      setAvailability(null);
      return;
    }
    try {
      const res = await axios.get(`${API}/reservations`, {
        params: { roomId, startTime, endTime },
      });
      if (res.data.length === 0) {
        setAvailability("Available ✅");
      } else {
        setAvailability("Booked ❌");
      }
    } catch (err) {
      console.error(err);
      setAvailability("⚠️ Error checking availability");
    }
  };

  // Watch changes
  useEffect(() => {
    checkAvailability();
  }, [roomId, startTime, endTime]);

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
              {/* Room photo */}
              <div className="border rounded-lg w-full h-28 flex items-center justify-center mb-3 bg-gray-100 overflow-hidden">
                {room.image ? (
                  <img
                    src={room.image} // now points to /room1.jpg, /room2.jpg, etc.
                    alt={room.name}
                    className="w-full h-32 object-cover rounded mb-3"
                  />
                ) : (
                  <div className="w-full h-32 bg-gray-300 rounded mb-3 flex items-center justify-center text-gray-500">
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
          <div>
            <label className="block text-sm font-medium mb-1">
              Tanggal Pemakaian
            </label>
            <input
              type="date"
              className="w-full border rounded px-3 py-2 bg-gray-100"
              value={startTime.split("T")[0] || ""}
              onChange={(e) => {
                const date = e.target.value;
                if (startTime) {
                  setStartTime(date + "T" + startTime.split("T")[1]);
                } else {
                  setStartTime(date + "T00:00");
                }
                if (endTime) {
                  setEndTime(date + "T" + endTime.split("T")[1]);
                }
              }}
            />
          </div>

          {/* Availability */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Ketersediaan
            </label>
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
          <div>
            <label className="block text-sm font-medium mb-1">
              Waktu Pemakaian
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="time"
                className="w-1/2 border rounded px-3 py-2 bg-gray-100"
                value={startTime ? startTime.split("T")[1] : ""}
                onChange={(e) =>
                  setStartTime(
                    (startTime.split("T")[0] ||
                      new Date().toISOString().split("T")[0]) +
                      "T" +
                      e.target.value
                  )
                }
              />
              <span>-</span>
              <input
                type="time"
                className="w-1/2 border rounded px-3 py-2 bg-gray-100"
                value={endTime ? endTime.split("T")[1] : ""}
                onChange={(e) =>
                  setEndTime(
                    (endTime.split("T")[0] ||
                      new Date().toISOString().split("T")[0]) +
                      "T" +
                      e.target.value
                  )
                }
              />
            </div>
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
