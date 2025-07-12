const API = import.meta.env.VITE_API_BASE_URL;

export const fetchRooms = async () => {
  const res = await fetch(`${API}/rooms`);
  return res.json();
};

export const reserveRoom = async (data: any) => {
  const res = await fetch(`${API}/reservations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
};
