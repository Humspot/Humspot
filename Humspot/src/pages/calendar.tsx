import {
  IonContent,
  IonNote,
  IonPage,
  IonProgressBar,
  IonSkeletonText,
  useIonRouter,
  useIonViewDidEnter,
  IonList,
  IonItemDivider,
  IonLabel
} from "@ionic/react";
import { useState, useEffect, useCallback } from "react";
import { useContext } from "../utils/my-context";
import { useToast } from "@agney/ir-toast";
import { handleGetEventsBetweenTwoDates } from "../utils/server";
import placeholder from "../assets/images/placeholder.png";
import { formatDate } from "../utils/formatDate";
import EventsListEntry from "../components/Calendar/EventsListEntry";
import { getDateStrings } from "../utils/calcDates";
import { navigateBack } from "../components/Shared/BackButtonNavigation";
import FilterAccordion from "../components/Calendar/FilterAccordion";

import '../App.css';

function CalendarPage() {
  const context = useContext();
  useIonViewDidEnter(() => {
    context.setShowTabs(true);
  });
  const [eventsToday, seteventsToday] = useState<any>([]);
  const [eventsTodayLoading, setEventsTodayLoading] = useState<boolean>(true);
  const Toast = useToast();
  const [filterVariable, setFilter] = useState<string | null>(null);
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
  const [eventsTodayFiltered, seteventsTodayFiltered] = useState<any>([]);
  const [eventsWeekFiltered, seteventsWeekFiltered] = useState<any>([]);
  const [eventsMonthFiltered, seteventsMonthFiltered] = useState<any>([]);
  function filterAllEvents(
    eventsToday: any,
    eventsWeek: any,
    eventsMonth: any
  ) {
    if (filterVariable != null && eventsToday) {
      const eventsTodayFiltered = eventsToday.filter((event: any) => {
        return event?.tags && event.tags.includes(filterVariable as string);
      });

      seteventsTodayFiltered(eventsTodayFiltered);
    } else {
      seteventsTodayFiltered(eventsToday);
    }
    if (filterVariable != null && eventsWeek) {
      const eventsWeekFiltered = eventsWeek.filter((event: any) => {
        return event?.tags && event.tags.includes(filterVariable as string);
      });

      seteventsWeekFiltered(eventsWeekFiltered);
    } else {
      seteventsWeekFiltered(eventsWeek);
    }
    if (filterVariable != null && eventsMonth) {
      const eventsMonthFiltered = eventsMonth.filter((event: any) => {
        return event?.tags && event.tags.includes(filterVariable as string);
      });

      seteventsMonthFiltered(eventsMonthFiltered);
    } else {
      seteventsMonthFiltered(eventsMonth);
    }
  }
  useEffect(() => {
    // Check if events are loaded before filtering
    if (!eventsTodayLoading && !eventsWeekLoading && !eventsMonthLoading) {
      filterAllEvents(eventsToday, eventsWeek, eventsMonth);
    }
  }, [
    filterVariable,
    eventsToday,
    eventsWeek,
    eventsMonth,
    eventsTodayLoading,
    eventsWeekLoading,
    eventsMonthLoading,
  ]);

  const router = useIonRouter();

  useEffect(() => {
    const eventListener: any = (ev: CustomEvent<any>) => {
      ev.detail.register(10, () => {
        navigateBack(router);
      });
    };

    document.addEventListener('ionBackButton', eventListener);

    return () => {
      document.removeEventListener('ionBackButton', eventListener);
    };
  }, [router]);

  return (
    <>
      <IonPage>
        <IonContent>
          <FilterAccordion
            filterprop={filterVariable}
            setFilter={setFilter}
          ></FilterAccordion>
          <IonList style={{ paddingTop: "0", marginTop: "0" }}>
            <IonItemDivider color='dark'>
              <IonLabel>
                <h1 style={{ paddingTop: "5px", paddingBottom: "5px", color: "var(--ion-color-dark)" }}>Today</h1>
              </IonLabel>
            </IonItemDivider>
            {/* Events Today */}
            {!eventsTodayLoading ? (
              <>
                {eventsTodayFiltered.length > 0 ? (
                  <EventsListEntry
                    events={eventsTodayFiltered}
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
            <IonItemDivider color='light'>
              <IonLabel>
                <h1 style={{ paddingTop: "5px", paddingBottom: "5px", color: "var(--ion-color-dark)" }}>Next 7 Days</h1>
              </IonLabel>
            </IonItemDivider>
            {!eventsWeekLoading ? (
              <>
                {eventsWeekFiltered.length > 0 ? (
                  <EventsListEntry
                    events={eventsWeekFiltered}
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
            <IonItemDivider color='light'>
              <IonLabel>
                <h1 style={{ paddingTop: "5px", paddingBottom: "5px", color: "var(--ion-color-dark)" }}>Next 30 Days</h1>
              </IonLabel>
            </IonItemDivider>
            {!eventsMonthLoading ? (
              <>
                {eventsWeekFiltered.length > 0 ? (
                  <EventsListEntry
                    events={eventsMonthFiltered}
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
