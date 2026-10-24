// Birthplace lookup via Open-Meteo's free geocoding API (no key needed). It returns the IANA time zone,
// which the chart engine uses to resolve historical UTC offsets.

export type Place = { label: string; latitude: number; longitude: number; timezone: string };

type OpenMeteoResult = { name: string; admin1?: string; country?: string; latitude: number; longitude: number; timezone?: string };

export async function searchPlaces(query: string, signal?: AbortSignal): Promise<Place[]> {
  if (query.trim().length < 2) return [];
  const url = `https://geocoding-api.open-meteo.com/v1/search?count=6&language=en&format=json&name=${encodeURIComponent(query.trim())}`;
  const response = await fetch(url, { signal });
  if (!response.ok) throw new Error("Place search is unavailable right now.");
  const body: { results?: OpenMeteoResult[] } = await response.json();
  return (body.results ?? [])
    .filter((r) => r.timezone)
    .map((r) => ({
      label: [r.name, r.admin1, r.country].filter(Boolean).join(", "),
      latitude: r.latitude,
      longitude: r.longitude,
      timezone: r.timezone!,
    }));
}

export function formatCoordinates(latitude: number, longitude: number) {
  return `${Math.abs(latitude).toFixed(4)}° ${latitude >= 0 ? "N" : "S"}, ${Math.abs(longitude).toFixed(4)}° ${longitude >= 0 ? "E" : "W"}`;
}
