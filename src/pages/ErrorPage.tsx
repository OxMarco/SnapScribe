import {
  IonPage,
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButton,
} from "@ionic/react";

export const ErrorPage = ({ error, resetErrorBoundary }: any) => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Error</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <div style={{ textAlign: "center" }}>
          <h2>Oops! Something went wrong.</h2>
          <p>
            An unexpected error occurred. Please try refreshing the page or
            returning to the home screen.
          </p>
          <IonButton
            color="primary"
            expand="block"
            onClick={resetErrorBoundary}
          >
            Refresh Page
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};
