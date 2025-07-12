// src/App.tsx
import { useState } from 'react';
import RoomList from './components/RoomList';
import ReservationForm from './components/AddReservationForm';
import RoomManager from './components/AddRoomForm';
import BookList from './components/BookList';

import {
  Home,
  CalendarCheck,
  List,
  Settings as SettingsIcon,
} from 'lucide-react';

const App = () => {
  const [tab, setTab] = useState('rooms');

  const renderTab = () => {
    switch (tab) {
      case 'rooms': return <RoomList />;
      case 'book': return <ReservationForm />;
      case 'booklist': return <BookList />;
      case 'manage': return <RoomManager />;
      default: return <RoomList />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white pb-20">
      <header className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 text-center shadow fixed left-0 right-0 flex justify-around items-center py-2 z-50">
        <h1 className="text-2xl font-semibold">Room Reservation System</h1>
      </header>

      <main className="w-full px-4 max-w-4xl mx-auto text-white rounded-xl shadow mt-6 fixed left-0 right-0 flex justify-around items-center py-2 z-50">
        {renderTab()}
      </main>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-black border-t shadow-inner flex justify-around items-center py-2 z-50">
        <button
          onClick={() => setTab('rooms')}
          className={`bg-black flex flex-col items-center text-xs ${
            tab === 'rooms' ? 'text-blue-600' : 'text-gray-500'
          }`}
        >
          <Home size={22} />
          <span>Availability</span>
        </button>

        <button
          onClick={() => setTab('book')}
          className={`bg-black flex flex-col items-center text-xs ${
            tab === 'book' ? 'text-blue-600' : 'text-gray-500'
          }`}
        >
          <CalendarCheck size={22} />
          <span>Book</span>
        </button>

        <button
          onClick={() => setTab('booklist')}
          className={`bg-black flex flex-col items-center text-xs ${
            tab === 'booklist' ? 'text-blue-600' : 'text-gray-500'
          }`}
        >
          <List size={22} />
          <span>Book List</span>
        </button>

        <button
          onClick={() => setTab('manage')}
          className={`bg-black flex flex-col items-center text-xs ${
            tab === 'manage' ? 'text-blue-600' : 'text-gray-500'
          }`}
        >
          <SettingsIcon size={22} />
          <span>Room Manager</span>
        </button>
      </div>
    </div>
  );
};

export default App;
