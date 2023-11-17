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
import {
  handleGetActivitiesGivenTag,
  handleGetEventsBetweenTwoDates,
} from "../utils/server";
import placeholder from "../assets/images/placeholder.png";
import { formatDate } from "../utils/formatDate";
import EventsListEntry from "../components/Calendar/EventsListEntry";
import { getDateStrings } from "../utils/calcDates";

function CalendarPage() {
  const context = useContext();
  useIonViewWillEnter(() => {
    context.setShowTabs(true);
  });
  const [eventsToday, seteventsToday] = useState<any>([]);
  const [eventsTodayLoading, setEventsTodayLoading] = useState<boolean>(true);
  const Toast = useToast();
  // FetchEventsToday
  const fetchEventsToday = useCallback(async () => {
    const response = await handleGetEventsBetweenTwoDates(
      getDateStrings().today,
      getDateStrings().today
    );
    if (!response.success) {
      const toast = Toast.create({
        message: response.message,
        duration: 2000,
        color: "danger",
      });
      toast.present();
    }
    console.log(response.events);
    seteventsToday(response.events);
    setEventsTodayLoading(false);
  }, []);

  useEffect(() => {
    fetchEventsToday();
  }, [fetchEventsToday]);
  // FetchEventsWeek
  const [eventsWeek, seteventsWeek] = useState<any>([]);
  const [eventsWeekLoading, setEventsWeekLoading] = useState<boolean>(true);
  const fetchEventsWeek = useCallback(async () => {
    const response = await handleGetEventsBetweenTwoDates(
      getDateStrings().tomorrow,
      getDateStrings().sevenDaysFromNow
    );
    if (!response.success) {
      const toast = Toast.create({
        message: response.message,
        duration: 2000,
        color: "danger",
      });
      toast.present();
    }
    seteventsWeek(response.events);
    setEventsWeekLoading(false);
  }, []);

  useEffect(() => {
    fetchEventsWeek();
  }, [fetchEventsWeek]);
  // FetchEventsMonth
  const [eventsMonth, seteventsMonth] = useState<any>([]);
  const [eventsMonthLoading, setEventsMonthLoading] = useState<boolean>(true);
  const fetchEventsMonth = useCallback(async () => {
    const response = await handleGetEventsBetweenTwoDates(
      getDateStrings().eightDaysFromNow,
      getDateStrings().thirtyDaysFromNow
    );
    if (!response.success) {
      const toast = Toast.create({
        message: response.message,
        duration: 2000,
        color: "danger",
      });
      toast.present();
    }
    seteventsMonth(response.events);
    setEventsMonthLoading(false);
  }, []);

  useEffect(() => {
    fetchEventsMonth();
  }, [fetchEventsMonth]);

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
                <IonSkeletonText style={{ height: "4rem" }} animated />
                <IonSkeletonText style={{ height: "4rem" }} animated />
                <IonSkeletonText style={{ height: "4rem" }} animated />
              </>
            )}
            {/* Events This Week */}
            <IonItemDivider>
              <IonLabel>
                <h1>Next 7 Days</h1>
              </IonLabel>
            </IonItemDivider>
            {!eventsWeekLoading ? (
              <EventsListEntry events={eventsWeek}></EventsListEntry>
            ) : (
              <>
                <IonSkeletonText style={{ height: "4rem" }} animated />
                <IonSkeletonText style={{ height: "4rem" }} animated />
                <IonSkeletonText style={{ height: "4rem" }} animated />
              </>
            )}
            {/* Events This Month */}
            <IonItemDivider>
              <IonLabel>
                <h1>Next 30 Days</h1>
              </IonLabel>
            </IonItemDivider>
            {!eventsMonthLoading ? (
              <EventsListEntry events={eventsMonth}></EventsListEntry>
            ) : (
              <>
                <IonSkeletonText style={{ height: "4rem" }} animated />
                <IonSkeletonText style={{ height: "4rem" }} animated />
                <IonSkeletonText style={{ height: "4rem" }} animated />
              </>
            )}
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
