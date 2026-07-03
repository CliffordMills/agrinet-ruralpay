import { detectProvider, providerLabel, providerColor } from "@/lib/payments/providers";

describe("detectProvider", () => {
  it("detects MTN from 024 prefix", () => {
    expect(detectProvider("0241234567")).toBe("MTN");
  });

  it("detects MTN from +233 prefix", () => {
    expect(detectProvider("+233541234567")).toBe("MTN");
  });

  it("detects Telecel from 020 prefix", () => {
    expect(detectProvider("0201234567")).toBe("Telecel");
  });

  it("detects AirtelTigo from 027 prefix", () => {
    expect(detectProvider("0271234567")).toBe("AirtelTigo");
  });

  it("detects AirtelTigo from 056 prefix", () => {
    expect(detectProvider("0561234567")).toBe("AirtelTigo");
  });

  it("returns Unknown for unrecognised prefix", () => {
    expect(detectProvider("0301234567")).toBe("Unknown");
  });
});

describe("providerLabel", () => {
  it("returns full MTN label", () => {
    expect(providerLabel("MTN")).toBe("MTN Mobile Money");
  });
});

describe("providerColor", () => {
  it("returns yellow for MTN", () => {
    expect(providerColor("MTN")).toContain("yellow");
  });

  it("returns red for Telecel", () => {
    expect(providerColor("Telecel")).toContain("red");
  });
});
