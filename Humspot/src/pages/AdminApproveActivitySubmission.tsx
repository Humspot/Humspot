import { IonPage, IonContent, IonItem, IonLabel, IonInput, IonTextarea, IonButton, IonIcon, IonDatetime, IonCard, IonCardContent, IonCardHeader, IonChip, IonAlert, IonModal, IonLoading, IonHeader, IonToolbar, IonButtons, IonTitle, useIonRouter } from "@ionic/react";
import { mapOutline, cameraOutline, addOutline, chevronDownOutline, chevronBackOutline } from "ionicons/icons";
import { Map, Marker } from "pigeon-maps";
import GoBackHeader from "../components/Shared/GoBackHeader";
import { useContext } from "../utils/my-context";
import { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { handleApproveActivitySubmission, handleGetSubmissionInfo } from "../utils/server";
import { SubmissionInfo } from "../utils/types";
import { useToast } from "@agney/ir-toast";

async function canDismiss(data?: any, role?: string) {
  return role !== 'gesture';
};

type AdminApproveActivitySubmissionParams = {
  id: string;
};

const AdminApproveActivitySubmission = () => {

  const params = useParams<AdminApproveActivitySubmissionParams>();
  const id: string = params.id;

  const context = useContext();
  const Toast = useToast();
  const router = useIonRouter();

  const [loading, setLoading] = useState<boolean>(false);
  const [submissionInfo, setSubmissionInfo] = useState<SubmissionInfo | null>(null);

  const mapModalRef = useRef<HTMLIonModalElement | null>(null);

  const descRef = useRef<HTMLIonTextareaElement | null>(null);

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleApprove = async () => {
    if (!context.humspotUser || !submissionInfo) return;
    setIsSubmitting(true);
    const res = await handleApproveActivitySubmission(context.humspotUser.userID, submissionInfo, descRef?.current?.value ?? '');
    if (res.success) {
      const t = Toast.create({ message: "Activity approved!", duration: 2000, color: "secondary" });
      t.present();
      router.goBack();
    } else {
      const t = Toast.create({ message: "Something went wrong", duration: 2000, color: "danger" });
      t.present();
    }
  };

  const handleDeny = async () => {

  };
  const fetchSubmissionInfo = useCallback(async () => {
    if (!context.humspotUser) return;
    setLoading(true);
    const res = await handleGetSubmissionInfo(context.humspotUser.userID, id);
    setSubmissionInfo(res.submissionInfo);
    setLoading(false);
  }, [context.humspotUser])
  useEffect(() => {
    fetchSubmissionInfo();
  }, [fetchSubmissionInfo])

  return (
    <IonPage>
      <GoBackHeader title={submissionInfo?.activityType ? "Approve " + submissionInfo.activityType : ""} />

      <IonContent >


        <IonLoading message={"Loading..."} isOpen={loading} />

        <IonLoading message={"Submitting..."} isOpen={isSubmitting} />

        {context.humspotUser?.accountType !== 'user' ?
          <>
            {submissionInfo &&
              <div style={{ background: 'var(--ion-background-color)', padding: '5px' }}>
                <IonItem style={{ '--background': 'var(--ion-background-color)' }} lines='full'>
                  <IonLabel position='stacked'>Name</IonLabel>
                  <IonInput readonly aria-label="Name" style={{ marginTop: "5px" }} value={submissionInfo.name} />
                </IonItem>
                <br />
                <IonItem style={{ '--background': 'var(--ion-background-color)' }} lines='full'>
                  <IonLabel position='stacked'>Description</IonLabel>
                  <IonTextarea readonly maxlength={500} rows={3} value={submissionInfo.description} />
                </IonItem>
                <br />
                <IonItem style={{ '--background': 'var(--ion-background-color)' }} lines='full'>
                  <IonLabel position='stacked'>Website</IonLabel>
                  <IonInput readonly aria-label="Website" style={{ marginTop: "5px" }} value={submissionInfo.websiteURL ?? 'NO WEBSITE PROVIDED'} />
                </IonItem>
                <br />
                <IonItem lines="full" style={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', '--background': 'var(--ion-background-color)' }}>
                  <IonLabel position="stacked">Location / Address</IonLabel>
                  <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                    <IonInput
                      readonly
                      aria-label="Location / Address"
                      value={submissionInfo.location}
                      style={{ flexGrow: 1, marginRight: '10px', marginTop: '5px' }}
                    />
                    {submissionInfo.latitude && submissionInfo.longitude &&
                      <IonButton color='secondary' onClick={() => mapModalRef.current?.present()}>
                        <IonIcon icon={mapOutline} />
                      </IonButton>
                    }
                  </div>
                </IonItem>
                <br />
                {submissionInfo.openTimes !== null ?
                  <IonItem className='no-ripple' style={{ '--background': 'var(--ion-background-color)' }} lines='full'>
                    <IonLabel position='stacked'>Open Times</IonLabel>
                    <IonInput readonly aria-label="Website" style={{ marginTop: "5px" }} value={submissionInfo.openTimes ?? "NO OPEN TIMES PROVIDED"} />
                  </IonItem>
                  :
                  <IonItem className='no-ripple' style={{ '--background': 'var(--ion-background-color)' }} lines='full'>
                    <IonLabel position='stacked'>Date</IonLabel>
                    <IonInput readonly aria-label="Website" style={{ marginTop: "5px" }} value={submissionInfo.date ?? "NO DATE PROVIDED"} />
                  </IonItem>
                }
                <IonItem className='no-ripple' style={{ '--background': 'var(--ion-background-color)' }} lines='full'>
                  <IonLabel position='stacked'>Time</IonLabel>
                  <IonInput readonly aria-label="Website" style={{ marginTop: "5px" }} value={submissionInfo.time ?? "NO TIME PROVIDED"} />
                </IonItem>
                <br />
                <IonItem style={{ '--background': 'var(--ion-background-color)' }} lines='full'>
                  <IonLabel position='stacked'>Photos</IonLabel>
                  <div style={{ height: "1vh" }} />
                  {submissionInfo && submissionInfo.photoUrls && submissionInfo.photoUrls.length > 0 &&
                    submissionInfo.photoUrls.split(',').map((url: string, index: number) => {
                      return (
                        <div key={index}>
                          <IonCard className='ion-no-margin' >
                            <img src={url} />
                          </IonCard>
                          <br />
                        </div>
                      )
                    })
                  }
                </IonItem>
                <br />
                <IonItem style={{ '--background': 'var(--ion-background-color)' }} lines='full'>
                  <IonLabel position='stacked'>Tags</IonLabel>
                </IonItem>
                <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', paddingRight: "5px", paddingLeft: "5px" }}>
                  {submissionInfo && submissionInfo.tagNames && submissionInfo.tagNames.length > 0 &&
                    submissionInfo.tagNames.split(',').map((tag: string, idx: number) => (
                      <IonChip
                        key={tag + idx}
                        color={"secondary"}
                      >
                        <IonLabel>{tag}</IonLabel>
                      </IonChip>
                    ))}
                </div>

                <br />
                <br />
                <br />
                <br />

                <IonItem style={{ '--background': 'var(--ion-background-color)' }} lines='none'>
                  <IonLabel position='stacked'>Message to Submitter (Optional)</IonLabel>
                  <IonTextarea ref={descRef} rows={3} placeholder="Thanks for submitting! ..." />
                </IonItem>

                <IonButton color='secondary' expand="block" style={{ padding: "10px" }} onClick={async () => await handleApprove()}>Approve</IonButton>
                <IonButton color='danger' expand="block" style={{ padding: "10px" }} onClick={async () => await handleDeny()}>Deny</IonButton>
                <br />
              </div>
            }
          </>
          :
          <div className="ion-text-center access-denied-message" style={{ padding: "10px" }}>
            You must be an admin or organizer to submit an event or attraction!
          </div>
        }

        <IonModal ref={mapModalRef} canDismiss={canDismiss} trigger='address-verification' handle={false}>
          <IonContent fullscreen>
            <IonHeader className='ion-no-border'>
              <IonToolbar style={{ '--background': 'black' }}>
                <IonButtons >
                  <IonButton style={{ fontSize: '1.25em', marginLeft: '5px' }} onClick={() => { mapModalRef && mapModalRef.current && mapModalRef.current.dismiss() }}>
                    <IonIcon icon={chevronBackOutline} />
                  </IonButton>
                  <IonTitle>Map Pin View</IonTitle>
                </IonButtons>
              </IonToolbar>
            </IonHeader>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{}}>
                <Map
                  maxZoom={14}
                  height={400}
                  width={500}
                  attribution={false}
                  center={[parseFloat(submissionInfo?.latitude ?? ''), parseFloat(submissionInfo?.longitude ?? '')]}
                >
                  {submissionInfo?.latitude && submissionInfo.longitude &&
                    <Marker width={40} anchor={[parseFloat(submissionInfo.latitude), parseFloat(submissionInfo.longitude)]}></Marker>
                  }
                </Map>
              </div>
            </div>
          </IonContent>
        </IonModal>

      </IonContent>
    </IonPage >
  );

};

export default AdminApproveActivitySubmission;