import { IonContent, IonPage } from "@ionic/react";
import React, { useState, useEffect } from "react";
import {
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonList,
  IonItem,
  IonItemDivider,
  IonAvatar,
  IonLabel,
} from "@ionic/react";
import FilterButton from "../elements/FilterButton";

function CalendarPage() {
  const [weekitems, setWeekItems] = useState<string[]>([]);
  const [monthitems, setMonthItems] = useState<string[]>([]);

  const generateThisWeek = () => {
    const newItems = [];
    for (let i = 0; i < 5; i++) {
      newItems.push(`Event ${1 + weekitems.length + i}`);
    }
    setWeekItems([...weekitems, ...newItems]);
  };

  const generateThisMonth = () => {
    const newItems = [];
    for (let i = 0; i < 25; i++) {
      newItems.push(`Event ${1 + monthitems.length + i}`);
    }
    setMonthItems([...monthitems, ...newItems]);
  };

  useEffect(() => {
    generateThisWeek();
    generateThisMonth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <IonPage>
        <FilterButton></FilterButton>
        <IonContent>
          <IonList>
            <IonItemDivider>
              <IonLabel>This Week</IonLabel>
            </IonItemDivider>
            {weekitems.map((item, index) => (
              <IonItem key={item}>
                <IonAvatar slot="start">
                  <img
                    src={"https://picsum.photos/80/80?random=" + index}
                    alt="avatar"
                  />
                </IonAvatar>
                <IonLabel>{item}</IonLabel>
              </IonItem>
            ))}
            <IonItemDivider>
              <IonLabel>This Month</IonLabel>
            </IonItemDivider>
            {monthitems.map((item, index) => (
              <IonItem key={item}>
                <IonAvatar slot="start">
                  <img
                    src={"https://picsum.photos/80/80?random=" + index}
                    alt="avatar"
                  />
                </IonAvatar>
                <IonLabel>{item}</IonLabel>
              </IonItem>
            ))}
          </IonList>

          <IonInfiniteScroll
            onIonInfinite={(ev) => {
              generateThisMonth();
              setTimeout(() => ev.target.complete(), 500);
            }}
          >
            <IonInfiniteScrollContent></IonInfiniteScrollContent>
          </IonInfiniteScroll>
        </IonContent>
      </IonPage>
    </>
  );
}

export default CalendarPage;
