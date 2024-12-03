import {
  Camera,
  CameraResultType,
  CameraSource,
  Photo,
} from "@capacitor/camera";
import { Filesystem, Directory } from "@capacitor/filesystem";
import { base64FromPath, getItemInfo } from "../helpers";
import { Item, UserPhoto } from "../types";
import { useApp } from "../context/AppContext";

export function usePhotoGallery() {
  const { currentLang, apiKey } = useApp();

  const takePhoto = async (): Promise<Item> => {
    try {
      const photo = await Camera.getPhoto({
        resultType: CameraResultType.Uri,
        source: CameraSource.Camera,
        quality: 100,
      });

      if (
        !photo.format.includes("gif") &&
        !photo.format.includes("png") &&
        !photo.format.includes("jpg") &&
        !photo.format.includes("jpeg") &&
        !photo.format.includes("heic") &&
        !photo.format.includes("webp")
      )
        throw "Invalid mime type";

      const randomChars = crypto.randomUUID();
      const fileName = randomChars + ".jpeg";
      const savedFileImage = await savePicture(photo, fileName);

      const { name, description, funFacts } = await getItemInfo(
        currentLang,
        savedFileImage,
        apiKey,
      );

      const item: Item = {
        ...savedFileImage,
        name,
        description,
        funFacts,
        timestamp: Date.now(),
      };

      return item;
    } catch (error) {
      throw error;
    }
  };

  const savePicture = async (
    photo: Photo,
    fileName: string,
  ): Promise<UserPhoto> => {
    const base64Data = await base64FromPath(photo.webPath!);
    await Filesystem.writeFile({
      path: fileName,
      data: base64Data,
      directory: Directory.Data,
    });

    // Use webPath to display the new image instead of base64 since it's
    // already loaded into memory
    return {
      filepath: fileName,
      webviewPath: photo.webPath || "", /// TODO fixme
    };
  };

  return {
    takePhoto,
  };
}
