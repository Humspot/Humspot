

import { IonModal, IonList, IonItem, IonIcon, IonLabel, useIonRouter, IonContent, IonTitle } from "@ionic/react";
import { calendarOutline, compassOutline, listCircleSharp, clipboardOutline } from "ionicons/icons";

const ProfileAddActivityModal = () => {

  const router = useIonRouter();

  return (
    <IonModal trigger="open-add-activity-modal" handle breakpoints={[0, 0.55, 0.99]} initialBreakpoint={0.55}>
      <IonContent style={{ '--background': 'var(--ion-item-background' }}>
        <br />
        <IonTitle className='ion-text-center' style={{ padding: "5%", fontSize: "1.5rem" }}>Activities</IonTitle>
        <IonList lines='full'>
          <IonItem>
            <IonIcon aria-hidden="true" icon={calendarOutline} slot="start"></IonIcon>
            <IonLabel>Submit an Event</IonLabel>
          </IonItem>
          <br />
          <IonItem>
            <IonIcon aria-hidden="true" icon={compassOutline} slot="start"></IonIcon>
            <IonLabel>Submit an Attraction</IonLabel>
          </IonItem>
          <br />
          <IonItem>
            <IonIcon aria-hidden="true" icon={listCircleSharp} slot="start"></IonIcon>
            <IonLabel>See Submitted Activities</IonLabel>
          </IonItem>
          <br />
          <IonItem role='button' id="become-a-coordinator">
            <IonIcon aria-hidden="true" icon={clipboardOutline} slot="start"></IonIcon>
            <IonLabel>Become a Coordinator</IonLabel>
          </IonItem>
          <br />
        </IonList>
      </IonContent>
    </IonModal>
  )
};

export default ProfileAddActivityModal;