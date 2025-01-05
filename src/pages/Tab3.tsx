import React from "react";
import {
  IonPage,
  IonContent,
  IonCard,
  IonCardTitle,
  IonCardContent,
  IonCardHeader,
} from "@ionic/react";
import { TabHeader } from "../components/TabHeader";

const Tab3: React.FC = () => {
  return (
    <IonPage>
      <TabHeader title="Study" />
      <IonContent fullscreen>
        <IonCard routerLink="/flashcards">
          <IonCardHeader>
            <IonCardTitle>Flashcards</IonCardTitle>
          </IonCardHeader>

          <IonCardContent>Guess the word from the picture</IonCardContent>
        </IonCard>

        <IonCard routerLink="/crossword">
          <IonCardHeader>
            <IonCardTitle>Crossword</IonCardTitle>
          </IonCardHeader>

          <IonCardContent>
            Fill in the crossword puzzle with your own words
          </IonCardContent>
        </IonCard>

        <IonCard routerLink="/sentences">
          <IonCardHeader>
            <IonCardTitle>Sentences</IonCardTitle>
          </IonCardHeader>

          <IonCardContent>
            Pratice writing a sentence about the object
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default Tab3;
