import { Alert, Platform } from "react-native";

import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";

import { createFile, DirectoryType } from "./createFile";

export async function exportFile(
  directoryType: DirectoryType,
  directoryName: string,
  fileName: string,
  fileExtension: string,
  fileContent: string
) {
  // this also ensures the directory is created if it doesn't exist yet
  const fileUri = await createFile(
    directoryType,
    directoryName,
    fileName,
    fileExtension,
    fileContent
  );

  if (Platform.OS === "android") {
    Alert.alert("Success", "Backup saved in path" + ": " + fileUri);
  } else if (Platform.OS === "web") {
    Alert.alert("Uh oh, sharing isn't available on your platform");
  } else {
    // don't need to copy to local app directory before sharing like described here
    // https://stackoverflow.com/questions/61240694/how-to-share-a-local-photo-using-react-expo-sharing-shareasync
    // use getContentUriAsync instead
    if (fileUri) {
      const shareUrl = await FileSystem.getContentUriAsync(fileUri);
      await Sharing.shareAsync(shareUrl);
    } else {
      Alert.alert("Uh oh, sharing failed - could not create file!");
    }
  }
}
