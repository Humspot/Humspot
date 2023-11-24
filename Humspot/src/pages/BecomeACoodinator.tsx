import { IonButton, IonContent, IonInput, IonItem, IonLabel, IonPage, IonTextarea, useIonLoading, useIonViewWillEnter } from "@ionic/react";
import GoBackHeader from "../components/Shared/GoBackHeader";
import { useRef } from "react";
import { useContext } from "../utils/my-context";
import { useToast } from "@agney/ir-toast";
import { OrganizerRequestSubmission } from "../utils/types";
import { handleSubmitRequestToBecomeOrganizer } from "../utils/server";

const BecomeACoodinator: React.FC = () => {

  const context = useContext();
  const Toast = useToast();

  const nameRef = useRef<HTMLIonInputElement | null>(null);
  const emailRef = useRef<HTMLIonInputElement | null>(null);
  const descRef = useRef<HTMLIonTextareaElement | null>(null);

  const [present, dismiss] = useIonLoading();

  const refs = [nameRef, emailRef];

  const isFormValid = () => {
    return refs.every(ref => ref.current && ref.current.value && (ref.current.value as string).trim() !== '');
  };

  const handleSubmitRequest = async () => {
    if (!context.humspotUser) return;
    if (!isFormValid()) {
      const t = Toast.create({ message: "Please enter a name and an email", duration: 2000, color: 'danger' });
      t.present();
    }

    const data: OrganizerRequestSubmission = {
      name: nameRef?.current?.value as string ?? '',
      description: descRef?.current?.value as string ?? '',
      email: emailRef?.current?.value as string ?? '',
      userID: context.humspotUser.userID
    };
    present({ message: "Submitting request..." })
    const res = await handleSubmitRequestToBecomeOrganizer(data);
    if (res.success) {
      let tempUser = { ...context.humspotUser, requestForCoordinatorSubmitted: 1 };
      context.setHumspotUser(tempUser);
    } else {

    }
    dismiss();

  };

  useIonViewWillEnter(() => {
    context.setShowTabs(false);
  }, []);


  return (
    <IonPage>
      <GoBackHeader title="Become a Coordinator" />
      <IonContent>
        <div style={{ padding: '10px' }}>
          <p>To be able to submit events to Humspot, you must be an approved coordinator.</p>
        </div>
        {context.humspotUser?.requestForCoordinatorSubmitted === 0 ?
          <div style={{ background: 'var(--ion-background-color)', padding: '5px' }}>
            <IonItem style={{ '--background': 'var(--ion-background-color)' }} lines='full'>
              <IonLabel position='stacked'>Name</IonLabel>
              <IonInput ref={nameRef} type='text' />
            </IonItem>
            <IonItem style={{ '--background': 'var(--ion-background-color)' }} lines='full'>
              <IonLabel position='stacked'>Email</IonLabel>
              <IonInput ref={emailRef} type='email' />
            </IonItem>
            <IonItem style={{ '--background': 'var(--ion-background-color)' }} lines='full'>
              <IonLabel position='stacked'>Reason for request (optional)</IonLabel>
              <IonTextarea rows={3} maxlength={350} ref={descRef} />
            </IonItem>
            <IonButton disabled={!context.humspotUser} color='secondary' expand="block" style={{ padding: "10px" }} onClick={async () => await handleSubmitRequest()}>Submit</IonButton>
          </div>
          :
          <div className='ion-text-center' style={{ padding: '10px' }}>
            <p style={{ fontSize: "1.5rem" }}>You have already submitted a request! Check your email.</p>
          </div>
        }
      </IonContent>
    </IonPage>
  );

};

export default BecomeACoodinator;