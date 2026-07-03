export type MoMoProvider = "MTN" | "Telecel" | "AirtelTigo" | "Bank" | "Unknown";

const PREFIX_MAP: Record<string, MoMoProvider> = {
  "024": "MTN",
  "054": "MTN",
  "055": "MTN",
  "059": "MTN",
  "020": "Telecel",
  "050": "Telecel",
  "027": "AirtelTigo",
  "057": "AirtelTigo",
  "026": "AirtelTigo",
  "056": "AirtelTigo",
};

export function detectProvider(phone: string): MoMoProvider {
  const normalised = phone.replace(/^\+233/, "0").replace(/\s+/g, "");
  const prefix = normalised.slice(0, 3);
  return PREFIX_MAP[prefix] ?? "Unknown";
}

export function providerLabel(provider: MoMoProvider): string {
  const labels: Record<MoMoProvider, string> = {
    MTN: "MTN Mobile Money",
    Telecel: "Telecel Cash",
    AirtelTigo: "AirtelTigo Money",
    Bank: "Bank Transfer",
    Unknown: "Unknown",
  };
  return labels[provider];
}

export function providerColor(provider: MoMoProvider): string {
  const colors: Record<MoMoProvider, string> = {
    MTN: "bg-yellow-100 text-yellow-800",
    Telecel: "bg-red-100 text-red-800",
    AirtelTigo: "bg-blue-100 text-blue-800",
    Bank: "bg-gray-100 text-gray-700",
    Unknown: "bg-gray-100 text-gray-500",
  };
  return colors[provider];
}
