import React, { useState } from "react";
import { IonCard, IonCardContent, IonIcon, IonImg } from "@ionic/react";
import { musicalNoteOutline, volumeHighOutline } from "ionicons/icons";
import { TextToSpeech } from "@capacitor-community/text-to-speech";
import { useApp } from "../context/AppContext";
import { getBCP47Code } from "../helpers";
import { Item } from "../types";
import "./ItemDetailsCard.css";

export const ItemDetailsCard: React.FC<{ item: Item | undefined }> = ({
  item,
}) => {
  const { currentLang, speechSpeed } = useApp();

  const [isSpeaking, setIsSpeaking] = useState(false);

  const listen = async () => {
    if (!item) return;

    setIsSpeaking(true);
    const lang = getBCP47Code(currentLang);

    await TextToSpeech.speak({
      text: item.name,
      lang,
      rate: speechSpeed / 100,
      pitch: 1.0,
      volume: 1.0,
      category: "ambient",
      queueStrategy: 1,
    });

    setIsSpeaking(false);
  };

  if (!item) return null;

  return (
    <IonCard>
      <IonImg src={item.webviewPath} alt={item.name} />
      <IonCardContent>
        <h1>
          {item.name}&nbsp;
          {isSpeaking ? (
            <IonIcon icon={musicalNoteOutline} className="inline-icon" />
          ) : (
            <IonIcon
              onClick={listen}
              icon={volumeHighOutline}
              className="inline-icon"
            />
          )}
        </h1>
        <p>
          <i>{item.description}</i>
        </p>
        <br />
        <h2>
          <b>Fun Facts</b>
        </h2>
        <ul>
          {item.funFacts.map((fact, index) => (
            <li key={index}>{fact}</li>
          ))}
        </ul>
      </IonCardContent>
    </IonCard>
  );
};

export default ItemDetailsCard;
