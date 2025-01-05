import { useEffect, useState } from "react";
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
} from "@ionic/react";
import { arrowBackCircleOutline } from "ionicons/icons";
import Crossword from "@jaredreisinger/react-crossword";
import { useApp } from "../context/AppContext";
import { useGoBack } from "../hooks/useGoBack";
import { Item } from "../types";
import { Dialog } from "@capacitor/dialog";

const CrosswordPage: React.FC = () => {
  const { handleGoBack } = useGoBack();
  const { items, currentLang } = useApp();
  const [currentItems, setCurrentItems] = useState<Item[]>([]);
  const [data, setData] = useState<any>(null);

  const showAlert = async (text: string) => {
    await Dialog.alert({
      title: "Well done",
      message: text,
    });
  };

  const calculateCrosswordData = () => {
    const crosswordData: any = { across: {}, down: {} };

    currentItems.forEach((item, index) => {
      const firstWord = item.name.split(" ")[0].toUpperCase();
      crosswordData.across[index] = {
        clue: item.synonyms[0],
        answer: firstWord,
        row: index,
        col: 0,
      };
    });

    return crosswordData;
  };

  useEffect(() => {
    const filteredItems = items.filter((item) => item.lang === currentLang);
    if (filteredItems.length === 0) return;

    // Pick a random number of items between 1 and 5 (or the length of filtered items)
    const numItems = Math.min(
      Math.floor(Math.random() * 5) + 1,
      filteredItems.length,
    );
    const shuffledItems = [...filteredItems].sort(() => 0.5 - Math.random());
    const selectedItems = shuffledItems.slice(0, numItems);

    setCurrentItems(selectedItems);
  }, [items, currentLang]);

  useEffect(() => {
    if (!currentItems || currentItems.length == 0) return;

    const crosswordData = calculateCrosswordData();
    setData(crosswordData);
    console.log("crosswordData", crosswordData);
  }, [currentItems]);

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
          <IonTitle>Crossword</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        {data ? (
          <IonCard>
            <IonCardContent>
              <Crossword
                data={data}
                onAnswerCorrect={() => showAlert("You got this row!")}
                onCrosswordCorrect={(isCorrect) =>
                  isCorrect && showAlert("The crossword is complete!")
                }
              />
            </IonCardContent>
          </IonCard>
        ) : (
          <div className="ion-padding text-center">
            <IonTitle color="medium">No words available</IonTitle>
          </div>
        )}
      </IonContent>
    </IonPage>
  );
};

export default CrosswordPage;
