/**
 * @file ProfileActivitiesModal.tsx
 * @fileoverview the modal component that displays when clicking the add icon on the profile page.
 * It contains buttons to 'Submit an Event', 'Submit an Attraction', 'See Pending Submissions', and 'Request to Become an Organizer'.
 */

import { useEffect, useRef, useState } from "react";
import { IonModal, IonList, IonItem, IonIcon, IonLabel, useIonRouter, IonContent, IonTitle, IonHeader, IonToolbar, IonButton, IonButtons } from "@ionic/react";
import { calendarOutline, compassOutline, clipboardOutline, listCircleOutline } from "ionicons/icons";

import { useContext } from "../../utils/hooks/useContext";
import { canDismiss } from "../../utils/functions/canDismiss";

import './Profile.css';

type ProfileActivitiesModalProps = {
  page: HTMLElement | undefined;
};

const ProfileActivitiesModal: React.FC<ProfileActivitiesModalProps> = (props: ProfileActivitiesModalProps) => {

  const router = useIonRouter();
  const context = useContext();
  const modalRef = useRef<HTMLIonModalElement | null>(null);
  const [presentingElement, setPresentingElement] = useState<HTMLElement | undefined>(undefined);

  useEffect(() => {
    if (props.page) {
      console.log(props.page);
      setPresentingElement(props.page);
    }
  }, [props.page])

  return (
    <IonModal ref={modalRef} trigger="open-add-activity-modal" presentingElement={presentingElement} canDismiss={canDismiss}>
      <IonContent className='profile-modal-content'>
        <IonHeader className='ion-no-border'>
          <IonToolbar className='profile-modal-toolbar'>
            <IonTitle className='profile-modal-title'>Activities</IonTitle>
            <IonButtons>
              <IonButton className='profile-modal-close-button' onClick={() => { modalRef.current?.dismiss() }}>
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
          <IonItem onClick={() => { modalRef?.current?.dismiss().then(() => { router.push("/submit-attraction") }) }}>
            <IonIcon aria-hidden="true" icon={compassOutline} slot="start"></IonIcon>
            <IonLabel>Submit an Attraction</IonLabel>
          </IonItem>
          <br />
          <IonItem onClick={() => { modalRef?.current?.dismiss().then(() => { router.push("/submitted-activities") }) }}>
            <IonIcon aria-hidden="true" icon={listCircleOutline} slot="start"></IonIcon>
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