import { Directory, Filesystem } from "@capacitor/filesystem";
import { CapacitorHttp, HttpResponse } from "@capacitor/core";
import { UserPhoto } from "./types";
import { API_KEY, SERVER_ENDPOINT } from "./configs";

export const getItemInfo = async (
  lang: string,
  photo: UserPhoto,
  userId: string,
): Promise<{ name: string; description: string; funFacts: string[] }> => {
  const file = await Filesystem.readFile({
    path: photo.filepath,
    directory: Directory.Data,
  });

  const options = {
    url: SERVER_ENDPOINT + "analyze/image",
    headers: {
      "Content-Type": "application/json",
      "X-User-Id": userId,
      "X-Api-Key": API_KEY,
    },
    data: {
      lang,
      image: file.data,
    },
  };

  const response: HttpResponse = await CapacitorHttp.post(options);

  if (!response.status || response.status != 200) {
    throw new Error(response.data?.error || `Failed to analyze image`);
  }

  return {
    name: response.data["name"],
    description: response.data["description"],
    funFacts: response.data["fun_facts"],
  };
};

export const getCredits = async (
  userId: string,
): Promise<{ credits: number }> => {
  const options = {
    url: SERVER_ENDPOINT + "credits",
    headers: {
      "Content-Type": "application/json",
      "X-User-Id": userId,
      "X-Api-Key": API_KEY,
    },
  };

  const response: HttpResponse = await CapacitorHttp.get(options);

  if (!response.status || response.status != 200) {
    throw new Error(response.data?.error || `Failed to retrieve user credits`);
  }

  return response.data;
};
