/**
 * Capitalizes only the first letter of the given string.
 *
 * @param value - The input string to be processed.
 * @returns A string with the first letter capitalized and the rest unchanged.
 *
 * Example:
 *   Input: "hello world"
 *   Output: "Hello world"
 */
export const capitalizeFirstLetter = (value: string): string => {
  return value.charAt(0).toUpperCase() + value.slice(1);
  // Capitalize the first character and append the rest of the string.
};
