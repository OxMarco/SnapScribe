import {
  Camera,
  CameraResultType,
  CameraSource,
  Photo,
} from "@capacitor/camera";
import { Filesystem, Directory } from "@capacitor/filesystem";
import { useApp } from "../context/AppContext";
import { base64FromPath } from "../helpers";
import { getItemInfo } from "../client";
import { Item, UserPhoto } from "../types";

export const usePhotoGallery = () => {
  const { currentLang, userId } = useApp();

  const takePhoto = async (): Promise<Item> => {
    if (!userId) throw new Error("Identification error");

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
      throw new Error("Invalid mime type");

    const randomChars = crypto.randomUUID();
    const fileName = randomChars + ".jpeg";
    const savedFileImage = await savePicture(photo, fileName);

    const { name, description, synonyms } = await getItemInfo(
      currentLang,
      savedFileImage,
      userId,
    );

    const item: Item = {
      ...savedFileImage,
      name,
      description,
      synonyms,
      timestamp: Date.now(),
      lang: currentLang,
    };

    return item;
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
};
