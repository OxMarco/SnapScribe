import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { Directory, Filesystem } from "@capacitor/filesystem";
import { Preferences } from "@capacitor/preferences";
import { Device } from "@capacitor/device";
import { SUPPORTED_LANG, DEFAULT_LANG, DEFAULT_SPEECH_SPEED } from "../configs";
import { Item } from "../types";

export const PHOTO_STORAGE_KEY = "photos";
export const LANG_STORAGE_KEY = "lang";
export const SPEECH_SPEED_STORAGE_KEY = "speechspeed";

interface AppContextProps {
  userId: string | undefined;
  items: Item[];
  addItem: (item: Item) => Promise<void>;
  removeItem: (filepath: string) => Promise<void>;
  supportedLang: string[];
  currentLang: string;
  changeLang: (lang: string) => Promise<void>;
  speechSpeed: number;
  changeSpeechSpeed: (speed: number) => Promise<void>;
}

interface AppContextProviderProps {
  children: ReactNode;
}

const AppContext = createContext<AppContextProps>({} as AppContextProps);

export const AppContextProvider = ({ children }: AppContextProviderProps) => {
  const [userId, setUserId] = useState<string>();
  const [items, setItems] = useState<Item[]>([]);
  const [currentLang, setCurrentLang] = useState<string>(DEFAULT_LANG);
  const [speechSpeed, setSpeechSpeed] = useState<number>(DEFAULT_SPEECH_SPEED);

  /**
   * Load all persisted data (items, userId, currentLang, speechSpeed)
   * on first render in parallel.
   */
  useEffect(() => {
    const loadAllData = async () => {
      try {
        await Promise.all([
          loadUserId(),
          loadItems(),
          loadLang(),
          loadSpeechSpeed(),
        ]);
      } catch (error) {
        throw new Error("Error loading initial data:");
      }
    };
    loadAllData();
  }, []);

  /**
   * Load user device ID
   */
  const loadUserId = async () => {
    try {
      const { identifier } = await Device.getId();
      if (identifier) {
        setUserId(identifier);
      }
    } catch (error) {
      throw new Error("Error fetching device ID:");
    }
  };

  /**
   * Load items from Preferences, then read corresponding files
   * in parallel to get base64 data.
   */
  const loadItems = async () => {
    try {
      const { value } = await Preferences.get({ key: PHOTO_STORAGE_KEY });
      const savedItems: Item[] = value ? JSON.parse(value) : [];
      const itemsWithBase64 = await Promise.all(
        savedItems.map(async (item) => {
          try {
            const file = await Filesystem.readFile({
              path: item.filepath,
              directory: Directory.Data,
            });
            return {
              ...item,
              webviewPath: `data:image/jpeg;base64,${file.data}`,
            };
          } catch (error) {
            throw new Error(`Error reading file: ${item.filepath}`);
            // If it fails, you could return the original item or filter it out
            return item;
          }
        }),
      );
      setItems(itemsWithBase64);
    } catch (error) {
      throw new Error("Error loading items from Preferences:");
    }
  };

  /**
   * Load current language from Preferences
   */
  const loadLang = async () => {
    try {
      const { value } = await Preferences.get({ key: LANG_STORAGE_KEY });
      if (value && SUPPORTED_LANG.includes(value)) {
        setCurrentLang(value);
      }
    } catch (error) {
      throw new Error("Error loading language from Preferences:");
    }
  };

  /**
   * Load speech speed from Preferences
   */
  const loadSpeechSpeed = async () => {
    try {
      const { value } = await Preferences.get({
        key: SPEECH_SPEED_STORAGE_KEY,
      });
      if (value) {
        setSpeechSpeed(Number(value));
      }
    } catch (error) {
      throw new Error("Error loading speech speed from Preferences:");
    }
  };

  /**
   * Add a new item and store it in Preferences
   */
  const addItem = useCallback(
    async (item: Item) => {
      try {
        const newItems = [item, ...items];
        setItems(newItems);
        await Preferences.set({
          key: PHOTO_STORAGE_KEY,
          value: JSON.stringify(newItems),
        });
      } catch (error) {
        throw new Error("Error adding item:");
      }
    },
    [items],
  );

  /**
   * Remove an item by filepath and update Preferences
   */
  const removeItem = useCallback(
    async (filepath: string) => {
      try {
        const newItems = items.filter((item) => item.filepath !== filepath);
        setItems(newItems);

        // Attempt to delete the file
        await Filesystem.deleteFile({
          path: filepath,
          directory: Directory.Data,
        });

        // Update Preferences
        await Preferences.set({
          key: PHOTO_STORAGE_KEY,
          value: JSON.stringify(newItems),
        });
      } catch (error) {
        throw new Error(`Error removing item: ${filepath}`);
      }
    },
    [items],
  );

  /**
   * Update the current language and store it in Preferences
   */
  const changeLang = useCallback(async (lang: string) => {
    if (!SUPPORTED_LANG.includes(lang)) {
      throw new Error("Unsupported language");
    }
    try {
      setCurrentLang(lang);
      await Preferences.set({
        key: LANG_STORAGE_KEY,
        value: lang,
      });
    } catch (error) {
      throw new Error("Error setting language:");
    }
  }, []);

  /**
   * Update the speech speed and store it in Preferences
   */
  const changeSpeechSpeed = useCallback(async (newSpeed: number) => {
    try {
      setSpeechSpeed(newSpeed);
      await Preferences.set({
        key: SPEECH_SPEED_STORAGE_KEY,
        value: newSpeed.toString(),
      });
    } catch (error) {
      throw new Error("Error setting speech speed:");
    }
  }, []);

  /**
   * Memoize the context value to avoid unnecessary re-renders.
   * Notice how we include the relevant dependencies for each property.
   */
  const contextValue = useMemo(
    () => ({
      userId,
      items,
      addItem,
      removeItem,
      supportedLang: SUPPORTED_LANG,
      currentLang,
      changeLang,
      speechSpeed,
      changeSpeechSpeed,
    }),
    [
      userId,
      items,
      addItem,
      removeItem,
      currentLang,
      changeLang,
      speechSpeed,
      changeSpeechSpeed,
    ],
  );

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
};

export const useApp = (): AppContextProps => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppContext");
  }
  return context;
};
