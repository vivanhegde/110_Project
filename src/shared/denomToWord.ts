const DENOMINATOR_WORDS: Record<number, [singular: string, plural: string]> = {
  2: ["half", "halves"],
  3: ["third", "thirds"],
  4: ["fourth", "fourths"],
  5: ["fifth", "fifths"],
  6: ["sixth", "sixths"],
  7: ["seventh", "sevenths"],
  8: ["eighth", "eighths"],
  9: ["ninth", "ninths"],
  10: ["tenth", "tenths"],
  11: ["eleventh", "elevenths"],
  12: ["twelfth", "twelfths"],
};

/**
 * Converts a denominator to its fraction word.
 *
 * @param denominator - The bottom number of the fraction (2 to 12).
 * @param plural - Decides singular or plural. Defaults to false (singular).
 * @returns The word for the denominator, e.g. "eighth" or "eighths".
 * @throws If the denominator is not between 2 and 12.
 *
 * @example
 * denomToWord(8);       // "eighth"
 * denomToWord(8, true); // "eighths"
 * denomToWord(2, true); // "halves"
 */
export function denomToWord(denominator: number, plural: Boolean = false): string {
  const entry = DENOMINATOR_WORDS[denominator];
  if (!entry) {
    throw new Error(`Unsupported denominator: ${denominator}`);
  }
  return plural ? entry[1] : entry[0];
}