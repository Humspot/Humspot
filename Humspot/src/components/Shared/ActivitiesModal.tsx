/**
 * @file ActivitiesModal.tsx
 * @fileoverview the modal component that displays when clicking the add icon on the tab bar.
 * It contains buttons to 'Submit an Event', 'Submit an Attraction', 'See Pending Submissions', and 'Request to Become an Organizer'.
 */

import { useEffect, useRef } from "react";
import { IonModal, IonList, IonItem, IonIcon, IonLabel, useIonRouter, IonContent, IonTitle, IonHeader, IonToolbar, IonButton, IonButtons } from "@ionic/react";
import { calendarOutline, clipboardOutline, listCircleOutline, locationOutline } from "ionicons/icons";

import { useContext } from "../../utils/hooks/useContext";

const ActivitiesModal: React.FC = () => {

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
    <IonModal ref={modalRef} trigger="open-add-activity-modal" handle={true} breakpoints={[0, 0.75,]} initialBreakpoint={0.75}>
      <IonContent className='profile-modal-content' scrollY={false}>
        <IonHeader className='ion-no-border' mode='ios'>
          <IonToolbar className='profile-modal-toolbar'>
            <p className='profile-modal-title'>Activities</p>
          </IonToolbar>
        </IonHeader>
        <br />
        <div>
          <IonItem lines='none' onClick={() => { modalRef?.current?.dismiss(); router.push("/submit-attraction") }}>
            <IonIcon aria-hidden="true" icon={locationOutline} slot="start" style={{ marginRight: '15px' }}></IonIcon>
            <IonLabel>Submit an Attraction</IonLabel>
          </IonItem>
          <br />
          <IonItem lines='none' onClick={() => { modalRef?.current?.dismiss(); router.push("/submit-event") }}>
            <IonIcon aria-hidden="true" icon={calendarOutline} slot="start" style={{ marginRight: '15px' }}></IonIcon>
            <IonLabel>Submit an Event <i>(Organizers Only)</i></IonLabel>
          </IonItem>
          <br />
          {context.humspotUser &&
            <>
              <IonItem lines='none' onClick={() => { modalRef?.current?.dismiss(); router.push("/submitted-activities") }}>
                <IonIcon aria-hidden="true" icon={listCircleOutline} slot="start" style={{ marginRight: '15px' }}></IonIcon>
                <IonLabel>See Pending Submissions</IonLabel>
              </IonItem>
              <br />
            </>
          }
          {context.humspotUser?.accountType === 'user' &&
            <>
              <IonItem lines='none' role='button' onClick={() => { modalRef?.current?.dismiss(); router.push("/become-a-coordinator") }}>
                <IonIcon aria-hidden="true" icon={clipboardOutline} slot="start" style={{ marginRight: '15px' }}></IonIcon>
                <IonLabel>Become an Organizer</IonLabel>
              </IonItem>
              <br />
            </>
          }
        </div>
      </IonContent>
    </IonModal>
  )
};

export default ActivitiesModal;