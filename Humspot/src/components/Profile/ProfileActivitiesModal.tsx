

import { IonModal, IonList, IonItem, IonIcon, IonLabel, useIonRouter, IonContent, IonTitle } from "@ionic/react";
import { calendarOutline, compassOutline, clipboardOutline, listCircleOutline } from "ionicons/icons";
import { useEffect, useRef } from "react";
import { useContext } from "../../utils/my-context";

const ProfileActivitiesModal: React.FC = () => {

  const router = useIonRouter();
  const context = useContext();
  const modalRef = useRef<HTMLIonModalElement | null>(null);

  useEffect(() => {
    const eventListener: any = (ev: CustomEvent<any>) => {
      ev.detail.register(20, async () => {
        await modalRef?.current?.dismiss();
      });
    };

    document.addEventListener('ionBackButton', eventListener);

    return () => {
      document.removeEventListener('ionBackButton', eventListener);
    };
  }, [modalRef]);

  return (
    <IonModal ref={modalRef} trigger="open-add-activity-modal" handle breakpoints={[0, 0.55, 0.99]} initialBreakpoint={0.55}>
      <IonContent style={{ '--background': 'var(--ion-item-background' }}>
        <br />
        <IonTitle className='ion-text-center' style={{ padding: "5%", fontSize: "1.5rem" }}>Activities</IonTitle>
        <IonList lines='full'>
          <IonItem onClick={() => { modalRef?.current?.dismiss(); router.push("/submit-event") }}>
            <IonIcon aria-hidden="true" icon={calendarOutline} slot="start" color="light"></IonIcon>
            <IonLabel>Submit an Event</IonLabel>
          </IonItem>
          <br />
          <IonItem onClick={() => { modalRef?.current?.dismiss(); router.push("/submit-attraction") }}>
            <IonIcon aria-hidden="true" icon={compassOutline} slot="start" color="light"></IonIcon>
            <IonLabel>Submit an Attraction</IonLabel>
          </IonItem>
          <br />
          <IonItem onClick={() => { modalRef?.current?.dismiss(); router.push("/submitted-activities") }}>
            <IonIcon aria-hidden="true" icon={listCircleOutline} slot="start" color="light"></IonIcon>
            <IonLabel>See Submitted Activities</IonLabel>
          </IonItem>
          <br />
          {context.humspotUser?.accountType === 'user' &&
            <>
              <IonItem role='button' onClick={() => { modalRef?.current?.dismiss(); router.push("/become-a-coordinator") }}>
                <IonIcon aria-hidden="true" icon={clipboardOutline} slot="start" color="light"></IonIcon>
                <IonLabel>Become an Organizer</IonLabel>
              </IonItem>
              <br />
            </>
          }
        </IonList>
      </IonContent>
    </IonModal>
  )
};

export default ProfileActivitiesModal;