// utils/times.ts
export const hours = Array.from({ length: 24 }, (_, i) =>
  i.toString().padStart(2, "0")
);

export const minutes = ["00", "15", "30", "45"];
