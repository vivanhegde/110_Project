// dont pass 0
export function gcd(a: number, b: number): number {
    if (a === 0 && b === 0) {
        throw new Error("gcd(0, 0) is undefined");
    }
    if (a === 0) return b;
    if (b === 0) return a;

    for (let d = Math.min(a, b); d > 1; d--) {
        if (a % d === 0 && b % d === 0) {
            return d;
        }
    }
    return 1;
}

export function areEquivalent(n1: number, d1: number, n2: number, d2: number): boolean {
    return n1 * d2 === n2 * d1;
}

export function validDenominators(numerator: number, denominator: number, max: number = 12): number[] {
    if (!Number.isInteger(numerator) || numerator < 0) {
        throw new Error("Numerator must be a whole number 0 or more, got: " + numerator);
    }
    if (!Number.isInteger(denominator) || denominator < 1) {
        throw new Error("Denominator must be a whole number 1 or more, got: " + denominator);
    }

    const smallest = denominator / gcd(numerator, denominator);

    const result: number[] = [];
    for (let d = smallest; d <= max; d += smallest) {
        if (d >= 2) {
            result.push(d);
        }
    }
    return result;
}