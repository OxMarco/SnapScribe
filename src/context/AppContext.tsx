import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { Item, UserPhoto } from "../types";
import { Directory, Filesystem } from "@capacitor/filesystem";
import { Preferences } from "@capacitor/preferences";

interface AppContextProps {
  apiKey: string;
  saveApiKey: (key: string) => void;
  items: Item[];
  addItem: (item: Item) => void;
  removeItem: (itemId: string) => void;
  supportedLang: string[];
  currentLang: string;
  changeLang: (lang: string) => void;
}

const AppContext = createContext<AppContextProps>({} as AppContextProps);

export const AppContextProvider = ({ children }: any) => {
  const PHOTO_STORAGE = "photos";
  const LANG = "lang";
  const API_KEY = "api-key";
  const SUPPORTED_LANG = [
    "english",
    "spanish",
    "portuguese",
    "french",
    "german",
    "chinese",
    "polish",
    "italian",
  ];

  const [apiKey, setApiKey] = useState<string>("");
  const [items, setItems] = useState<Item[]>([]);
  const [currentLang, setCurrentLang] = useState<string>("english");

  useEffect(() => {
    const loadSavedItems = async () => {
      const { value } = await Preferences.get({ key: PHOTO_STORAGE });
      const itemsInPreferences = value ? (JSON.parse(value) as Item[]) : [];

      for (let item of itemsInPreferences) {
        const file = await Filesystem.readFile({
          path: item.filepath,
          directory: Directory.Data,
        });
        // Load the photo as base64 data
        item.webviewPath = `data:image/jpeg;base64,${file.data}`;
      }
      setItems(itemsInPreferences);
    };
    loadSavedItems();
  }, []);

  useEffect(() => {
    const loadCurrentLang = async () => {
      const { value } = await Preferences.get({ key: LANG });
      if (!value || !SUPPORTED_LANG.includes(value)) return;

      setCurrentLang(value);
    };
    loadCurrentLang();
  }, []);

  useEffect(() => {
    const loadApiKey = async () => {
      const { value } = await Preferences.get({ key: API_KEY });
      if (!value) return;

      setApiKey(value);
    };
    loadApiKey();
  }, []);

  const addItem = async (item: Item) => {
    const newItems = [item, ...items];
    setItems(newItems);

    await Preferences.set({
      key: PHOTO_STORAGE,
      value: JSON.stringify(newItems),
    });
  };

  const removeItem = async (filepath: string) => {
    const newItems = items.filter((item) => item.filepath !== filepath);
    setItems(newItems);

    await Filesystem.deleteFile({
      path: filepath,
      directory: Directory.Data,
    });

    await Preferences.set({
      key: PHOTO_STORAGE,
      value: JSON.stringify(newItems),
    });
  };

  const changeLang = async (lang: string) => {
    if (!SUPPORTED_LANG.includes(lang)) return;
    setCurrentLang(lang);

    await Preferences.set({
      key: LANG,
      value: lang,
    });
  };

  const saveApiKey = async (apiKey: string) => {
    setApiKey(apiKey);

    await Preferences.set({
      key: API_KEY,
      value: apiKey,
    });
  };

  const values = useMemo(() => {
    return {
      apiKey,
      saveApiKey,
      items,
      addItem,
      removeItem,
      supportedLang: SUPPORTED_LANG,
      currentLang,
      changeLang,
    };
  }, [apiKey, items, currentLang]);

  return <AppContext.Provider value={values}>{children}</AppContext.Provider>;
};

export const useApp = (): AppContextProps => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppContext");
  }
  return context;
};
