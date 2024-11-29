/**
 * Converts a given ratio to a percentage and rounds it to the nearest integer.
 *
 * @param ratio - The ratio to be converted (e.g., 0.75 for 75%).
 * @returns The percentage as an integer.
 *
 * Example:
 *   Input: 0.75
 *   Output: 75
 */
export const getPercentage = (ratio: number): number => {
  return Math.round(ratio * 100); // Multiply by 100 to convert ratio to percentage and round to nearest integer.
};
