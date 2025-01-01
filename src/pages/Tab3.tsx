import React from "react";
import { IonPage, IonContent } from "@ionic/react";
import { Flashcard } from "../components/Flashcard";
import { TabHeader } from "../components/TabHeader";

const Tab3: React.FC = () => {
  return (
    <IonPage>
      <TabHeader title="Study" />
      <IonContent fullscreen>
        <Flashcard />
      </IonContent>
    </IonPage>
  );
};

export default Tab3;
