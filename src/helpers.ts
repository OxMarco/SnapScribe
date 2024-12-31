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

export const getBCP47Code = (languageName: string): string => {
  if (languageName.includes("US")) return "en-US";
  if (languageName.includes("UK")) return "en-UK";
  if (languageName.includes("spanish")) return "es-ES";
  if (languageName.includes("portuguese")) return "pt-PT";
  if (languageName.includes("french")) return "fr-FR";
  if (languageName.includes("german")) return "de-DE";
  if (languageName.includes("chinese")) return "zh-CN";
  if (languageName.includes("polish")) return "pl-PL";
  if (languageName.includes("italian")) return "it-IT";

  throw new Error("Unsupported language");
};
