export const passwordRules = [
  { label: "At least 8 characters", test: (p: string) => p.length >= 8 },
  { label: "One capital letter", test: (p: string) => /[A-Z]/.test(p) },
  { label: "One number", test: (p: string) => /\d/.test(p) },
  { label: "One special character (e.g. @ # $ !)", test: (p: string) => /[^A-Za-z0-9]/.test(p) },
];
export const passwordOk = (p: string) => passwordRules.every((r) => r.test(p));
export const validCoords = (lat: number, lng: number) =>
  Number.isFinite(lat) && Number.isFinite(lng) && Math.abs(lat) <= 90 && Math.abs(lng) <= 180 && !(lat === 0 && lng === 0);