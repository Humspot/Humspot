import { useToast } from "@agney/ir-toast";
import { IonList, IonSkeletonText, IonItem, IonLabel, IonModal, IonContent, IonTitle, IonButton, IonFab, IonTextarea, IonLoading, IonCardTitle, IonButtons, IonHeader, IonToolbar } from "@ionic/react";
import FadeIn from "@rcnoverwatcher/react-fade-in-react-18/src/FadeIn";
import { useEffect, useRef, useState } from "react";
import { useContext } from "../../utils/hooks/useContext";
import { handleApproveOrganizer, handleDenyOrganizer } from "../../utils/server";
import { canDismiss } from "../../utils/functions/canDismiss";

type Organizer = {
  name: string;
  userID: string;
  email: string;
  description: string;
  index: number;
  id: string;
};

const AdminPendingOrganizersList = (props: { organizers: any[]; setOrganizers: React.Dispatch<React.SetStateAction<any[]>>; loading: boolean; }) => {

  const context = useContext();
  const Toast = useToast();

  const [organizerInfo, setOrganizerInfo] = useState<Organizer | null>(null);
  const modalRef = useRef<HTMLIonModalElement | null>(null);

  const [loading, setLoading] = useState<boolean>(false);

  const descRef = useRef<HTMLIonTextareaElement | null>(null);

  const handleDenyApproval = async () => {
    if (!organizerInfo || !context.humspotUser) return;
    setLoading(true);
    const res = await handleDenyOrganizer(context.humspotUser.userID, organizerInfo.userID, organizerInfo.email ?? '', organizerInfo.id, (descRef.current?.value) ?? '');
    if (res.success) {
      const updatedOrganizers = props.organizers.filter((_, index) => index !== organizerInfo.index);
      props.setOrganizers(updatedOrganizers);
      const t = Toast.create({ message: "You've denied this user's request", position: 'bottom', duration: 2000, color: "secondary" });
      t.present();
    } else {
      const t = Toast.create({ message: "Something went wrong", position: 'bottom', duration: 2000, color: "danger" });
      t.present();
    }
    setLoading(false);
    modalRef.current?.dismiss();
  }

  const handleSubmitApproval = async () => {
    if (!organizerInfo || !context.humspotUser) return;
    setLoading(true);
    const res = await handleApproveOrganizer(context.humspotUser.userID, organizerInfo.userID, organizerInfo.email ?? '', organizerInfo.id, (descRef.current?.value) ?? '');
    if (res.success) {
      const updatedOrganizers = props.organizers.filter((_, index) => index !== organizerInfo.index);
      props.setOrganizers(updatedOrganizers);
      const t = Toast.create({ message: "Approved!", position: 'bottom', duration: 2000, color: "secondary" });
      t.present();
    } else {
      const t = Toast.create({ message: "Something went wrong", position: 'bottom', duration: 2000, color: "danger" });
      t.present();
    }
    setLoading(false);
    modalRef.current?.dismiss();
  };

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

  if (!props.loading && props.organizers.length <= 0) {
    return (
      <IonCardTitle className="ion-text-center" style={{ fontSize: '1.25rem', padding: '10px' }}>No Pending Organizers</IonCardTitle>
    )
  }

  return (
    <>
      <IonList>
        {props.loading ?
          <>
            <div style={{ paddingLeft: "10px", paddingRight: "5px" }}>
              <IonSkeletonText animated style={{ height: "1.25rem", width: '100%' }} />
            </div>
            <div style={{ paddingLeft: "10px", paddingRight: "5px" }}>
              <IonSkeletonText animated style={{ height: "1rem", width: '80%' }} />
            </div>
            <div style={{ paddingLeft: "10px", paddingRight: "5px" }}>
              <IonSkeletonText animated style={{ height: "0.9rem", width: '60%' }} />
            </div>
            <br />
            <div style={{ paddingLeft: "10px", paddingRight: "5px" }}>
              <IonSkeletonText animated style={{ height: "1.25rem", width: '100%' }} />
            </div>
            <div style={{ paddingLeft: "10px", paddingRight: "5px" }}>
              <IonSkeletonText animated style={{ height: "1rem", width: '80%' }} />
            </div>
            <div style={{ paddingLeft: "10px", paddingRight: "5px" }}>
              <IonSkeletonText animated style={{ height: "0.9rem", width: '60%' }} />
            </div>
            <br />
            <div style={{ paddingLeft: "10px", paddingRight: "5px" }}>
              <IonSkeletonText animated style={{ height: "1.25rem", width: '100%' }} />
            </div>
            <div style={{ paddingLeft: "10px", paddingRight: "5px" }}>
              <IonSkeletonText animated style={{ height: "1rem", width: '80%' }} />
            </div>
            <div style={{ paddingLeft: "10px", paddingRight: "5px" }}>
              <IonSkeletonText animated style={{ height: "0.9rem", width: '60%' }} />
            </div>
            <br />
            <div style={{ paddingLeft: "10px", paddingRight: "5px" }}>
              <IonSkeletonText animated style={{ height: "1.25rem", width: '100%' }} />
            </div>
            <div style={{ paddingLeft: "10px", paddingRight: "5px" }}>
              <IonSkeletonText animated style={{ height: "1rem", width: '80%' }} />
            </div>
            <div style={{ paddingLeft: "10px", paddingRight: "5px" }}>
              <IonSkeletonText animated style={{ height: "0.9rem", width: '60%' }} />
            </div>
            <br />
            <div style={{ paddingLeft: "10px", paddingRight: "5px" }}>
              <IonSkeletonText animated style={{ height: "1.25rem", width: '100%' }} />
            </div>
            <div style={{ paddingLeft: "10px", paddingRight: "5px" }}>
              <IonSkeletonText animated style={{ height: "1rem", width: '80%' }} />
            </div>
            <div style={{ paddingLeft: "10px", paddingRight: "5px" }}>
              <IonSkeletonText animated style={{ height: "0.9rem", width: '60%' }} />
            </div>
            <br />
          </>
          :
          props.organizers.map((organizer: any, index: number) => {
            return (
              <FadeIn key={index}>
                <IonItem
                  onClick={() => { setOrganizerInfo({ name: organizer.name, description: organizer.description, userID: organizer.userID, email: organizer.email, index: index, id: organizer.submissionID }); modalRef.current?.present(); }}
                >
                  <IonLabel style={{ paddingLeft: "10px" }}>
                    <h2>{organizer.name}</h2>
                    <p>{organizer.description}</p>
                  </IonLabel>
                </IonItem>
              </FadeIn>
            )
          })
        }
      </IonList>

      <IonModal ref={modalRef} canDismiss={canDismiss} trigger="open-add-activity-modal" handle={false} breakpoints={[0, 0.99]} initialBreakpoint={0.99}>
        <IonContent style={{ '--background': 'var(--ion-item-background' }}>
          <IonHeader className='ion-no-border'>
            <IonToolbar className='profile-modal-toolbar'>
              <IonTitle className='profile-modal-title'>Submission Info</IonTitle>
              <IonButtons>
                <IonButton className='profile-modal-close-button' onClick={() => { modalRef.current?.dismiss() }}>
                  <p>Close</p>
                </IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonLoading isOpen={loading} message={"Submitting..."} />
          {organizerInfo &&
            <>
              <h1 style={{ paddingLeft: "15px", paddingRight: "10px", paddingTop: "0", paddingBottom: "0", fontSize: "1.05rem" }}><b>Name: </b>{organizerInfo.name}</h1>
              <h2 style={{ paddingLeft: "15px", paddingRight: "10px", paddingTop: "0", paddingBottom: "0", fontSize: "1.05rem" }}><b>Email:</b> {organizerInfo.email}</h2>
              <p style={{ paddingLeft: "15px", paddingRight: "10px", paddingTop: "5px", paddingBottom: "0", fontSize: "0.9rem" }}>{organizerInfo.description}</p>

              <IonFab vertical='bottom' style={{ width: "100vw" }}>
                <IonItem lines='full'>
                  <IonLabel position='stacked'>Message to User (optional)</IonLabel>
                  <IonTextarea maxlength={500} rows={3} ref={descRef} placeholder="Thanks for requesting to become an organizer..." />
                </IonItem>
                <IonButton color='secondary' expand="block" style={{ padding: "10px" }} onClick={async () => await handleSubmitApproval()}>Approve</IonButton>
                <IonButton color='danger' expand="block" style={{ padding: "10px" }} onClick={async () => { await handleDenyApproval() }}>Deny</IonButton>
              </IonFab>
            </>
          }
        </IonContent>
      </IonModal>

    </>
  )
};

export default AdminPendingOrganizersList;