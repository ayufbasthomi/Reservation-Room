// utils/date.ts
export const formatDateTime = (dateString: string) => {
  const date = new Date(dateString);

  const datePart = date.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const timePart = date.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false, // 24h format
  });

  return `${datePart}, ${timePart}`;
};