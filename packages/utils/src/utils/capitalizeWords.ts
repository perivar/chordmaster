/**
 * Capitalizes the first letter of each word in a given string.
 *
 * @param value - The input string to be processed.
 * @returns A string with each word's first letter capitalized.
 *
 * Example:
 *   Input: "this is a green shirt"
 *   Output: "This Is A Green Shirt"
 */
export const capitalizeWords = (value: string): string => {
  return value.replace(/(?:^|\s)\S/g, function (a) {
    return a.toUpperCase(); // Convert the matched character to uppercase.
  });
};
