// utils/date.ts
export function formatDateTimeLocal(dateTime: string) {
  // input: "YYYY-MM-DDTHH:mm" or "YYYY-MM-DDTHH:mm:ss.sssZ"
  const [datePart, timePart] = dateTime.split("T");
  const [year, month, day] = datePart.split("-").map(Number);

  // Keep only HH:mm
  const [hour, minute] = timePart.split(":");

  return `${day}-${month.toString().padStart(2, "0")}-${year
    .toString()
    .padStart(2, "0")} ${hour}:${minute}`;
}
