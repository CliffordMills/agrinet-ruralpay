import { scoreTier, tierColor, tierBg, scoreGaugePercent } from "@/lib/finance/creditScoring";

describe("scoreTier", () => {
  it("returns Excellent for score >= 750", () => {
    expect(scoreTier(750)).toBe("Excellent");
    expect(scoreTier(850)).toBe("Excellent");
  });

  it("returns Good for 600-749", () => {
    expect(scoreTier(600)).toBe("Good");
    expect(scoreTier(749)).toBe("Good");
  });

  it("returns Fair for 400-599", () => {
    expect(scoreTier(400)).toBe("Fair");
    expect(scoreTier(599)).toBe("Fair");
  });

  it("returns Poor for 1-399", () => {
    expect(scoreTier(1)).toBe("Poor");
    expect(scoreTier(399)).toBe("Poor");
  });

  it("returns No Score for 0", () => {
    expect(scoreTier(0)).toBe("No Score");
  });
});

describe("scoreGaugePercent", () => {
  it("returns 0 for score 0", () => {
    expect(scoreGaugePercent(0)).toBe(0);
  });

  it("returns 100 for score 850", () => {
    expect(scoreGaugePercent(850)).toBe(100);
  });

  it("clamps at 100 for scores above 850", () => {
    expect(scoreGaugePercent(900)).toBe(100);
  });

  it("returns approximately 50 for score 425", () => {
    expect(scoreGaugePercent(425)).toBeCloseTo(50, 0);
  });
});

describe("tierColor and tierBg", () => {
  it("returns green for Excellent", () => {
    expect(tierColor("Excellent")).toContain("green");
    expect(tierBg("Excellent")).toContain("green");
  });

  it("returns red for Poor", () => {
    expect(tierColor("Poor")).toContain("red");
  });
});
