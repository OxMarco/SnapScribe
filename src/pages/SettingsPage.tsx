import React, { useEffect, useState } from "react";
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
  IonButton,
  IonText,
  IonLabel,
  IonChip,
  IonRange,
  IonButtons,
  IonIcon,
  useIonRouter,
} from "@ionic/react";
import { arrowBackCircleOutline } from "ionicons/icons";
import { useApp } from "../context/AppContext";
import { TermsOfServiceModal } from "./modals/TermsOfServiceModal";
import { PrivacyPolicyModal } from "./modals/PrivacyPolicyModal";
import { getCredits } from "../client";

const SettingsPage: React.FC = () => {
  const {
    userId,
    currentLang,
    supportedLang,
    changeLang,
    speechSpeed,
    changeSpeechSpeed,
  } = useApp();
  const [creditsLeft, setCreditsLeft] = useState<number>(0);
  const [termsModalOpen, setTermsModalOpen] = useState(false);
  const [privacyModalOpen, setPrivacyModalOpen] = useState(false);
  const router = useIonRouter();

  useEffect(() => {
    const getCreditsLeft = async () => {
      if (!userId) return;

      const value = await getCredits(userId);
      setCreditsLeft(value.credits);
    };

    getCreditsLeft();
  }, [userId]);

  const handleGoBack = () => {
    if (router.canGoBack()) {
      router.goBack();
    } else {
      router.push("/"); // Fallback if no back history
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton onClick={handleGoBack}>
              <IonIcon slot="icon-only" ios={arrowBackCircleOutline} />
            </IonButton>
          </IonButtons>
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
            <IonRange
              labelPlacement="start"
              label="Speech speed"
              pin={true}
              pinFormatter={(value: number) => `${value}%`}
              min={10}
              max={100}
              snaps={true}
              step={10}
              ticks={true}
              value={speechSpeed}
              onIonChange={(e) => changeSpeechSpeed(Number(e.detail.value))}
            />
          </IonItem>
        </IonList>

        <IonList inset={true}>
          <IonItem>
            <IonText>
              Credits left:&nbsp;
              <IonChip color={creditsLeft == 0 ? "danger" : "medium"}>
                {creditsLeft}
              </IonChip>
            </IonText>
            <IonButton slot="end">Top Up</IonButton>
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

        <TermsOfServiceModal
          termsModalOpen={termsModalOpen}
          setTermsModalOpen={setTermsModalOpen}
        />
        <PrivacyPolicyModal
          privacyModalOpen={privacyModalOpen}
          setPrivacyModalOpen={setPrivacyModalOpen}
        />
      </IonContent>
    </IonPage>
  );
};

export default SettingsPage;
