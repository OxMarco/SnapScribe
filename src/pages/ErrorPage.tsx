import {
  IonPage,
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButton,
  IonText,
  IonIcon,
} from "@ionic/react";
import { warningOutline, homeOutline, refreshOutline } from "ionicons/icons";

export const ErrorPage = ({ error, resetErrorBoundary }: any) => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Error</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <div className="ion-padding ion-text-center">
          {/* Error Icon */}
          <IonIcon
            icon={warningOutline}
            style={{ fontSize: "4rem", color: "var(--ion-color-danger)" }}
          />
          <h1 style={{ fontWeight: "bold" }}>Oops!</h1>
          <IonText color="medium">
            <p>
              Something went wrong. Please try refreshing the page or return to
              the home screen.
            </p>
          </IonText>
          {error && (
            <IonText color="danger">
              <i>{error.message}</i>
            </IonText>
          )}
          <div style={{ marginTop: "20px" }}>
            <IonButton
              color="medium"
              expand="block"
              onClick={resetErrorBoundary}
              style={{ marginBottom: "10px" }}
            >
              <IonIcon slot="start" icon={refreshOutline} />
              Refresh Page
            </IonButton>
            <IonButton color="primary" expand="block" routerLink="/">
              <IonIcon slot="start" icon={homeOutline} />
              Go to Home
            </IonButton>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};
