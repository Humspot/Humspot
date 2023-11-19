import {
  IonContent,
  IonItem,
  IonLabel,
  IonNote,
  IonPage,
  IonThumbnail,
  useIonRouter,
} from "@ionic/react";
import { formatDate } from "../../utils/formatDate";
import placeholder from "../../assets/images/placeholder.png";
import FadeIn from "@rcnoverwatcher/react-fade-in-react-18/src/FadeIn";

const EventsListEntry = (props: { events: any }) => {
  const events: any = props.events;
  const router = useIonRouter();
  return (
    <>
      {events?.map((activity: any, index: number) => (
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
      ))}
    </>
  );
};

export default EventsListEntry;
