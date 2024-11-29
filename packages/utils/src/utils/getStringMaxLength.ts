/**
 * Truncates a string to a specified maximum length, adding an ellipsis ("...") if the string exceeds the limit.
 *
 * @param value - The input string to be truncated.
 * @param maxLength - The maximum allowed length for the string, including the ellipsis if truncation occurs.
 * @returns The original string if its length is within the limit, or a truncated version with "..." appended.
 */
export const getStringMaxLength = (
  value: string,
  maxLength: number
): string => {
  return value.length <= maxLength
    ? value // If the string length is within the limit, return it as is.
    : value.substring(0, maxLength - 3) + "..."; // Otherwise, truncate and append "..." to indicate continuation.
};
