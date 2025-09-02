// src/App.tsx
import { useState } from "react";
import RoomList from "./components/RoomList";
import ReservationForm from "./components/AddReservationForm";
import RoomManager from "./components/AddRoomForm";
import BookList from "./components/BookList";
import Login from "./components/Login";
import Register from "./components/Register";

import {
  Home,
  CalendarCheck,
  List,
  Settings as SettingsIcon,
} from "lucide-react";

interface User {
  username: string;
  email: string;
  role: string;
}

const App = () => {
  const [tab, setTab] = useState("home");
  const [user, setUser] = useState<User | null>(null);
  const [authPage, setAuthPage] = useState<"login" | "register">("login");

  const renderTab = () => {
    switch (tab) {
      case "rooms":
        return <RoomList />;
      case "book":
        return <ReservationForm />;
      case "booklist":
        return <BookList />;
      case "manage":
        return <RoomManager />;
      case "home":
      default:
        return (
          <div className="max-w-4xl mx-auto px-6 py-12 text-black">
            <h2 className="text-2xl font-bold mb-6">
              Langkah-langkah peminjaman ruangan :
            </h2>
            <ol className="list-decimal space-y-2 pl-6 text-lg leading-relaxed">
              <li>Klik tab “Pinjam Ruangan”.</li>
              <li>Pilih ruangan.</li>
              <li>Masukkan tanggal pemakaian ruangan.</li>
              <li>
                Tunggu beberapa saat hingga sistem menampilkan waktu ketersediaan
                ruangan pada kolom yang tersedia, lalu masukkan waktu pemakaian
                ruangan.
              </li>
              <li>Masukkan nama PIC.</li>
              <li>Klik “Kirim Pengajuan”.</li>
              <li>
                Tunggu hingga status pengajuan peminjaman ruangan diverifikasi
                oleh admin. Pengajuan yang sudah diverifikasi akan tampil di tab
                “Riwayat Peminjaman”.
              </li>
            </ol>
          </div>
        );
    }
  };

  // 🔑 If not logged in → show login page
  if (!user) {
    return authPage === "login" ? (
      <Login
        onLogin={(u) => setUser(u)}
        onSwitchToRegister={() => setAuthPage("register")}
      />
    ) : (
      <Register
        onRegister={(u) => setUser(u)}
        onSwitchToLogin={() => setAuthPage("login")}
      />
    );
  }

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Header */}
      <header className="bg-white text-black px-8 py-6 shadow fixed left-0 right-0 flex justify-between items-center z-50">

        {/* Logos */}
        <div className="flex items-center space-x-6">
          <img src="/kemnaker_logo.png" alt="Kemnaker" className="h-24" />
          <img src="/pelatihanvikasi_logo.png" alt="Pelatihan Vokasi" className="h-12" />
        </div>

        {/* Top Right Navigation */}
        <nav className="flex space-x-6">
          <button
            onClick={() => setTab("home")}
            className={`flex flex-col items-center text-sm font-medium px-4 py-2 rounded-lg
              ${tab === "home" ? "text-blue-600" : "text-gray-600"} bg-white hover:bg-gray-100`}
          >
            <Home size={28} />
            <span>HOME</span>
          </button>

          <button
            onClick={() => setTab("book")}
            className={`flex flex-col items-center text-sm font-medium px-4 py-2 rounded-lg
              ${tab === "book" ? "text-blue-600" : "text-gray-600"} bg-white hover:bg-gray-100`}
          >
            <CalendarCheck size={28} />
            <span>PINJAM RUANGAN</span>
          </button>

          <button
            onClick={() => setTab("booklist")}
            className={`flex flex-col items-center text-sm font-medium px-4 py-2 rounded-lg
              ${tab === "booklist" ? "text-blue-600" : "text-gray-600"} bg-white hover:bg-gray-100`}
          >
            <List size={28} />
            <span>RIWAYAT PEMINJAMAN</span>
          </button>

          <button
            onClick={() => setTab("manage")}
            className={`flex flex-col items-center text-sm font-medium px-4 py-2 rounded-lg
              ${tab === "manage" ? "text-blue-600" : "text-gray-600"} bg-white hover:bg-gray-100`}
          >
            <SettingsIcon size={28} />
            <span>AKUN</span>
          </button>

          {/* 👤 Logout */}
          <button
            onClick={() => {
              localStorage.removeItem("token");
              setUser(null);
              setTab("home");
            }}
            className="flex flex-col items-center text-sm font-medium px-4 py-2 rounded-lg text-red-600 bg-white hover:bg-gray-100"
          >
            <span>LOGOUT</span>
          </button>
        </nav>
      </header>

      {/* Main Content */}
      <main className="fixed w-full min-h-screen bg-white pt-32 pb-12 px-6">
        {renderTab()}
      </main>
    </div>
  );
};

export default App;
