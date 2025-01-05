import { useEffect, useState, useCallback } from "react";
import {
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonContent,
  IonHeader,
  IonIcon,
  IonImg,
  IonInput,
  IonLabel,
  IonPage,
  IonText,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { arrowBackCircleOutline } from "ionicons/icons";
import { useApp } from "../context/AppContext";
import { Item } from "../types";
import { useGoBack } from "../hooks/useGoBack";

const FlashcardsPage: React.FC = () => {
  const [currentItem, setCurrentItem] = useState<Item>();
  const [guess, setGuess] = useState("");
  const [attempts, setAttempts] = useState(1);
  const [feedback, setFeedback] = useState("");
  const { items, currentLang } = useApp();
  const { handleGoBack } = useGoBack();

  const correctAnswer = () => {
    if (feedback === "Correct!") return true;
    return false;
  };

  const correctOrNoAnswer = () => {
    if (feedback === "Correct!" || feedback === "") return true;
    return false;
  };

  const getNextItem = () => {
    const filteredItems = items.filter((item) => item.lang === currentLang);
    console.log("filteredItems", filteredItems);
    if (!filteredItems || filteredItems.length === 0) return;
    const randomIndex = Math.floor(Math.random() * filteredItems.length);
    setCurrentItem(filteredItems[randomIndex]);
  };

  useEffect(() => {
    if (!items || items.length == 0) return;
    if (!currentItem) getNextItem();
  }, [currentItem, items]);

  const resetGuessState = () => {
    setFeedback("");
    setGuess("");
    setAttempts(1);
  };

  const handleGuess = async () => {
    if (!currentItem) return;

    const isCorrect =
      guess.trim().toLowerCase() === currentItem.name.toLowerCase();

    if (isCorrect) {
      setFeedback("Correct!");
      setTimeout(() => {
        resetGuessState();
        getNextItem();
      }, 1000);
    } else {
      const nextAttempts = attempts + 1;
      setAttempts(nextAttempts);

      if (nextAttempts > 3) {
        setFeedback(`The correct answer was: ${currentItem.name}`);
        setTimeout(() => {
          resetGuessState();
          getNextItem();
        }, 2000);
      } else {
        setFeedback("Try again!");
        setTimeout(() => {
          setFeedback("");
          setGuess("");
        }, 1000);
      }
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton onClick={handleGoBack}>
              <IonIcon
                color="medium"
                slot="icon-only"
                icon={arrowBackCircleOutline}
              />
            </IonButton>
          </IonButtons>
          <IonTitle>Flashcards</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        {!currentItem && (
          <div className="ion-padding text-center">
            <IonTitle color="medium">No flashcards available</IonTitle>
          </div>
        )}

        {currentItem && (
          <IonCard>
            <IonImg
              src={currentItem.webviewPath}
              alt={currentItem.name}
              style={
                !correctOrNoAnswer()
                  ? {
                      filter:
                        "hue-rotate(80deg) saturate(800%) brightness(0.1)",
                    }
                  : {}
              }
            />

            <IonCardContent>
              {!feedback && (
                <div className="space-y-4">
                  <IonLabel className="block">
                    Enter your guess ({attempts} of 3 attempts)
                  </IonLabel>
                  <IonInput
                    placeholder="Your guess..."
                    value={guess}
                    clearInput
                    onIonInput={(e) => setGuess(e.detail.value!)}
                  />
                  <IonButton
                    disabled={guess.trim().length === 0}
                    onClick={handleGuess}
                    expand="block"
                  >
                    Submit
                  </IonButton>
                </div>
              )}

              {feedback && (
                <IonText
                  className="block ion-padding text-center"
                  color={correctAnswer() ? "success" : "danger"}
                >
                  <p>{feedback}</p>
                </IonText>
              )}
            </IonCardContent>
          </IonCard>
        )}
      </IonContent>
    </IonPage>
  );
};

export default FlashcardsPage;
