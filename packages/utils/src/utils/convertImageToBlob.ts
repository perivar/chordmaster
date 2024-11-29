/**
 * Converts an image URL (URI) to a Blob object.
 *
 * This function uses XMLHttpRequest to fetch the image from the provided URI and then
 * converts the response to a Blob. A timeout is added on resolve to avoid crashes
 * in certain environments like React Native.
 *
 * For more details about the issue, see:
 * https://github.com/expo/expo/issues/2402#issuecomment-443726662
 *
 * @param uri - The URI of the image to be fetched and converted to a Blob.
 * @returns A promise that resolves to the image as a Blob object.
 *
 * Example usage:
 *   const imageBlob = await convertImageToBlob('https://example.com/image.jpg');
 */
export const convertImageToBlob = async (uri: string): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    // When the request is successfully completed
    xhr.onload = function () {
      // use timeout on resolve to avoid crash
      // https://issueexplorer.com/issue/facebook/react-native/32784
      setTimeout(() => {
        resolve(xhr.response);
      }, 500);
    };

    // If an error occurs during the request
    xhr.onerror = function (e) {
      console.log(e);
      reject(new TypeError("Network request failed"));
    };

    xhr.responseType = "blob";
    xhr.open("GET", uri, true);
    xhr.send(null);
  });
};
