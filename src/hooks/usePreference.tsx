import { useCallback, useEffect, useState } from "react";
import { Preferences } from "@capacitor/preferences";

export function usePreference<T = unknown>(defaultVal: T, storageKey: string) {
  const [val, setVal] = useState<T>(defaultVal);

  useEffect(() => {
    const loadVal = async () => {
      try {
        const { value } = await Preferences.get({ key: storageKey });
        if (value !== null) {
          setVal(JSON.parse(value) as T);
        }
      } catch (error) {
        console.error(`Error loading ${storageKey}`, error);
      }
    };

    loadVal();
  }, [storageKey]);

  const updateVal = useCallback(
    async (newValue: T | ((prevValue: T) => T)) => {
      const resolvedValue =
        typeof newValue === "function"
          ? (newValue as (prevValue: T) => T)(val)
          : newValue;

      setVal(resolvedValue);

      await Preferences.set({
        key: storageKey,
        value: JSON.stringify(resolvedValue),
      });
    },
    [val, storageKey],
  );

  return { val, updateVal };
}
