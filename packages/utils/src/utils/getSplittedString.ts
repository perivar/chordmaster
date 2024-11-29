/**
 * Converts a string written in Hungarian notation or containing underscores into a readable, spaced string.
 * Also capitalizes the first letter of each word.
 *
 * @param value - The input string to be converted.
 * @returns A human-readable string with proper word spacing and capitalization.
 *
 * Example:
 *   Input: "ThisIsAGreen_shirt"
 *   Output: "This Is A Green Shirt"
 */
import { capitalizeWords } from "./capitalizeWords";

export const getSplittedString = (value: string): string => {
  if (!value || value.length === 0) return ""; // Return an empty string if the input is null, undefined, or empty.

  let val = "";
  if (typeof value !== "string") {
    // If the input is not a string, convert it to a string representation.
    val = JSON.stringify(value);
  } else {
    val = value; // Use the input string as is.
  }

  // Split the string into words based on underscores, spaces, or uppercase letters.
  const splitted = val
    .split(/[\s_]+|(?=[A-Z])/) // Split on spaces, underscores, or before uppercase letters.
    // .split(/[\s_]+/)
    .join(" ") // Join the resulting words with a single space.
    .toLowerCase(); // Convert the entire string to lowercase.

  // Capitalize the first letter of each word and return the result.
  // return capitalizeFirstLetter(splitted)
  return capitalizeWords(splitted);
};
