import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonButton,
  IonIcon,
  IonTitle,
  IonContent,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
} from "@ionic/react";
import { arrowBackCircleOutline } from "ionicons/icons";
import { useApp } from "../context/AppContext";
import { useGoBack } from "../hooks/useGoBack";

const SentencesPage: React.FC = () => {
  const { handleGoBack } = useGoBack();
  const { items, currentLang } = useApp();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton onClick={handleGoBack}>
              <IonIcon
                color="medium"
                slot="icon-only"
                ios={arrowBackCircleOutline}
              />
            </IonButton>
          </IonButtons>
          <IonTitle>Sentences</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Card Title</IonCardTitle>
            <IonCardSubtitle>Card Subtitle</IonCardSubtitle>
          </IonCardHeader>
          <IonCardContent>
            Here's a small text description for the card content. Nothing more,
            nothing less.
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default SentencesPage;
