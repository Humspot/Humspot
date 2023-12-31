import {
  IonContent,
  IonItem,
  IonLabel,
  IonNote,
  IonPage,
  IonThumbnail,
  IonTitle,
  useIonRouter,
} from "@ionic/react";
import { formatDate } from "../../utils/formatDate";
import placeholder from "../../assets/images/school_placeholder.jpeg";
import FadeIn from "@rcnoverwatcher/react-fade-in-react-18/src/FadeIn";

const EventsListEntry = (props: { events: any }) => {
  const events: any = props.events;
  const router = useIonRouter();
  return (
    <>
      {events && events.length > 0 ?
        events?.map((activity: any, index: number) => (
          <FadeIn key={index} delay={index * 50}>
            <IonItem
              onClick={() => {
                router.push("/activity/" + activity?.activityID);
              }}
              button
              detail={true}
            >
              <IonThumbnail slot="start">
                <img src={activity?.photoUrl || placeholder} alt="Activity Photo" />
              </IonThumbnail>
              <IonLabel>
                {activity?.name} <br></br>
                <IonNote>{formatDate(activity?.date)}</IonNote>
              </IonLabel>
            </IonItem>
          </FadeIn>
        ))
        :
        <div style={{ paddingTop: "25px", paddingBottom: "25px", background: "var(--ion-color-dark)" }}>
          <IonTitle className="ion-text-center" style={{ display: "flex", height: "100%" }}>No Events</IonTitle>
        </div>
      }
    </>
  );
};

export default EventsListEntry;
