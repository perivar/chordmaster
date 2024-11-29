/**
 * A wrapper around `setTimeout` to invoke a function after a delay with optional arguments.
 *
 * @param func - The function to be executed after the delay.
 * @param delay - The delay in milliseconds before the function is executed.
 * @param args - Additional arguments to pass to the function.
 * @returns The timer ID as returned by `setTimeout`.
 */
export const timeout = (
  func: (...args: unknown[]) => void, // Function with any number of arguments
  delay: number,
  ...args: Parameters<typeof func> // Infers the parameter types from the passed function
): ReturnType<typeof setTimeout> => {
  return setTimeout(() => func(...args), delay);
};
