

import { IonModal, IonList, IonItem, IonIcon, IonLabel, useIonRouter, IonContent, IonTitle, IonHeader, IonToolbar, IonButton, IonButtons } from "@ionic/react";
import { calendarOutline, compassOutline, clipboardOutline, listCircleOutline } from "ionicons/icons";
import { useEffect, useRef, useState } from "react";
import { useContext } from "../../utils/my-context";

type ProfileActivitiesModalProps = {
  page: HTMLElement | undefined;
};

async function canDismiss(data?: any, role?: string) {
  return role !== 'gesture';
};

const ProfileActivitiesModal: React.FC<ProfileActivitiesModalProps> = (props: ProfileActivitiesModalProps) => {

  const router = useIonRouter();
  const context = useContext();
  const modalRef = useRef<HTMLIonModalElement | null>(null);
  const [presentingElement, setPresentingElement] = useState<HTMLElement | undefined>(undefined);

  useEffect(() => {
    setPresentingElement(props.page);
  }, [props.page])


  return (
    <IonModal ref={modalRef} trigger="open-add-activity-modal" presentingElement={presentingElement} canDismiss={canDismiss}>
      <IonContent style={{ '--background': 'var(--ion-item-background' }}>
        <IonHeader className='ion-no-border'>
          <IonToolbar style={{ '--background': 'var(--ion-item-background' }}>
            <IonTitle style={{ fontSize: "1.25rem" }}>Activities</IonTitle>
            <IonButtons style={{ height: "5vh" }}>
              <IonButton style={{ fontSize: '1.15em', }} onClick={() => { modalRef.current?.dismiss() }}>
                <p>Close</p>
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <br />
        <IonList lines='full'>
          <IonItem onClick={() => { modalRef?.current?.dismiss().then(() => { router.push("/submit-event") }) }}>
            <IonIcon aria-hidden="true" icon={calendarOutline} slot="start"></IonIcon>
            <IonLabel>Submit an Event</IonLabel>
          </IonItem>
          <br />
          <IonItem>
            <IonIcon aria-hidden="true" icon={compassOutline} slot="start"></IonIcon>
            <IonLabel>Submit an Attraction</IonLabel>
          </IonItem>
          <br />
          <IonItem onClick={() => { modalRef?.current?.dismiss(); router.push("/submitted-activities") }}>
            <IonIcon aria-hidden="true" icon={listCircleOutline} slot="start" color="light"></IonIcon>
            <IonLabel>See Pending Submissions</IonLabel>
          </IonItem>
          <br />
          {context.humspotUser?.accountType === 'user' &&
            <>
              <IonItem role='button' onClick={() => { modalRef?.current?.dismiss().then(() => { router.push("/become-a-coordinator") }) }}>
                <IonIcon aria-hidden="true" icon={clipboardOutline} slot="start"></IonIcon>
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