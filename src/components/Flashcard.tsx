import { useEffect, useState, useCallback } from "react";
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonIcon,
  IonImg,
  IonInput,
  IonLoading,
  IonText,
  IonTitle,
} from "@ionic/react";
import { refresh, sparkles } from "ionicons/icons";
import { Preferences } from "@capacitor/preferences";
import { useApp } from "../context/AppContext";
import { Item } from "../types";
import { CACHE_EXPIRATION } from "../configs";

export const CACHE_EXPIRY_STORAGE_KEY = "cache";
export const USED_ITEMS_STORAGE_KEY = "useditems";

export const Flashcard = () => {
  const { items, currentLang } = useApp();

  const [loading, setLoading] = useState<boolean>(false);

  // Cache & used items
  const [cacheExpiry, setCacheExpiry] = useState<number>(
    Date.now() + CACHE_EXPIRATION,
  );
  const [usedItems, setUsedItems] = useState<string[]>([]);

  // Filtered items & current card
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);
  const [currentItem, setCurrentItem] = useState<Item>();

  // Guessing state
  const [guess, setGuess] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [feedback, setFeedback] = useState("");

  /**
   * Helper: Update local preferences for used items
   */
  const updateUsedItems = useCallback(
    async (newUsedItems: string[]) => {
      setUsedItems(newUsedItems);
      await Preferences.set({
        key: USED_ITEMS_STORAGE_KEY,
        value: JSON.stringify(newUsedItems),
      });
    },
    [setUsedItems],
  );

  /**
   * Helper: Reset cache expiry both in state and (optionally) in Preferences
   */
  const resetCacheExpiry = useCallback(async () => {
    const newExpiry = Date.now() + CACHE_EXPIRATION;
    setCacheExpiry(newExpiry);
    await Preferences.set({
      key: CACHE_EXPIRY_STORAGE_KEY,
      value: newExpiry.toString(),
    });
  }, []);

  /**
   * Helper: pick a random item that has not been used.
   */
  const getNextItem = useCallback(() => {
    if (!filteredItems.length) return;
    const availableItems = filteredItems.filter(
      (item) => !usedItems.includes(item.name),
    );
    if (!availableItems.length) {
      setCurrentItem(undefined);
      return;
    }
    const randomIndex = Math.floor(Math.random() * availableItems.length);
    setCurrentItem(availableItems[randomIndex]);
  }, [filteredItems, usedItems]);

  /**
   * Load cache expiry & used items on mount
   */
  useEffect(() => {
    const loadFromPreferences = async () => {
      const [{ value: cacheValue }, { value: usedItemsValue }] =
        await Promise.all([
          Preferences.get({ key: CACHE_EXPIRY_STORAGE_KEY }),
          Preferences.get({ key: USED_ITEMS_STORAGE_KEY }),
        ]);

      if (cacheValue) {
        setCacheExpiry(Number(cacheValue));
      }
      if (usedItemsValue) {
        setUsedItems(JSON.parse(usedItemsValue) as string[]);
      }
    };

    loadFromPreferences().catch(console.error);
  }, []);

  /**
   * Whenever items or currentLang changes, refilter
   */
  useEffect(() => {
    const nextFiltered = items.filter((item) => item.lang === currentLang);
    setFilteredItems(nextFiltered);
  }, [items, currentLang]);

  /**
   * Check cache expiration and pick an item whenever
   * filteredItems / usedItems / cacheExpiry changes.
   */
  useEffect(() => {
    // If cache is expired, remove random portion of used items
    if (cacheExpiry && Date.now() > cacheExpiry) {
      const itemsToRemove = Math.ceil(usedItems.length * Math.random());
      const remainingItems = usedItems.slice(itemsToRemove);
      updateUsedItems(remainingItems).catch(console.error);
      resetCacheExpiry().catch(console.error);
    }

    // Always pick a next item if there isn't one
    getNextItem();
  }, [
    filteredItems,
    usedItems,
    cacheExpiry,
    getNextItem,
    resetCacheExpiry,
    updateUsedItems,
  ]);

  /**
   * Reset guess feedback and attempts
   */
  const resetGuessState = useCallback(() => {
    setFeedback("");
    setGuess("");
    setAttempts(0);
  }, []);

  /**
   * Handle a guess. If correct, proceed to next.
   * If incorrect too many times, reveal and proceed.
   */
  const handleGuess = async () => {
    if (!currentItem) return;

    setLoading(true);

    const isCorrect =
      guess.trim().toLowerCase() === currentItem.name.toLowerCase();

    if (isCorrect) {
      setFeedback("Correct!");
      await updateUsedItems([...usedItems, currentItem.name]);
      setTimeout(() => {
        resetGuessState();
        getNextItem();
        setLoading(false);
      }, 1000);
    } else {
      const nextAttempts = attempts + 1;
      setAttempts(nextAttempts);

      if (nextAttempts >= 3) {
        setFeedback(`The correct answer was: ${currentItem.name}`);
        await updateUsedItems([...usedItems, currentItem.name]);
        setTimeout(() => {
          resetGuessState();
          getNextItem();
          setLoading(false);
        }, 2000);
      } else {
        setFeedback("Try again!");
        setTimeout(() => {
          setFeedback("");
          setGuess("");
          setLoading(false);
        }, 1000);
      }
    }
  };

  /**
   * Reset items entirely
   */
  const resetItems = async () => {
    await updateUsedItems([]);
    await resetCacheExpiry();
    resetGuessState();
    getNextItem();
  };

  /**
   * Rendering logic
   */
  if (filteredItems.length === 0) {
    return (
      <div className="ion-padding ion-text-center">
        <IonTitle color="medium">No flashcards available</IonTitle>
      </div>
    );
  }

  if (loading)
    return (
      <IonLoading
        isOpen={true}
        message="Loading next card..."
        duration={5000}
      />
    );

  // If no currentItem is available, we've used them all
  if (!currentItem) {
    return (
      <IonCard className="ion-padding ion-text-center">
        <IonCardContent>
          <IonText color="success">
            <h1 style={{ fontWeight: "bold", marginBottom: "10px" }}>
              <IonIcon icon={sparkles} />
              &nbsp; Congratulations!
            </h1>
            <p
              style={{ color: "var(--ion-color-medium)", marginBottom: "10px" }}
            >
              You have reviewed all the flashcards. Well done!
            </p>
          </IonText>
          <IonButton color="primary" onClick={resetItems} expand="block">
            <IonIcon icon={refresh} />
            &nbsp; Reset Flashcards
          </IonButton>
        </IonCardContent>
      </IonCard>
    );
  }

  // Default: Show the currentItem and guess input
  return (
    <IonCard>
      <IonImg
        src={currentItem.webviewPath}
        alt={currentItem.name}
        style={{ width: "100%" }}
      />
      <IonCardContent>
        {!feedback && (
          <>
            <IonInput
              placeholder="Enter your guess"
              value={guess}
              clearInput={true}
              fill="outline"
              onIonInput={(e) => setGuess(e.detail.value!)}
            />
            <IonButton
              disabled={guess.trim().length === 0}
              onClick={handleGuess}
              expand="block"
            >
              Submit
            </IonButton>
          </>
        )}
        {feedback && (
          <IonText color={feedback === "Correct!" ? "success" : "danger"}>
            <p>{feedback}</p>
          </IonText>
        )}
      </IonCardContent>
    </IonCard>
  );
};
