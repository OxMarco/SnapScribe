export interface UserPhoto {
  filepath: string;
  webviewPath: string;
}

export interface Item extends UserPhoto {
  name: string;
  description: string;
  synonyms: string[];
  funFact: string;
  timestamp: number;
  lang: string;
}
