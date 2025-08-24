// src/App.tsx
import { useState } from "react";
import RoomList from "./components/RoomList";
import ReservationForm from "./components/AddReservationForm";
import RoomManager from "./components/AddRoomForm";
import BookList from "./components/BookList";

import {
  Home,
  CalendarCheck,
  List,
  Settings as SettingsIcon,
} from "lucide-react";

const App = () => {
  const [tab, setTab] = useState("home");

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

  return (
    <div className="min-h-screen bg-white text-black">
      <header className="bg-white text-black px-8 py-6 shadow fixed left-0 right-0 flex justify-between items-center z-50">

        {/* Logos */}
        <div className="flex items-center space-x-6">
          <img src="/kemnaker_logo.png" alt="Kemnaker" className="h-24" />   {/* was h-10 */}
          <img src="/pelatihanvikasi_logo.png" alt="Pelatihan Vokasi" className="h-12" /> {/* was h-10 */}
        </div>

        {/* Top Right Navigation */}
        <nav className="flex space-x-6">
          <button
            onClick={() => setTab("home")}
            className={`flex flex-col items-center text-sm font-medium px-4 py-2 rounded-lg focus:outline-none focus:ring-0
              ${tab === "home" ? "text-blue-600" : "text-gray-600"} bg-white hover:bg-gray-100`}
          >
            <Home size={28} />
            <span>HOME</span>
          </button>

          <button
            onClick={() => setTab("book")}
            className={`flex flex-col items-center text-sm font-medium px-4 py-2 rounded-lg focus:outline-none focus:ring-0
              ${tab === "book" ? "text-blue-600" : "text-gray-600"} bg-white hover:bg-gray-100`}
          >
            <CalendarCheck size={28} />
            <span>PINJAM RUANGAN</span>
          </button>

          <button
            onClick={() => setTab("booklist")}
            className={`flex flex-col items-center text-sm font-medium px-4 py-2 rounded-lg focus:outline-none focus:ring-0
              ${tab === "booklist" ? "text-blue-600" : "text-gray-600"} bg-white hover:bg-gray-100`}
          >
            <List size={28} />
            <span>RIWAYAT PEMINJAMAN</span>
          </button>

          <button
            onClick={() => setTab("manage")}
            className={`flex flex-col items-center text-sm font-medium px-4 py-2 rounded-lg focus:outline-none focus:ring-0
              ${tab === "manage" ? "text-blue-600" : "text-gray-600"} bg-white hover:bg-gray-100`}
          >
            <SettingsIcon size={28} />
            <span>AKUN</span>
          </button>
        </nav>
      </header>

      {/* Main Content */}
      <main className="fixed w-full min-h-screen bg-white pt-32 pb-12 px-6">{renderTab()}</main>
    </div>
  );
};

export default App;
