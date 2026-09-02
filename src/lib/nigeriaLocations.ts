// Fetches Nigerian states and their LGAs (used here as "cities") from the
// public NG States & LGA API, so the list stays accurate without being
// hand-maintained in the codebase.
// Docs / source: https://github.com/vicayapo/Nigeria-Local-Government-Areas-and-States

const BASE_URL = "https://nga-states-lga.onrender.com";

export interface LocationOption {
  label: string;
  value: string;
}

export async function fetchStates(): Promise<LocationOption[]> {
  const res = await fetch(`${BASE_URL}/fetch`);
  if (!res.ok) {
    throw new Error("Failed to fetch states");
  }
  const data: string[] = await res.json();
  return data.map((state) => ({ label: state, value: state }));
}

export async function fetchCitiesByState(state: string): Promise<LocationOption[]> {
  if (!state) return [];
  const res = await fetch(`${BASE_URL}/?state=${encodeURIComponent(state)}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch cities for ${state}`);
  }
  const data: string[] = await res.json();
  return data.map((city) => ({ label: city, value: city }));
}
