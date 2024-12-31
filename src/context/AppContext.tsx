import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { Directory, Filesystem } from "@capacitor/filesystem";
import { Preferences } from "@capacitor/preferences";
import { Device } from "@capacitor/device";
import {
  PHOTO_STORAGE_KEY,
  LANG_KEY,
  SUPPORTED_LANG,
  SPEECH_SPEED_KEY,
  DEFAULT_LANG,
  DEFAULT_SPEECH_SPEED,
} from "../configs";
import { Item } from "../types";

interface AppContextProps {
  userId: string | undefined;
  items: Item[];
  addItem: (item: Item) => void;
  removeItem: (itemId: string) => void;
  supportedLang: string[];
  currentLang: string;
  changeLang: (lang: string) => void;
  speechSpeed: number;
  changeSpeechSpeed: (speed: number) => void;
}

const AppContext = createContext<AppContextProps>({} as AppContextProps);

export const AppContextProvider = ({ children }: any) => {
  const [userId, setUserId] = useState<string>();
  const [items, setItems] = useState<Item[]>([]);
  const [currentLang, setCurrentLang] = useState<string>(DEFAULT_LANG);
  const [speechSpeed, setSpeechSpeed] = useState<number>(DEFAULT_SPEECH_SPEED);

  useEffect(() => {
    const loadSavedItems = async () => {
      const { value } = await Preferences.get({ key: PHOTO_STORAGE_KEY });
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
      const { value } = await Preferences.get({ key: LANG_KEY });
      if (!value || !SUPPORTED_LANG.includes(value)) return;

      setCurrentLang(value);
    };
    loadCurrentLang();
  }, []);

  useEffect(() => {
    const loadUserId = async () => {
      const value = await Device.getId();
      if (!value || !value.identifier) return;

      setUserId(value.identifier);
    };

    loadUserId();
  }, []);

  useEffect(() => {
    const loadSpeechSpeed = async () => {
      const { value } = await Preferences.get({ key: SPEECH_SPEED_KEY });
      if (!value) return;

      setSpeechSpeed(Number(value));
    };
    loadSpeechSpeed();
  }, []);

  const addItem = async (item: Item) => {
    const newItems = [item, ...items];
    setItems(newItems);

    await Preferences.set({
      key: PHOTO_STORAGE_KEY,
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
      key: PHOTO_STORAGE_KEY,
      value: JSON.stringify(newItems),
    });
  };

  const changeLang = async (lang: string) => {
    if (!SUPPORTED_LANG.includes(lang)) throw new Error("Unsupported language");
    setCurrentLang(lang);

    await Preferences.set({
      key: LANG_KEY,
      value: lang,
    });
  };

  const changeSpeechSpeed = async (newSpeed: number) => {
    setSpeechSpeed(newSpeed);

    await Preferences.set({
      key: SPEECH_SPEED_KEY,
      value: newSpeed.toString(),
    });
  };

  const values = useMemo(() => {
    return {
      userId,
      items,
      addItem,
      removeItem,
      supportedLang: SUPPORTED_LANG,
      currentLang,
      changeLang,
      speechSpeed,
      changeSpeechSpeed,
    };
  }, [userId, items, currentLang, speechSpeed]);

  return <AppContext.Provider value={values}>{children}</AppContext.Provider>;
};

export const useApp = (): AppContextProps => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppContext");
  }
  return context;
};
