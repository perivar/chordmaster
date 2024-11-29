/**
 * Creates a delay for the specified number of milliseconds.
 * Can be used with `await` to pause execution in an async function.
 *
 * @param ms - The delay duration in milliseconds.
 * @returns A promise that resolves after the specified delay.
 *
 * Example:
 *   // Pause for 5 seconds
 *   await delay(5000);
 */
export const delay = (ms: number): Promise<void> => {
  return new Promise(resolve => {
    setTimeout(resolve, ms); // Resolve the promise after the delay.
  });
};
