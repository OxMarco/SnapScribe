import { Directory, Filesystem } from "@capacitor/filesystem";
import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";
import { UserPhoto } from "./types";

export async function base64FromPath(path: string): Promise<string> {
  const response = await fetch(path);
  const blob = await response.blob();

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
      } else {
        reject("method did not return a string");
      }
    };
    reader.readAsDataURL(blob);
  });
}

export async function getItemInfo(
  lang: string,
  photo: UserPhoto,
  apiKey: string,
): Promise<{ name: string; description: string; funFacts: string[] }> {
  // Read the file from the filesystem
  const file = await Filesystem.readFile({
    path: photo.filepath,
    directory: Directory.Data,
  });

  const openai = new OpenAI({
    apiKey,
    dangerouslyAllowBrowser: true,
  });

  const Picture = z.object({
    name: z.string(),
    description: z.string(),
    funFacts: z.array(z.string()),
  });

  const completion = await openai.beta.chat.completions.parse({
    model: "gpt-4o-2024-08-06",
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `Describe the object in the image, tell me its name, describe it and give three funny facts about it. Use a simple language, use ${lang} only`,
          },
          {
            type: "image_url",
            image_url: {
              url: `data:image/jpeg;base64,${file.data}`,
            },
          },
        ],
      },
    ],
    response_format: zodResponseFormat(Picture, "picture"),
  });

  const picture = completion.choices[0].message.parsed;
  if (!picture) throw "Picture interpretation error";

  return {
    name: picture.name,
    description: picture.description,
    funFacts: picture.funFacts,
  };
}
