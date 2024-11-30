import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";

export const importFile = async () => {
  const response = await DocumentPicker.getDocumentAsync({
    type: "*/*",
    copyToCacheDirectory: true,
  });

  let success = false;
  let filename = "";
  let fileContent = "";
  let errorObject: unknown;

  if (!response.canceled) {
    success = true;

    // TODO: support more than one file
    const fileUri = response.assets[0].uri;
    filename = response.assets[0].name;

    try {
      fileContent = await FileSystem.readAsStringAsync(fileUri, {
        encoding: FileSystem.EncodingType.UTF8,
      });
    } catch (error) {
      console.log("importFile -> readAsStringAsync >>" + error);
      errorObject = error;
    }
  }

  return {
    success,
    error: errorObject,
    filename: filename,
    fileContent: fileContent,
  };
};
