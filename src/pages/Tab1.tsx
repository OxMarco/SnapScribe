import { useState } from "react";
import {
  IonContent,
  IonFab,
  IonFabButton,
  IonHeader,
  IonIcon,
  IonPage,
  IonText,
  IonToolbar,
  IonTitle,
  IonAlert,
  IonProgressBar,
} from "@ionic/react";
import { camera, close } from "ionicons/icons";
import { useApp } from "../context/AppContext";
import { usePhotoGallery } from "../hooks/usePhotoGallery";
import { Item } from "../types";
import { ItemDetailsCard } from "../components/ItemDetailsCard";

const Tab1: React.FC = () => {
  const [recentItem, setRecentItem] = useState<Item>();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const { addItem, apiKey } = useApp();
  const { takePhoto } = usePhotoGallery();

  const handleTakePhoto = async () => {
    setLoading(true);
    try {
      const item = await takePhoto();
      addItem(item);
      setRecentItem(item);
    } catch (error) {
      // Use more specific error handling
      const errorMsg =
        error instanceof Error ? error.message : "An unexpected error occurred";
      setErrorMessage(errorMsg);
      setIsOpen(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Identify</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="ion-padding">
        {!recentItem && !loading && (
          <div className="ion-text-center ion-padding-top">
            <IonText color="medium">
              <h2>Welcome to SnapScribe!</h2>
              {apiKey ? (
                <p>Tap the camera button to capture and identify any object</p>
              ) : (
                <p>To start, add your OpenAI api key in the Settings tab</p>
              )}
            </IonText>
          </div>
        )}

        {loading && (
          <>
            <br />
            <IonProgressBar type="indeterminate" color="primary" />
          </>
        )}

        <ItemDetailsCard item={recentItem} />

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
            disabled={apiKey.length == 0}
          >
            <IonIcon icon={recentItem ? close : camera} />
          </IonFabButton>
        </IonFab>
      </IonContent>
    </IonPage>
  );
};

export default Tab1;
