import { useIonRouter } from "@ionic/react";

export const useGoBack = () => {
  const router = useIonRouter();

  const handleGoBack = () => {
    if (router.canGoBack()) {
      router.goBack();
    } else {
      router.push("/"); // Fallback if no back history
    }
  };

  return { handleGoBack };
};
