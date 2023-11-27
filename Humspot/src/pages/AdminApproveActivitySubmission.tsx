import { IonPage, IonContent, IonItem, IonLabel, IonInput, IonTextarea, IonButton, IonIcon, IonDatetime, IonCard, IonCardContent, IonCardHeader, IonChip, IonAlert, IonModal, IonLoading, IonHeader, IonToolbar, IonButtons, IonTitle } from "@ionic/react";
import { mapOutline, cameraOutline, addOutline, chevronDownOutline, chevronBackOutline } from "ionicons/icons";
import { Map, Marker } from "pigeon-maps";
import GoBackHeader from "../components/Shared/GoBackHeader";
import { useContext } from "../utils/my-context";
import { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";

type AdminApproveActivitySubmissionParams = {
  id: string;
}

const AdminApproveActivitySubmission = () => {

  const params = useParams<AdminApproveActivitySubmissionParams>();
  const id: string = params.id;

  const context = useContext();

  const [submissionInfo, setSubmissionInfo] = useState(null);

  const mapModalRef = useRef<HTMLIonModalElement | null>(null);

  const handleApprove = async () => {

  };

  const handleDeny = async () => {

  };
  const fetchSubmissionInfo = useCallback(async () => {
    if (!context.humspotUser) return;
    // const res = await handleGetSubmissionInfo(context.hummspotUser.userID, id);
  }, [context.humspotUser])
  useEffect(() => {
    fetchSubmissionInfo();
  }, [fetchSubmissionInfo])

  return (
    <IonPage>
      <IonContent >

        <GoBackHeader title="Approve Event" />

        {context.humspotUser?.accountType !== 'user' ?
          <>
            {submissionInfo &&
              <div style={{ background: 'var(--ion-background-color)', padding: '5px' }}>
                <IonItem style={{ '--background': 'var(--ion-background-color)' }} lines='full'>
                  <IonLabel position='stacked'>Name</IonLabel>
                  <IonInput readonly aria-label="Name" style={{ marginTop: "5px" }} placeholder="Cal Poly Humboldt - Grad Party" />
                </IonItem>
                <br />
                <IonItem style={{ '--background': 'var(--ion-background-color)' }} lines='full'>
                  <IonLabel position='stacked'>Description</IonLabel>
                  <IonTextarea readonly maxlength={500} rows={3} placeholder="This event will be super fun! Graduates + family are invited to this special event. Visit our site for more info." />
                </IonItem>
                <br />
                <IonItem style={{ '--background': 'var(--ion-background-color)' }} lines='full'>
                  <IonLabel position='stacked'>Website</IonLabel>
                  <IonInput readonly aria-label="Website" style={{ marginTop: "5px" }} placeholder="https://www.google.com" />
                </IonItem>
                <br />
                <IonItem lines="full" style={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', '--background': 'var(--ion-background-color)' }}>
                  <IonLabel position="stacked">Location / Address</IonLabel>
                  <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                    <IonInput
                      readonly
                      aria-label="Location / Address"
                      placeholder="1 Harpst St, Arcata CA"
                      style={{ flexGrow: 1, marginRight: '10px', marginTop: '5px' }}
                    />
                    <IonButton color='secondary' id='address-verification'>
                      <IonIcon icon={mapOutline} />
                    </IonButton>
                  </div>
                </IonItem>
                <br />
                <IonItem className='no-ripple' style={{ '--background': 'var(--ion-background-color)' }} lines='full'>
                  <IonLabel position='stacked'>Date and Time</IonLabel>
                  <IonDatetime readonly style={{ marginTop: "20px" }} />
                </IonItem>
                <br />
                <IonItem style={{ '--background': 'var(--ion-background-color)' }} lines='full'>
                  <IonLabel position='stacked'>Photos</IonLabel>
                  <div style={{ height: "1vh" }} />
                  {/* {photos && photos.length > 0 &&
                    photos.map((url: string, index: number) => {
                      return (
                        <div key={index}>
                          <IonCard className='ion-no-margin' >
                            <img src={url} />
                          </IonCard>
                          <br />
                        </div>
                      )
                    })
                  } */}
                </IonItem>
                <br />
                <IonItem style={{ '--background': 'var(--ion-background-color)' }} lines='full'>
                  <IonLabel position='stacked'>Tags</IonLabel>
                </IonItem>
                <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', paddingRight: "5px", paddingLeft: "5px" }}>
                  {/* {visibleTags.map((tag: string, idx: number) => (
                    <IonChip
                      key={tag + idx}
                      color={"secondary"}
                    >
                      <IonLabel>{tag}</IonLabel>
                    </IonChip>
                  ))} */}
                </div>

                <IonButton color='secondary' expand="block" style={{ padding: "10px" }} onClick={async () => await handleApprove()}>Approve</IonButton>
                <IonButton color='secondary' expand="block" style={{ padding: "10px" }} onClick={async () => await handleDeny()}>Deny</IonButton>
                <br />
              </div>
            }
          </>
          :
          <div className="ion-text-center access-denied-message" style={{ padding: "10px" }}>
            You must be an admin or organizer to submit an event or attraction!
          </div>
        }

        {context.humspotUser?.accountType !== 'user' &&
        <></>
          // <IonModal ref={mapModalRef} canDismiss={canDismiss} onIonModalWillPresent={handleAddressValidation} trigger='address-verification' handle={false}>
          //   <IonContent fullscreen>
          //     <IonLoading isOpen={addressValidating} />
          //     <IonHeader className='ion-no-border'>
          //       <IonToolbar style={{ '--background': 'black' }}>
          //         <IonButtons >
          //           <IonButton style={{ fontSize: '1.25em', marginLeft: '5px' }} onClick={() => { mapModalRef && mapModalRef.current && mapModalRef.current.dismiss() }}>
          //             <IonIcon icon={chevronBackOutline} />
          //           </IonButton>
          //           <IonTitle>Map Pin Selection</IonTitle>
          //         </IonButtons>
          //       </IonToolbar>
          //     </IonHeader>
          //     <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          //       <div style={{}}>
          //         <Map
          //           maxZoom={14}
          //           height={400}
          //           width={500}
          //           attribution={false}
          //           zoom={zoom}
          //           center={center}
          //           onClick={(e) => {
          //             setMapPinLatLong(e.latLng);
          //           }}
          //           onBoundsChanged={({ center, zoom }) => {
          //             setCenter(center);
          //             setZoom(zoom);
          //           }}
          //         >
          //           {mapPinLatLong &&
          //             <Marker width={40} anchor={[mapPinLatLong[0], mapPinLatLong[1]]}></Marker>
          //           }
          //         </Map>
          //       </div>
          //       {!addressValidating && locationRef?.current?.value &&
          //         <div style={{ margin: '10px', width: '100%', textAlign: 'center' }}>
          //           <p style={{ fontSize: '16px', fontWeight: '500' }}>Address Entered: {locationRef.current.value}</p>
          //         </div>
          //       }
          //       <IonButton expand="block" color='danger' style={{ padding: "5px" }}
          //         onClick={() => {
          //           setMapPinLatLong(null);
          //           mapModalRef?.current?.dismiss();
          //         }}
          //       >
          //         Do Not Use Precise Location
          //       </IonButton>
          //       <IonButton expand="block" style={{ padding: "5px" }}
          //         onClick={() => {
          //           mapModalRef?.current?.dismiss();
          //         }}
          //       >
          //         Save Location
          //       </IonButton>
          //     </div>
          //   </IonContent>
          // </IonModal>
        }

      </IonContent>
    </IonPage >
  );

};

export default AdminApproveActivitySubmission;