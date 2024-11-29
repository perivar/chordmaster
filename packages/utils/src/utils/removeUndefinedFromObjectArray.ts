// for each of the objects in the array, remove the keys with null or undefined value
interface StringIndexable {
  [key: string]: unknown;
}

/**
 * Removes keys with `null` or `undefined` values from each object in an array.
 *
 * @template T - A generic type that extends a string-indexable object.
 * @param objectArray - An array of objects to process.
 * @returns A new array of objects with keys having `null` or `undefined` values removed.
 */
export const removeUndefinedFromObjectArray = <T extends StringIndexable>(
  objectArray: T[]
): T[] => {
  const returnArray: T[] = []; // Initialize an empty array to hold the processed objects.

  objectArray.forEach(obj => {
    // Iterate over each object in the array.
    Object.keys(obj).forEach(k => {
      // For each key in the object:
      if (obj[k] === null || obj[k] === undefined) {
        delete obj[k]; // Remove the key if its value is `null` or `undefined`.
      }
    });

    returnArray.push(obj); // Add the cleaned object to the return array.
  });

  return returnArray; // Return the processed array.
};
