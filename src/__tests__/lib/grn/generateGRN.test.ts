import { generateGRNNumber } from "@/lib/grn/generateGRN";

describe("generateGRNNumber", () => {
  it("returns a string starting with GRN-", () => {
    expect(generateGRNNumber()).toMatch(/^GRN-/);
  });

  it("matches expected format GRN-YYYYMMDD-NNNNN", () => {
    const grn = generateGRNNumber();
    expect(grn).toMatch(/^GRN-\d{8}-\d{5}$/);
  });

  it("generates unique values", () => {
    const grns = new Set(Array.from({ length: 100 }, () => generateGRNNumber()));
    expect(grns.size).toBeGreaterThan(90);
  });

  it("date portion matches today", () => {
    const grn = generateGRNNumber();
    const now = new Date();
    const year = now.getFullYear().toString();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    expect(grn).toContain(`GRN-${year}${month}${day}`);
  });
});
