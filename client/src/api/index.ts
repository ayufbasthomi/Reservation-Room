const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const fetchRooms = async () => {
  const res = await fetch(`${BASE_URL}/rooms`);
  return res.json();
};

export const reserveRoom = async (data: any) => {
  const res = await fetch(`${BASE_URL}/reservations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
};
