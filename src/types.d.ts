export interface UserPhoto {
  filepath: string;
  webviewPath: string;
}

export interface Item extends UserPhoto {
  name: string;
  description: string;
  funFacts: string[];
  timestamp: number;
}
