import { useToast } from "@agney/ir-toast";
import { IonList, IonSkeletonText, IonItem, IonLabel, IonModal, IonContent, IonTitle, IonButton, IonFab, IonTextarea, IonLoading, IonCardTitle, IonButtons, IonHeader, IonToolbar, IonCol, useIonRouter } from "@ionic/react";
import FadeIn from "@rcnoverwatcher/react-fade-in-react-18/src/FadeIn";
import { useRef, useState } from "react";
import useContext from "../../utils/hooks/useContext";
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
  const router = useIonRouter();

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
              <IonSkeletonText animated style={{ height: "1.25rem", width: '100%', borderRadius: '5px' }} />
            </div>
            <div style={{ paddingLeft: "10px", paddingRight: "5px" }}>
              <IonSkeletonText animated style={{ height: "1rem", width: '80%', borderRadius: '5px' }} />
            </div>
            <div style={{ paddingLeft: "10px", paddingRight: "5px" }}>
              <IonSkeletonText animated style={{ height: "0.9rem", width: '60%', borderRadius: '5px' }} />
            </div>
            <br />
            <div style={{ paddingLeft: "10px", paddingRight: "5px" }}>
              <IonSkeletonText animated style={{ height: "1.25rem", width: '100%', borderRadius: '5px' }} />
            </div>
            <div style={{ paddingLeft: "10px", paddingRight: "5px" }}>
              <IonSkeletonText animated style={{ height: "1rem", width: '80%', borderRadius: '5px' }} />
            </div>
            <div style={{ paddingLeft: "10px", paddingRight: "5px" }}>
              <IonSkeletonText animated style={{ height: "0.9rem", width: '60%', borderRadius: '5px' }} />
            </div>
            <br />
            <div style={{ paddingLeft: "10px", paddingRight: "5px" }}>
              <IonSkeletonText animated style={{ height: "1.25rem", width: '100%', borderRadius: '5px' }} />
            </div>
            <div style={{ paddingLeft: "10px", paddingRight: "5px" }}>
              <IonSkeletonText animated style={{ height: "1rem", width: '80%', borderRadius: '5px' }} />
            </div>
            <div style={{ paddingLeft: "10px", paddingRight: "5px" }}>
              <IonSkeletonText animated style={{ height: "0.9rem", width: '60%', borderRadius: '5px' }} />
            </div>
            <br />
            <div style={{ paddingLeft: "10px", paddingRight: "5px" }}>
              <IonSkeletonText animated style={{ height: "1.25rem", width: '100%', borderRadius: '5px' }} />
            </div>
            <div style={{ paddingLeft: "10px", paddingRight: "5px" }}>
              <IonSkeletonText animated style={{ height: "1rem", width: '80%', borderRadius: '5px' }} />
            </div>
            <div style={{ paddingLeft: "10px", paddingRight: "5px" }}>
              <IonSkeletonText animated style={{ height: "0.9rem", width: '60%', borderRadius: '5px' }} />
            </div>
            <br />
            <div style={{ paddingLeft: "10px", paddingRight: "5px" }}>
              <IonSkeletonText animated style={{ height: "1.25rem", width: '100%', borderRadius: '5px' }} />
            </div>
            <div style={{ paddingLeft: "10px", paddingRight: "5px" }}>
              <IonSkeletonText animated style={{ height: "1rem", width: '80%', borderRadius: '5px' }} />
            </div>
            <div style={{ paddingLeft: "10px", paddingRight: "5px" }}>
              <IonSkeletonText animated style={{ height: "0.9rem", width: '60%', borderRadius: '5px' }} />
            </div>
            <br />
          </>
          :
          props.organizers.map((organizer: any, index: number) => {
            return (
              <FadeIn key={index}>
                <IonItem
                  button
                  onClick={() => { setOrganizerInfo({ name: organizer.name, description: organizer.description, userID: organizer.userID, email: organizer.email, index: index, id: organizer.submissionID }); modalRef.current?.present(); }}
                >
                  <IonLabel>
                    <h2>{organizer.name}</h2>
                    <p>{organizer.description}</p>
                  </IonLabel>
                </IonItem>
              </FadeIn>
            )
          })
        }
      </IonList>

      <IonModal ref={modalRef} presentingElement={context.currentPage} handle={false}>
        <IonContent style={{ '--background': 'var(--ion-item-background' }}>
          <IonHeader className='ion-no-border'>
            <IonToolbar className='profile-modal-toolbar'>
              <IonTitle className='profile-modal-title'>Organizer Request</IonTitle>
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
              <h1 style={{ paddingLeft: "15px", paddingRight: "10px", paddingTop: "0", paddingBottom: "0", fontSize: "1.05rem" }}>
                <IonCol><b>Name: </b></IonCol>
                <IonCol>
                  <span style={{ color: 'var(--ion-color-primary)', textDecoration: 'underline' }} onClick={async () => { modalRef.current && await modalRef.current.dismiss(); router.push(`/user/${organizerInfo.userID}`) }}>
                    {organizerInfo.name}
                  </span>
                </IonCol>
              </h1>
              <h2 style={{ paddingLeft: "15px", paddingRight: "10px", paddingTop: "0", paddingBottom: "0", fontSize: "1.05rem" }}>
                <IonCol><b>Email: </b></IonCol>
                <IonCol>{organizerInfo.email}</IonCol>
              </h2>
              <p style={{ paddingLeft: "15px", paddingRight: "10px", paddingTop: "5px", paddingBottom: "0", fontSize: "1.05rem" }}>
                <IonCol><b>Details: </b></IonCol>
                <IonCol>{organizerInfo.description}</IonCol>
              </p>

              <br />
              <IonItem lines='none'>
                <IonLabel position='stacked'>Message to User (optional)</IonLabel>
                <IonTextarea maxlength={500} rows={3} ref={descRef} placeholder="Thanks for requesting to become an organizer..." />
              </IonItem>
              <IonButton color='secondary' expand="block" style={{ padding: "10px" }} onClick={async () => await handleSubmitApproval()}>Approve</IonButton>
              <IonButton color='danger' expand="block" style={{ padding: "10px" }} onClick={async () => { await handleDenyApproval() }}>Deny</IonButton>
            </>
          }
        </IonContent>
      </IonModal>

    </>
  )
};

export default AdminPendingOrganizersList;