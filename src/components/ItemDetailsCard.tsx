import React from "react";
import {
  IonCard,
  IonCardContent,
  IonImg,
  IonItem,
  IonNote,
  IonText,
} from "@ionic/react";
import { Item } from "../types";

export const ItemDetailsCard: React.FC<{ item: Item | undefined }> = ({
  item,
}) => {
  if (!item) return null;

  return (
    <IonCard>
      <IonImg src={item.webviewPath} alt={item.name} />
      <IonCardContent>
        <h1>{item.name}</h1>
        <p>
          <i>{item.description}</i>
        </p>
        <br />
        <h2><b>Fun Facts</b></h2>
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
