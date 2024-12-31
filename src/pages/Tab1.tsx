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
  IonProgressBar,
  useIonToast,
} from "@ionic/react";
import { camera, close } from "ionicons/icons";
import { useApp } from "../context/AppContext";
import { usePhotoGallery } from "../hooks/usePhotoGallery";
import { ItemDetailsCard } from "../components/ItemDetailsCard";
import { Item } from "../types";

const Tab1: React.FC = () => {
  const [recentItem, setRecentItem] = useState<Item>();
  const [loading, setLoading] = useState<boolean>(false);
  const { addItem } = useApp();
  const { takePhoto } = usePhotoGallery();
  const [presentToast] = useIonToast();

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
              <p>Tap the camera button to capture and identify any object</p>
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
