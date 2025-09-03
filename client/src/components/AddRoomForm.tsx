import { useEffect, useState } from "react";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";

const API = import.meta.env.VITE_API_BASE_URL;

export default function AccountManager() {
  type Room = { _id: string; name: string; capacity?: number; image?: string };
  type Reservation = {
    _id: string;
    room: Room;
    reservedBy: string;
    startTime: string;
    endTime: string;
    status: "pending" | "approved" | "rejected";
  };
  type User = { username: string; email: string; role: string };

  const [user, setUser] = useState<User | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [roomName, setRoomName] = useState("");
  const [roomCapacity, setRoomCapacity] = useState<number>(0);
  const [roomImage, setRoomImage] = useState<File | null>(null);

  // Profile state
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  /** ✅ Fetch logged-in user */
  const fetchUser = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await axios.get(`${API}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const userData = res.data as User;
      setUser(userData);
      setUsername(userData.username);
      setEmail(userData.email);
    } catch (err) {
      console.error("Failed to fetch user:", err);
    }
  };

  /** Fetch rooms */
  const fetchRooms = async () => {
    const res = await axios.get(`${API}/rooms`);
    const roomsData = res.data as Room[];
    const roomsWithImages = roomsData.map((room: Room, index: number) => ({
      ...room,
      image: `/room${index + 1}.jpg`,
    }));
    setRooms(roomsWithImages);
  };

  /** Fetch reservations (admin only) */
  const fetchReservations = async () => {
    const res = await axios.get(`${API}/reservations`);
    setReservations(res.data as Reservation[]);
  };

  /** Add room (admin) */
  const addRoom = async () => {
    const formData = new FormData();
    formData.append("name", roomName);
    formData.append("capacity", roomCapacity.toString());
    if (roomImage) formData.append("image", roomImage);

    await axios.post(`${API}/rooms`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    setRoomName("");
    setRoomCapacity(0);
    setRoomImage(null);
    fetchRooms();
  };

  /** Delete room (admin) */
  const deleteRoom = async (id: string) => {
    await axios.delete(`${API}/rooms/${id}`);
    fetchRooms();
  };

  /** Approve/reject reservation */
  const updateReservationStatus = async (id: string, status: string) => {
    await axios.patch(`${API}/reservations/${id}`, { status });
    fetchReservations();
  };

  /** Update profile */
  const updateProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      await axios.patch(
        `${API}/auth/me`,
        {
          username,
          email,
          ...(password ? { password } : {}),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Profile updated!");
      setPassword("");
    } catch (err) {
      console.error("Profile update failed:", err);
    }
  };

  /** Load data on mount */
  useEffect(() => {
    fetchUser();
    fetchRooms();
    fetchReservations();
  }, []);

  if (!user) return <p>Loading...</p>;

return (
  <div className="w-full px-4 max-w-7xl mx-auto mt-6">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Profile Section */}
      <div className="p-6 bg-white rounded-xl shadow space-y-3">
        <h2 className="text-xl font-bold mb-4">Profile</h2>

        {/* Username */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Username
          </label>
          <input
            className="w-full p-2 border rounded  bg-gray-100"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        {/* Email */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Email
          </label>
          <input
            type="email"
            className="w-full p-2 border rounded  bg-gray-100"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Password with toggle */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Password
          </label>
          <input
            type={showPassword ? "text" : "password"}
            className="w-full p-2 border rounded pr-10  bg-gray-100"
            value={password || "******"} // 👈 default show hidden
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            className="absolute right-2 top-6 text-gray-500 hover:text-gray-700 bg-gray-100 focus:outline-none focus:ring-0"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        <button
          className="bg-blue-600 text-white px-4 py-2 rounded w-full"
          onClick={updateProfile}
        >
          Save Profile
        </button>
      </div>

      {/* Manage Rooms (Admin only) */}
      {user.role === "admin" && (
        <div className="p-6 bg-white rounded-xl shadow space-y-4">
          <h2 className="text-xl font-bold mb-4 text-center">Manage Rooms</h2>

          {/* Add new room form */}
          <div className="space-y-3">
            {/* Room Name */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Room Name
              </label>
              <input
                className="w-full p-2 border rounded bg-gray-100"
                placeholder="Room Name"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
              />
            </div>

            {/* Capacity */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Capacity
              </label>
              <input
                type="number"
                className="w-full p-2 border rounded bg-gray-100"
                placeholder="Capacity"
                value={roomCapacity}
                onChange={(e) => setRoomCapacity(Number(e.target.value))}
              />
            </div>

            {/* Room Image */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Room Image
              </label>
              <input
                type="file"
                className="w-full p-2 border rounded bg-gray-100 text-sm"
                onChange={(e) =>
                  setRoomImage(e.target.files ? e.target.files[0] : null)
                }
              />
            </div>

            <button
              className="bg-green-600 text-white px-4 py-2 rounded w-full"
              onClick={addRoom}
            >
              Add Room
            </button>
          </div>

          {/* Room list as grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6">
            {rooms.map((room) => (
              <div
                key={room._id}
                className="p-4 bg-gray-100 rounded-xl shadow flex flex-col items-center text-center"
              >
                {/* Room image */}
                {room.image ? (
                  <img
                    src={room.image}
                    alt={room.name}
                    className="w-full h-32 object-cover rounded mb-3"
                  />
                ) : (
                  <div className="w-full h-32 bg-gray-300 rounded mb-3 flex items-center justify-center text-gray-500">
                    No Image
                  </div>
                )}

                {/* Room details */}
                <h3 className="font-semibold text-lg">{room.name}</h3>
                <p className="text-gray-600 text-sm mb-2">
                  Capacity: {room.capacity ?? "-"}
                </p>

                {/* Actions */}
                <button
                  className="text-red-600 mt-2"
                  onClick={() => deleteRoom(room._id)}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Manage Reservations (Admin only) */}
      {user.role === "admin" && (
        <div className="p-6 bg-white rounded-xl shadow">
          <h2 className="text-xl font-bold mb-4 text-center">
            Manage Reservations
          </h2>
          <ul className="space-y-2">
            {reservations.map((res) => (
              <li
                key={res._id}
                className="p-3 bg-gray-100 rounded flex flex-col"
              >
                <p className="font-semibold">{res.room.name}</p>
                <p className="text-sm text-gray-600">
                  {res.reservedBy} —{" "}
                  {new Date(res.startTime).toLocaleString()} →{" "}
                  {new Date(res.endTime).toLocaleString()}
                </p>
                <p
                  className={`text-sm font-semibold ${
                    res.status === "approved"
                      ? "text-green-600"
                      : res.status === "rejected"
                      ? "text-red-600"
                      : "text-yellow-600"
                  }`}
                >
                  Status: {res.status}
                </p>
                {res.status === "pending" && (
                  <div className="flex space-x-2 mt-2">
                    <button
                      className="bg-green-600 text-white px-3 py-1 rounded"
                      onClick={() =>
                        updateReservationStatus(res._id, "approved")
                      }
                    >
                      Approve
                    </button>
                    <button
                      className="bg-red-600 text-white px-3 py-1 rounded"
                      onClick={() =>
                        updateReservationStatus(res._id, "rejected")
                      }
                    >
                      Reject
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  </div>
);

}
