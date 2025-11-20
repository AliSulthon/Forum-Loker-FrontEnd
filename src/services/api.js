// Nanti berisi axios instance
// Sekarang dipakai hanya mock data

export const dummyDelay = (data) =>
  new Promise((resolve) => setTimeout(() => resolve(data), 500));
