import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
} from "@ionic/react";
import { cog } from "ionicons/icons";

export const TabHeader = ({ title }: { title: string }) => {
  return (
    <IonHeader>
      <IonToolbar>
        <IonTitle>{title}</IonTitle>
        <IonButtons slot="primary">
          <IonButton routerLink="/settings">
            <IonIcon color="medium" slot="icon-only" ios={cog} />
          </IonButton>
        </IonButtons>
      </IonToolbar>
    </IonHeader>
  );
};
