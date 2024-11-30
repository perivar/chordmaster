import * as FileSystem from "expo-file-system";

export type DirectoryType = "cache" | "documents";

const getDirectoryPath = (
  directoryType: DirectoryType,
  directoryName: string
) => {
  const cacheDirPath = FileSystem.cacheDirectory + directoryName + "/";
  const documentDirPath = FileSystem.documentDirectory + directoryName + "/";

  // default is cacheDir
  let directoryPath = cacheDirPath;
  if (directoryType === "documents") {
    directoryPath = documentDirPath;
  }

  return directoryPath;
};

// Checks if directory exists. If not, creates it
const ensureDirExists = async (directoryPath: string) => {
  const dirInfo = await FileSystem.getInfoAsync(directoryPath);

  if (!dirInfo.exists) {
    console.log(`${directoryPath} doesn't exist, creating...`);

    await FileSystem.makeDirectoryAsync(directoryPath, {
      intermediates: true,
    });
  }
};

// https://localcoder.org/convert-base64-to-png-and-save-in-the-device-react-native-expo
export const createFile = async (
  directoryType: DirectoryType,
  directoryName: string,
  fileName: string,
  fileExtension: string,
  fileContent: string
): Promise<string | undefined> => {
  // Note! only a known extensions like .txt seem to work
  // const fileExtension = '.openchord'; // does not work
  // const fileExtension = '.txt'; // works ?!

  try {
    const directoryPath = getDirectoryPath(directoryType, directoryName);

    await ensureDirExists(directoryPath);

    const path = directoryPath + fileName + fileExtension;

    await FileSystem.writeAsStringAsync(path, fileContent, {
      encoding: FileSystem.EncodingType.UTF8,
    });

    return path;
  } catch (e) {
    console.error("Couldn't save file:", e);
  }
};
