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

const EventsListEntry = (props: { events: any }) => {
  const events: any = props.events;
  const router = useIonRouter();
  return (
    <>
      {events?.map((activity: any, index: any) => (
        <IonItem
          key={index}
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
      ))}
    </>
  );
};

export default EventsListEntry;
