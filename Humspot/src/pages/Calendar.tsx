/**
 * @file Calendar.tsx
 * @fileoverview the 3rd tab on the tab bar. Contains a list of upcoming events.
 */

import {
  IonContent,
  IonNote,
  IonPage,
  IonProgressBar,
  IonSkeletonText,
  useIonViewDidEnter,
  IonList,
  IonItemDivider,
  IonLabel,
} from "@ionic/react";
import { useState, useEffect, useCallback, useRef } from "react";
import { useContext } from "../utils/hooks/useContext";
import { useToast } from "@agney/ir-toast";
import { handleGetEventsBetweenTwoDates } from "../utils/server";
import EventsListEntry from "../components/Calendar/EventsListEntry";
import { getDateStrings } from "../utils/functions/calcDates";

import '../App.css';

function CalendarPage() {
  const context = useContext();
  const pageRef = useRef();
  const [eventsToday, seteventsToday] = useState<any>([]);
  const [eventsTodayLoading, setEventsTodayLoading] = useState<boolean>(true);

  const Toast = useToast();
  // FetchEventsToday
  const fetchEventsToday = useCallback(async () => {
    setEventsTodayLoading(true);
    const response = await handleGetEventsBetweenTwoDates(
      getDateStrings().today,
      getDateStrings().today
    );
    if (!response.success) {
      const toast = Toast.create({
        message: response.message,
        position: 'bottom',
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
    setEventsWeekLoading(true);
    const response = await handleGetEventsBetweenTwoDates(
      getDateStrings().tomorrow,
      getDateStrings().sevenDaysFromNow
    );
    if (!response.success) {
      const toast = Toast.create({
        message: response.message,
        position: 'bottom',
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

  const [eventsMonthLoading, setEventsMonthLoading] = useState<boolean>(true);
  const [eventsMonth, setEventsMonth] = useState<any[]>([]);
  const fetchEventsMonth = useCallback(async () => {
    setEventsMonthLoading(true);
    const response = await handleGetEventsBetweenTwoDates(
      getDateStrings().eightDaysFromNow,
      getDateStrings().thirtyDaysFromNow
    );
    if (!response.success) {
      const toast = Toast.create({
        message: response.message,
        position: 'bottom',
        duration: 2000,
        color: "danger",
      });
      toast.present();
    }
    setEventsMonth(response.events);
    setEventsMonthLoading(false);
  }, []);

  useEffect(() => {
    fetchEventsMonth();
  }, [fetchEventsMonth]);

  useIonViewDidEnter(() => {
    context.setShowTabs(true);
  });

  return (
    <>
      <IonPage className='ion-page-ios-notch' ref={pageRef}>
        <IonContent fullscreen>
          {/* <FilterAccordion
            filterprop={filterVariable}
            setFilter={setFilter}
          ></FilterAccordion> */}
          <IonList style={{ paddingTop: "0", marginTop: "0" }}>
            <IonItemDivider mode='ios' style={{ '--background': 'var(--ion-background-color)', paddingTop: "7.5px", paddingBottom: "7.5px" }}>
              <IonLabel>
                <h1 style={{ paddingTop: "5px", paddingBottom: "5px" }}>Today</h1>
              </IonLabel>
            </IonItemDivider>
            {/* Events Today */}
            {!eventsTodayLoading ? (
              <>
                {eventsToday.length > 0 ? (
                  <EventsListEntry
                    events={eventsToday}
                  ></EventsListEntry>
                ) : (
                  <IonNote className="ion-padding" style={{ fontStyle: "italic" }}>
                    No events found.
                  </IonNote>
                )}
              </>
            ) : (
              <>
                <IonSkeletonText style={{ height: "4rem" }} animated />
                <IonSkeletonText style={{ height: "4rem" }} animated />
                <IonSkeletonText style={{ height: "4rem" }} animated />
              </>
            )}
            {/* Events This Week */}
            <IonItemDivider mode='ios' style={{ '--background': 'var(--ion-background-color)', paddingTop: "7.5px", paddingBottom: "7.5px" }}>
              <IonLabel>
                <h1 style={{ paddingTop: "5px", paddingBottom: "5px", color: "var(--ion-color-dark)" }}>Next 7 Days</h1>
              </IonLabel>
            </IonItemDivider>
            {!eventsWeekLoading ? (
              <>
                {eventsWeek.length > 0 ? (
                  <EventsListEntry
                    events={eventsWeek}
                  ></EventsListEntry>
                ) : (
                  <IonNote className="ion-padding" style={{ fontStyle: "italic" }}>
                    No events found.
                  </IonNote>
                )}
              </>
            ) : (
              <>
                <IonSkeletonText style={{ height: "4rem" }} animated />
                <IonSkeletonText style={{ height: "4rem" }} animated />
                <IonSkeletonText style={{ height: "4rem" }} animated />
              </>
            )}
            {/* Events This Month */}
            <IonItemDivider mode='ios' style={{ '--background': 'var(--ion-background-color)', paddingTop: "7.5px", paddingBottom: "7.5px" }}>
              <IonLabel>
                <h1 style={{ paddingTop: "5px", paddingBottom: "5px", color: "var(--ion-color-dark)" }}>Next 30 Days</h1>
              </IonLabel>
            </IonItemDivider>
            {!eventsMonthLoading ? (
              <>
                {eventsMonth.length > 0 ? (
                  <EventsListEntry
                    events={eventsMonth}
                  ></EventsListEntry>
                ) : (
                  <IonNote className="ion-padding" style={{ fontStyle: "italic" }}>
                    No events found.
                  </IonNote>
                )}
              </>
            ) : (
              <>
                <IonSkeletonText style={{ height: "4rem" }} animated />
                <IonSkeletonText style={{ height: "4rem" }} animated />
                <IonSkeletonText style={{ height: "4rem" }} animated />
              </>
            )}
          </IonList>
          <div style={{ height: '15px' }} />
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
