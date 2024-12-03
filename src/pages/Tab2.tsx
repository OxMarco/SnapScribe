import React, { useState, useCallback } from "react";
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonItem,
  IonItemOption,
  IonItemOptions,
  IonItemSliding,
  IonLabel,
  IonList,
  IonModal,
  IonNote,
  IonPage,
  IonThumbnail,
  IonTitle,
  IonToolbar,
  IonAlert,
  useIonToast,
  IonSearchbar,
} from "@ionic/react";
import ReactTimeAgo from "react-time-ago";
import { useApp } from "../context/AppContext";
import { Item } from "../types";
import { ItemDetailsCard } from "../components/ItemDetailsCard";

const Tab2: React.FC = () => {
  const { items, removeItem } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item>();
  const [presentToast] = useIonToast();
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

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
        color: "danger",
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
      <IonHeader>
        <IonToolbar>
          <IonTitle>Archive</IonTitle>
        </IonToolbar>
        <IonToolbar>
          <IonSearchbar
            animated={true}
            value={searchQuery}
            onIonInput={(e) => setSearchQuery(e.detail.value!)}
          ></IonSearchbar>
        </IonToolbar>
      </IonHeader>
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
          <IonList inset={true} lines="inset">
            {items
              .filter((item) =>
                item.name.toLowerCase().includes(searchQuery.toLowerCase()),
              )
              .map((item) => (
                <IonItemSliding key={item.filepath}>
                  <IonItem onClick={() => displayModal(item)}>
                    <IonThumbnail slot="start">
                      <img
                        alt={item.name}
                        src={item.webviewPath}
                        className="ion-item-thumbnail"
                      />
                    </IonThumbnail>
                    <IonLabel>{item.name}</IonLabel>
                    <IonNote slot="end">
                      <ReactTimeAgo date={item.timestamp} locale="en-US" />
                    </IonNote>
                  </IonItem>
                  <IonItemOptions side="end">
                    <IonItemOption
                      color="danger"
                      onClick={() => confirmDelete(item.filepath)}
                    >
                      Delete
                    </IonItemOption>
                  </IonItemOptions>
                </IonItemSliding>
              ))}
          </IonList>
        ) : (
          <div className="ion-padding ion-text-center">
            <IonLabel color="medium">
              No items in the archive. Capture an item to get started!
            </IonLabel>
          </div>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Tab2;
