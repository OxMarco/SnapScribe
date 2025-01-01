import { useEffect, useState } from "react";
import { Dialog } from "@capacitor/dialog";
import { Preferences } from "@capacitor/preferences";
import { useIonRouter } from "@ionic/react";
import { WELCOME_TEXT } from "../configs";

const ONBOARDED_STORAGE_KEY = "onboarded";

export const useOnboarding = () => {
  const [onboarded, setOnboarded] = useState<boolean>(true);
  const router = useIonRouter();

  useEffect(() => {
    const loadStatus = async () => {
      const { value } = await Preferences.get({ key: ONBOARDED_STORAGE_KEY });
      setOnboarded(value === "true");
    };
    loadStatus();
  }, []);

  const showWelcomeDialog = async () => {
    const { value } = await Dialog.confirm({
      title: "Welcome to SnapScribe",
      message: WELCOME_TEXT,
    });

    setOnboarded(true);
    await Preferences.set({ key: ONBOARDED_STORAGE_KEY, value: "true" });

    if (value && router) {
      router.push("/settings");
    }
  };

  return { onboarded, showWelcomeDialog };
};
