import {
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonContent,
  IonText,
} from "@ionic/react";

export const TermsOfServiceModal = ({
  termsModalOpen,
  setTermsModalOpen,
}: {
  termsModalOpen: boolean;
  setTermsModalOpen: (open: boolean) => void;
}) => (
  <IonModal
    isOpen={termsModalOpen}
    onDidDismiss={() => setTermsModalOpen(false)}
  >
    <IonHeader>
      <IonToolbar>
        <IonTitle>Terms of Service</IonTitle>
        <IonButtons slot="end">
          <IonButton onClick={() => setTermsModalOpen(false)}>Close</IonButton>
        </IonButtons>
      </IonToolbar>
    </IonHeader>
    <IonContent className="ion-padding">
      <IonText>
        <p>
          <strong>Last updated:</strong> Dec 2024
        </p>
        <p>
          Welcome to <em>SnapScribe</em>! By using our app, you agree to the
          following terms and conditions. Please read them carefully.
        </p>

        <h3>1. Acceptance of Terms</h3>
        <p>
          By downloading, installing, or using <em>SnapScribe</em>, you agree to
          comply with these Terms of Service and any applicable laws and
          regulations. If you do not agree, please refrain from using the app.
        </p>

        <h3>2. Use of the App</h3>
        <ul>
          <li>The app is intended for personal, non-commercial use only.</li>
          <li>
            You must not use the app for any illegal or unauthorised purposes.
          </li>
          <li>
            You agree not to attempt to access the app's backend systems or
            disrupt its functionality.
          </li>
        </ul>

        <h3>3. Intellectual Property</h3>
        <p>The app and its source code are released under a MIT license.</p>

        <h3>4. User-Generated Content</h3>
        <p>
          You are responsible for any images or data submitted to the app. By
          submitting content, you confirm you have the right to use and share
          it.
        </p>

        <h3>5. Third-Party Services</h3>
        <p>
          The app uses OpenAI for object recognition. By using the app, you also
          agree to OpenAI's Terms of Use and Privacy Policy. We are not
          responsible for the practices or performance of third-party services.
        </p>

        <h3>6. Limitation of Liability</h3>
        <p>
          The app is provided "as is" without warranties of any kind. The app
          developer is not liable for any damages resulting from the use of the
          app, including but not limited to loss of data, incorrect object
          recognition, or technical issues.
        </p>

        <h3>7. Changes to the Terms</h3>
        <p>
          We may update these Terms of Service at any time. Continued use of the
          app after changes are made constitutes your acceptance of the revised
          terms. Please review this page periodically for updates.
        </p>
      </IonText>
    </IonContent>
  </IonModal>
);
