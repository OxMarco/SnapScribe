import React, { useState, useCallback } from "react";
import { trashOutline } from "ionicons/icons";
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonModal,
  IonPage,
  IonTitle,
  IonToolbar,
  IonAlert,
  useIonToast,
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonCol,
  IonGrid,
  IonIcon,
  IonImg,
  IonRow,
  IonText,
  IonBadge,
  IonCardContent,
} from "@ionic/react";
import ReactTimeAgo from "react-time-ago";
import { useApp } from "../context/AppContext";
import { ItemDetailsCard } from "../components/ItemDetailsCard";
import { TabHeader } from "../components/TabHeader";
import { Item } from "../types";
import { getBCP47Code } from "../helpers";
import "./tab2.css";

const Tab2: React.FC = () => {
  const { items, removeItem } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item>();
  const [presentToast] = useIonToast();
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const displayModal = useCallback((item: Item) => {
    setSelectedItem(item);
    setIsOpen(true);
  }, []);

  const handleDelete = useCallback(
    (filepath: string) => {
      removeItem(filepath);
      presentToast({
        message: "Item deleted successfully",
        duration: 1000,
        color: "primary",
      });
    },
    [removeItem, presentToast],
  );

  const confirmDelete = useCallback((filepath: string) => {
    setItemToDelete(filepath);
    setShowDeleteAlert(true);
  }, []);

  return (
    <IonPage>
      <TabHeader title="Archive" />
      <IonContent fullscreen>
        <IonModal isOpen={isOpen} onDidDismiss={() => setIsOpen(false)}>
          <IonHeader>
            <IonToolbar>
              <IonButtons slot="end">
                <IonButton onClick={() => setIsOpen(false)}>Close</IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent className="ion-padding">
            <ItemDetailsCard item={selectedItem} />
          </IonContent>
        </IonModal>

        <IonAlert
          isOpen={showDeleteAlert}
          header={"Confirm Deletion"}
          message={"Are you sure you want to delete this item?"}
          buttons={[
            {
              text: "Cancel",
              role: "cancel",
              handler: () => setShowDeleteAlert(false),
            },
            {
              text: "Delete",
              role: "destructive",
              handler: () => {
                if (itemToDelete) {
                  handleDelete(itemToDelete);
                  setShowDeleteAlert(false);
                }
              },
            },
          ]}
        />

        {items && items.length > 0 ? (
          <IonGrid fixed>
            <IonRow>
              {items.map((item) => (
                <IonCol key={item.filepath}>
                  <IonCard
                    className="archive-card"
                    button
                    onClick={() => displayModal(item)}
                  >
                    <div style={{ position: "relative" }}>
                      <div className="square-image-container">
                        <IonImg src={item.webviewPath} alt={item.name} />
                      </div>
                      <IonButton
                        fill="outline"
                        color="danger"
                        style={{
                          position: "absolute",
                          top: "8px",
                          right: "8px",
                          zIndex: 10,
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          confirmDelete(item.filepath);
                        }}
                      >
                        <IonIcon icon={trashOutline} />
                      </IonButton>
                    </div>
                    <IonCardHeader>
                      <IonCardTitle></IonCardTitle>
                      <IonCardSubtitle
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <ReactTimeAgo
                          date={item.timestamp}
                          locale={getBCP47Code(item.lang)}
                        />
                        <IonBadge color="medium">{item.lang}</IonBadge>
                      </IonCardSubtitle>
                    </IonCardHeader>
                    <IonCardContent>
                      <IonText>
                        <h1>{item.name}</h1>
                      </IonText>
                    </IonCardContent>
                  </IonCard>
                </IonCol>
              ))}
            </IonRow>
          </IonGrid>
        ) : (
          <div className="ion-padding ion-text-center">
            <IonTitle color="medium">No items in the archive</IonTitle>
          </div>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Tab2;
