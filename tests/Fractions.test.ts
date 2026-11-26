import { describe, it, expect } from "vitest";
import { gcd, areEquivalent, validDenominators } from "../src/shared/fractions";

describe("gcd", () => {
    it("returns the greatest common divisor", () => {
        expect(gcd(6, 8)).toBe(2);
    });

    it("returns 1 when there is no common factor", () => {
        expect(gcd(3, 7)).toBe(1);
    });

    it("returns the other number when one is 0", () => {
        expect(gcd(0, 8)).toBe(8);
    });

    it("throws when both numbers are 0", () => {
        expect(() => gcd(0, 0)).toThrow();
    });
});

describe("areEquivalent", () => {
    it("returns true for equivalent fractions", () => {
        expect(areEquivalent(3, 4, 6, 8)).toBe(true);
    });

    it("returns false for fractions that are not equivalent", () => {
        expect(areEquivalent(3, 4, 5, 8)).toBe(false);
    });

    it("returns true for two zero fractions with different denominators", () => {
        expect(areEquivalent(0, 4, 0, 8)).toBe(true);
    });
});

describe("validDenominators", () => {
    it("returns multiples of the simplified denominator", () => {
        expect(validDenominators(3, 4)).toEqual([4, 8, 12]);
    });

    it("simplifies the fraction first", () => {
        expect(validDenominators(6, 8)).toEqual([4, 8, 12]);
    });

    it("returns every even denominator for 1/2", () => {
        expect(validDenominators(1, 2)).toEqual([2, 4, 6, 8, 10, 12]);
    });

    it("returns every denominator from 2 to 12 for a zero numerator", () => {
        expect(validDenominators(0, 8)).toEqual([2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
    });

    it("returns only the denominator when no multiple fits under 12", () => {
        expect(validDenominators(5, 7)).toEqual([7]);
    });

    it("throws when the denominator is 0", () => {
        expect(() => validDenominators(1, 0)).toThrow();
    });

    it("throws when the numerator is not a whole number", () => {
        expect(() => validDenominators(2.5, 4)).toThrow();
    });
});