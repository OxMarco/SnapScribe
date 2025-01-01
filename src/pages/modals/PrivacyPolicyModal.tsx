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

export const PrivacyPolicyModal = ({
  privacyModalOpen,
  setPrivacyModalOpen,
}: {
  privacyModalOpen: boolean;
  setPrivacyModalOpen: (open: boolean) => void;
}) => (
  <IonModal
    isOpen={privacyModalOpen}
    onDidDismiss={() => setPrivacyModalOpen(false)}
  >
    <IonHeader>
      <IonToolbar>
        <IonTitle>Privacy Policy</IonTitle>
        <IonButtons slot="end">
          <IonButton onClick={() => setPrivacyModalOpen(false)}>
            Close
          </IonButton>
        </IonButtons>
      </IonToolbar>
    </IonHeader>
    <IonContent className="ion-padding">
      <IonText>
        <p>
          <strong>Last updated:</strong> Dec 2024
        </p>
        <p>
          Welcome to <em>SnapScribe</em>! Your privacy is important to us. This
          Privacy Policy explains how your data is handled when you use our app.
        </p>

        <h3>1. Object Recognition and Third-Party Service Usage</h3>
        <p>
          This app uses an external server to facilitate object recognition
          services in collaboration with OpenAI. When you capture an image
          within the app:
        </p>
        <ul>
          <li>
            The image is first sent to an external server for temporary
            processing and transmission.
          </li>
          <li>
            The external server then forwards the image to OpenAI for object
            recognition.
          </li>
        </ul>
        <p>
          Both the external server and OpenAI process the data according to
          their respective privacy practices. We encourage you to review
          OpenAI's Privacy Policy at{" "}
          <a
            href="https://openai.com/en-GB/policies/row-privacy-policy/"
            target="_blank"
            rel="noopener noreferrer"
          >
            OpenAI Privacy Policy
          </a>
          , and their external server's privacy policy.
        </p>

        <h3>2. Data Collection by the App Developer</h3>
        <p>
          The app developer does not collect, store, or share any personal data.
          Images and associated data are temporarily handled by the external
          server and OpenAI solely for providing object recognition results. The
          app developer does not retain any of this data that is processed by
          the external server and OpenAI in an encrypted form (https
          connection).
        </p>

        <h3>3. Image Data</h3>
        <p>
          The images you take within the app are used solely for object
          recognition purposes. These images are processed temporarily by the
          external server and OpenAI. Neither the app developer nor the external
          server retains your image data after processing is complete.
        </p>

        <h3>4. Children's Privacy</h3>
        <p>
          This app can be used by individuals of all ages. Moderation on OpenAI
          side is used to ensure that the object recognition results are
          appropriate for all users.
        </p>

        <h3>5. Your Consent</h3>
        <p>
          By using this app, you consent to the handling of data as described in
          this Privacy Policy, including the use of an external server for
          temporary data processing.
        </p>

        <h3>6. Changes to This Privacy Policy</h3>
        <p>
          We may update this Privacy Policy from time to time to reflect changes
          in technology, practices, or legal requirements. Please review this
          page periodically for any updates.
        </p>

        <h3>7. Contact Us</h3>
        <p>
          If you have any questions about this Privacy Policy or your experience
          with the app, please reach out to us at{" "}
          <a href="mailto:info@impossiblelabs.xyz">info@impossiblelabs.xyz</a>.
        </p>
      </IonText>
    </IonContent>
  </IonModal>
);
