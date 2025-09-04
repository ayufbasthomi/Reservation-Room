import { useEffect, useState } from 'react';
import axios from 'axios';
import { formatDateTimeLocal } from "../utils/date";

const API = import.meta.env.VITE_API_BASE_URL;

export default function BookList() {
  const [reservations, setReservations] = useState<any[]>([]);

  const cleanUpReservations = async () => {
  try {
    await axios.delete(`${API}/reservations/cleanup`);
  } catch (err) {
    console.error('Failed to clean up expired reservations:', err);
  }
};

  const fetchReservations = async () => {
    try {
      await cleanUpReservations();
      const res = await axios.get(`${API}/reservations`);
      setReservations(res.data as any[]);
    } catch (err) {
      console.error('Failed to fetch reservations:', err);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  return (
    <div className="w-full px-4 max-w-4xl mx-auto text-white rounded-xl shadow mt-6">
      <h2 className="text-xl font-bold mb-4 text-center">Booking List</h2>
      
      {reservations.length === 0 ? (
        <p className="text-gray-500 text-center">No reservations found.</p>
      ) : (
        <ul className="space-y-4">
          {reservations.map((res) => (
            <li
              key={res._id}
              className="p-4 w-full max-w-4xl mx-auto bg-gray-50 border border-gray-200 rounded-lg shadow-sm"
            >
              <p className="text-lg font-semibold text-gray-800 mb-1">{res.room?.name || '-'}</p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">From:</span>{' '}
                {formatDateTimeLocal(res.startTime)}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">To:</span>{' '}
                {formatDateTimeLocal(res.endTime)}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                <span className="font-medium">Booked By:</span> {res.reservedBy}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
