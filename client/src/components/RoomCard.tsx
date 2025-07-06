import React from 'react';

interface RoomCardProps {
  room: {
    _id: string;
    name: string;
    status: string;
  };
  onBookClick: (roomId: string) => void;
}

const RoomCard: React.FC<RoomCardProps> = ({ room, onBookClick }) => {
  return (
    <div className="p-4 border rounded-lg shadow-sm bg-white space-y-2">
      <h2 className="text-xl font-bold">{room.name}</h2>
      <p className={room.status === 'available' ? 'text-green-600' : 'text-red-600'}>
        Status: {room.status}
      </p>
      {room.status === 'available' && (
        <button
          onClick={() => onBookClick(room._id)}
          className="px-3 py-1 bg-blue-600 text-white rounded"
        >
          Book Now
        </button>
      )}
    </div>
  );
};

export default RoomCard;
