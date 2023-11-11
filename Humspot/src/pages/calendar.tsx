import {
  IonContent,
  IonLoading,
  IonNote,
  IonPage,
  IonProgressBar,
  IonRippleEffect,
  IonSkeletonText,
  IonThumbnail,
  IonToolbar,
  useIonRouter,
  useIonViewWillEnter,
} from "@ionic/react";
import React, { useState, useEffect, useCallback } from "react";
import {
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonList,
  IonItem,
  IonItemDivider,
  IonAvatar,
  IonLabel,
} from "@ionic/react";
import FilterButton from "../components/Shared/FilterButton";
import { useContext } from "../utils/my-context";
import { useToast } from "@agney/ir-toast";
import { handleGetActivitiesGivenTag } from "../utils/server";
import placeholder from "../assets/images/placeholder.png";
import { formatDate } from "../utils/formatDate";
import EventsListEntry from "../components/Calendar/EventsListEntry";

function CalendarPage() {
  const context = useContext();
  useIonViewWillEnter(() => {
    context.setShowTabs(true);
  });
  const [eventsToday, seteventsToday] = useState<any>([]);
  const [eventsTodayLoading, setEventsTodayLoading] = useState<boolean>(true);
  const Toast = useToast();
  const fetchEventsToday = useCallback(async () => {
    const response = await handleGetActivitiesGivenTag(1, "School");
    if (!response.success) {
      const toast = Toast.create({
        message: response.message,
        duration: 2000,
        color: "danger",
      });
      toast.present();
    }
    seteventsToday(response.activities);
    setEventsTodayLoading(false);
  }, []);

  useEffect(() => {
    fetchEventsToday();
  }, [fetchEventsToday]);
  const [eventsWeek, seteventsWeek] = useState<any>([]);
  const [eventsWeekLoading, setEventsWeekLoading] = useState<boolean>(true);
  const fetchEventsWeek = useCallback(async () => {
    const response = await handleGetActivitiesGivenTag(1, "School");
    if (!response.success) {
      const toast = Toast.create({
        message: response.message,
        duration: 2000,
        color: "danger",
      });
      toast.present();
    }
    seteventsWeek(response.activities);
    setEventsWeekLoading(false);
  }, []);

  useEffect(() => {
    fetchEventsWeek();
  }, [fetchEventsWeek]);

  const router = useIonRouter();

  return (
    <>
      <IonPage>
        <FilterButton></FilterButton>
        <IonContent>
          <IonList>
            <IonItemDivider>
              <IonLabel>
                <h1>Today</h1>
              </IonLabel>
            </IonItemDivider>
            {/* Events Today */}
            {!eventsTodayLoading ? (
              <EventsListEntry events={eventsToday}></EventsListEntry>
            ) : (
              <>
                <IonSkeletonText style={{ height: "5rem" }} animated />
                <IonSkeletonText style={{ height: "5rem" }} animated />
                <IonSkeletonText style={{ height: "5rem" }} animated />
              </>
            )}
            {/* Events This Week */}
            <IonItemDivider>
              <IonLabel>
                <h1>This Week</h1>
              </IonLabel>
            </IonItemDivider>
            {/* Events This Month */}
            <IonItemDivider>
              <IonLabel>
                <h1>This Month</h1>
              </IonLabel>
            </IonItemDivider>
          </IonList>
        </IonContent>
        {eventsTodayLoading || eventsWeekLoading ? (
          <IonProgressBar
            type="indeterminate"
            color={"secondary"}
          ></IonProgressBar>
        ) : (
          <></>
        )}
      </IonPage>
    </>
  );
}

export default CalendarPage;
