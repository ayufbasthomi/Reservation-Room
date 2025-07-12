import { useEffect, useState } from 'react';

interface Room {
  _id: string;
  name: string;
  status: string;
}

export default function Home() {
  const [, setRooms] = useState<Room[]>([]);

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    const res = await fetch('http://localhost:5000/api/rooms');
    const data = await res.json();
    setRooms(data);
  };

//   return (
//     <div className="p-4">
//         <header className="bg-red-600 p-4 text-center shadow">
//             <h1 className="text-4xl font-bold text-white">Room Reservation System</h1>
//         </header>

//         <div className="grid grid-cols-3 gap-4">
//             {rooms.map(room => (
//             <div key={room._id} className="border p-4 rounded shadow">
//                 <h2 className="text-xl">{room.name}</h2>
//                 <p>Status: {room.status}</p>
//             </div>
//             ))}
//         </div>
//     </div>
//   );
}
