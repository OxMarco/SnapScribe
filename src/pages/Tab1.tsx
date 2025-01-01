import { useEffect, useState } from "react";
import {
  IonContent,
  IonFab,
  IonFabButton,
  IonIcon,
  IonPage,
  IonText,
  IonProgressBar,
  useIonToast,
} from "@ionic/react";
import { camera, close } from "ionicons/icons";
import { useApp } from "../context/AppContext";
import { usePhotoGallery } from "../hooks/usePhotoGallery";
import { useOnboarding } from "../hooks/useOnboarding";
import { ItemDetailsCard } from "../components/ItemDetailsCard";
import { TabHeader } from "../components/TabHeader";
import { Item } from "../types";

const Tab1: React.FC = () => {
  const [recentItem, setRecentItem] = useState<Item>();
  const [loading, setLoading] = useState<boolean>(false);
  const { addItem } = useApp();
  const { takePhoto } = usePhotoGallery();
  const { onboarded, showWelcomeDialog } = useOnboarding();
  const [presentToast] = useIonToast();

  useEffect(() => {
    if (!onboarded) showWelcomeDialog();
  }, [onboarded, showWelcomeDialog]);

  const handleTakePhoto = async () => {
    setLoading(true);
    try {
      const item = await takePhoto();
      addItem(item);
      setRecentItem(item);
    } catch (error) {
      const errorMsg =
        error instanceof Error ? error.message : "An unexpected error occurred";
      presentToast({
        message: errorMsg,
        duration: 2500,
        color: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <IonPage>
      <TabHeader title="Identify" />
      <IonContent fullscreen className="ion-padding">
        {!recentItem && !loading && (
          <div className="ion-text-center ion-padding-top">
            <IonText color="medium">
              <h2 className="first-step">Ready when you are!</h2>
            </IonText>
          </div>
        )}

        {loading && (
          <>
            <div className="ion-text-center ion-padding-top">
              <IonText color="secondary">
                <h3>Identification in progress...</h3>
              </IonText>
              <IonProgressBar type="indeterminate" color="primary" />
            </div>
          </>
        )}

        <ItemDetailsCard item={recentItem} />

        {!loading && (
          <IonFab
            vertical="bottom"
            horizontal={recentItem ? "end" : "center"}
            slot="fixed"
          >
            <IonFabButton
              onClick={
                recentItem ? () => setRecentItem(undefined) : handleTakePhoto
              }
              color={recentItem ? "danger" : "primary"}
            >
              <IonIcon icon={recentItem ? close : camera} />
            </IonFabButton>
          </IonFab>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Tab1;
