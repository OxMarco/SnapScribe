import React, { useState } from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonSelect,
  IonSelectOption,
  IonModal,
  IonButton,
  IonButtons,
  IonText,
  IonLabel,
  IonInput,
} from "@ionic/react";
import { useApp } from "../context/AppContext";

const Tab3: React.FC = () => {
  const { currentLang, supportedLang, changeLang, apiKey, saveApiKey } =
    useApp();
  const [termsModalOpen, setTermsModalOpen] = useState(false);
  const [privacyModalOpen, setPrivacyModalOpen] = useState(false);

  const TermsOfServiceModal = () => (
    <IonModal
      isOpen={termsModalOpen}
      onDidDismiss={() => setTermsModalOpen(false)}
    >
      <IonHeader>
        <IonToolbar>
          <IonTitle>Terms of Service</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={() => setTermsModalOpen(false)}>
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
            Welcome to <em>SnapScribe</em>! By using our app, you agree to the
            following terms and conditions. Please read them carefully.
          </p>

          <h3>1. Acceptance of Terms</h3>
          <p>
            By downloading, installing, or using <em>SnapScribe</em>, you agree
            to comply with these Terms of Service and any applicable laws and
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
            The app uses OpenAI for object recognition. By using the app, you
            also agree to OpenAI's Terms of Use and Privacy Policy. We are not
            responsible for the practices or performance of third-party
            services.
          </p>

          <h3>6. Limitation of Liability</h3>
          <p>
            The app is provided "as is" without warranties of any kind. The app
            developer is not liable for any damages resulting from the use of
            the app, including but not limited to loss of data, incorrect object
            recognition, or technical issues.
          </p>

          <h3>7. Changes to the Terms</h3>
          <p>
            We may update these Terms of Service at any time. Continued use of
            the app after changes are made constitutes your acceptance of the
            revised terms. Please review this page periodically for updates.
          </p>
        </IonText>
      </IonContent>
    </IonModal>
  );

  const PrivacyPolicyModal = () => (
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
            Welcome to <em>SnapScribe</em>! Your privacy is important to us.
            This Privacy Policy explains how your data is handled when you use
            our app.
          </p>

          <h3>1. Object Recognition and Third-Party Service Usage</h3>
          <p>
            This app uses OpenAI services to perform object recognition. Images
            you capture are sent directly to OpenAI servers for processing, and
            their privacy practices govern how this data is handled. We
            encourage you to review OpenAI's Privacy Policy at{" "}
            <a
              href="https://openai.com/en-GB/policies/row-privacy-policy/"
              target="_blank"
              rel="noopener noreferrer"
            >
              OpenAI Privacy Policy
            </a>{" "}
            for more details on how they manage your data.
          </p>

          <h3>2. Data Collection by the App Developer</h3>
          <p>
            The app developer does not collect, store, or share any data. All
            data, including the images you capture, is sent directly to OpenAI
            servers and does not pass through or get retained by the app
            developer.
          </p>

          <h3>3. Image Data</h3>
          <p>
            The images you take within the app are used solely for the purpose
            of providing object recognition results. These images are processed
            temporarily by OpenAI and are not retained or accessible to the app
            developer.
          </p>

          <h3>4. Children's Privacy</h3>
          <p>
            This app is not intended for use by children under the age of 13
            without parental supervision. If you believe your child has used the
            app and shared personal data, please contact OpenAI directly as the
            app developer does not collect any data.
          </p>

          <h3>5. Your Consent</h3>
          <p>
            By using this app, you consent to the handling of data as described
            in this Privacy Policy.
          </p>

          <h3>6. Changes to This Privacy Policy</h3>
          <p>
            We may update this Privacy Policy from time to time to reflect
            changes in technology, practices, or legal requirements. Please
            review this page periodically for any updates.
          </p>

          <h3>7. Contact Us</h3>
          <p>
            If you have any questions about this Privacy Policy or your
            experience with the app, please reach out to us at{" "}
            <a href="mailto:info@impossiblelabs.xyz">info@impossiblelabs.xyz</a>
            .
          </p>
        </IonText>
      </IonContent>
    </IonModal>
  );

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Settings</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonList inset={true}>
          <IonItem>
            <IonSelect
              label="Language"
              labelPlacement="floating"
              placeholder="Select Language"
              value={currentLang}
              onIonChange={(e) => changeLang(e.detail.value)}
            >
              {supportedLang.map((lang) => (
                <IonSelectOption key={lang} value={lang}>
                  {lang.charAt(0).toUpperCase() + lang.slice(1)}
                </IonSelectOption>
              ))}
            </IonSelect>
          </IonItem>

          <IonItem>
            <IonInput
              type="text"
              value={apiKey}
              label="OpenAI Api Key"
              labelPlacement="floating"
              placeholder="sk-xxx"
              onIonChange={(e) => saveApiKey(e.target.value as string)}
            ></IonInput>
          </IonItem>
        </IonList>

        <IonList inset={true}>
          <IonItem button onClick={() => setTermsModalOpen(true)}>
            <IonLabel>Terms of Service</IonLabel>
          </IonItem>

          <IonItem button onClick={() => setPrivacyModalOpen(true)}>
            <IonLabel>Privacy Policy</IonLabel>
          </IonItem>
        </IonList>

        <TermsOfServiceModal />
        <PrivacyPolicyModal />
      </IonContent>
    </IonPage>
  );
};

export default Tab3;
