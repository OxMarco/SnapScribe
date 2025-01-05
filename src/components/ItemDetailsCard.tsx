import React, { useState } from "react";
import {
  IonCard,
  IonCardContent,
  IonIcon,
  IonImg,
  IonChip,
  IonLabel,
  IonSkeletonText,
} from "@ionic/react";
import { musicalNoteOutline, volumeHighOutline } from "ionicons/icons";
import { TextToSpeech } from "@capacitor-community/text-to-speech";
import { useApp } from "../context/AppContext";
import { getBCP47Code } from "../helpers";
import { Item } from "../types";

export const ItemDetailsCard: React.FC<{ item: Item | undefined }> = ({
  item,
}) => {
  const { speechSpeed } = useApp();
  const [isSpeaking, setIsSpeaking] = useState(false);

  const listen = async () => {
    if (!item) return;
    try {
      setIsSpeaking(true);
      const lang = getBCP47Code(item.lang);
      await TextToSpeech.speak({
        text: item.name,
        lang,
        rate: speechSpeed / 100,
        pitch: 1.0,
        volume: 1.0,
        category: "ambient",
        queueStrategy: 1,
      });
    } catch (error) {
      throw new Error("TTS error");
    } finally {
      setIsSpeaking(false);
    }
  };

  if (!item) return null;

  return (
    <IonCard className="w-full max-w-2xl mx-auto overflow-hidden shadow-lg">
      <IonImg
        src={item.webviewPath}
        alt={item.name}
        className="w-full h-64 object-cover"
      />

      <IonCardContent className="p-6 space-y-6">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold">{item.name}</h1>
          {isSpeaking ? (
            <IonIcon
              icon={musicalNoteOutline}
              className="w-6 h-6 animate-pulse"
              aria-label="Now speaking"
            />
          ) : (
            <IonIcon
              onClick={listen}
              icon={volumeHighOutline}
              className="w-6 h-6"
              aria-label="Read the item name out loud"
            />
          )}
        </div>

        <p className="italic">{item.description}</p>

        <div>
          <h2 className="text-xl font-bold mb-3">Thesaurus</h2>
          <div className="flex flex-wrap gap-2">
            {item.synonyms.map((synonym, index) => (
              <IonChip key={index}>
                <IonLabel>{synonym}</IonLabel>
              </IonChip>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-2">Fun fact</h2>
          <p>{item.funFact}</p>
        </div>
      </IonCardContent>
    </IonCard>
  );
};
