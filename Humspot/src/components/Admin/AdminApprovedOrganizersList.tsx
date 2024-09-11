import { IonList, IonSkeletonText, IonItem, IonLabel, useIonRouter, } from "@ionic/react";
import FadeIn from "@rcnoverwatcher/react-fade-in-react-18/src/FadeIn";

const AdminPendingOrganizersList = (props: { approvedOrganizers: { username: string, userID: string }[]; loading: boolean; }) => {

  const router = useIonRouter();

  return (
    <IonList lines='full'>
      {props.loading ?
        <>
          <div style={{ paddingLeft: "10px", paddingTop: "10px" }}>
            <IonSkeletonText animated style={{ height: "1.25rem", width: '75%', borderRadius: '5px' }} />
          </div>
          <div style={{ height: '0.1vh', marginTop: '15px', backgroundColor: 'var(--ion-color-medium)' }} />
          <div style={{ paddingLeft: "10px", paddingTop: "5px" }}>
            <IonSkeletonText animated style={{ height: "1.25rem", width: '75%', borderRadius: '5px' }} />
          </div>
          <div style={{ height: '0.1vh', marginTop: '15px', backgroundColor: 'var(--ion-color-medium)' }} />
          <div style={{ paddingLeft: "10px", paddingTop: "5px" }}>
            <IonSkeletonText animated style={{ height: "1.25rem", width: '75%', borderRadius: '5px' }} />
          </div>
          <div style={{ height: '0.1vh', marginTop: '15px', backgroundColor: 'var(--ion-color-medium)' }} />
          <div style={{ paddingLeft: "10px", paddingTop: "5px" }}>
            <IonSkeletonText animated style={{ height: "1.25rem", width: '75%', borderRadius: '5px' }} />
          </div>
          <div style={{ height: '0.1vh', marginTop: '15px', backgroundColor: 'var(--ion-color-medium)' }} />
          <div style={{ paddingLeft: "10px", paddingTop: "5px" }}>
            <IonSkeletonText animated style={{ height: "1.25rem", width: '75%', borderRadius: '5px' }} />
          </div>
          <div style={{ height: '0.1vh', marginTop: '15px', backgroundColor: 'var(--ion-color-medium)' }} />
          <div style={{ paddingLeft: "10px", paddingTop: "5px" }}>
            <IonSkeletonText animated style={{ height: "1.25rem", width: '75%', borderRadius: '5px' }} />
          </div>
          <div style={{ height: '0.1vh', marginTop: '15px', backgroundColor: 'var(--ion-color-medium)' }} />
          <div style={{ paddingLeft: "10px", paddingTop: "5px" }}>
            <IonSkeletonText animated style={{ height: "1.25rem", width: '75%', borderRadius: '5px' }} />
          </div>
          <div style={{ height: '0.1vh', marginTop: '15px', backgroundColor: 'var(--ion-color-medium)' }} />
          <div style={{ paddingLeft: "10px", paddingTop: "5px" }}>
            <IonSkeletonText animated style={{ height: "1.25rem", width: '75%', borderRadius: '5px' }} />
          </div>
          <div style={{ height: '0.1vh', marginTop: '15px', backgroundColor: 'var(--ion-color-medium)' }} />
          <div style={{ paddingLeft: "10px", paddingTop: "5px" }}>
            <IonSkeletonText animated style={{ height: "1.25rem", width: '75%', borderRadius: '5px' }} />
          </div>
          <div style={{ height: '0.1vh', marginTop: '15px', backgroundColor: 'var(--ion-color-medium)' }} />
          <div style={{ paddingLeft: "10px", paddingTop: "5px" }}>
            <IonSkeletonText animated style={{ height: "1.25rem", width: '75%', borderRadius: '5px' }} />
          </div>
          <div style={{ height: '0.1vh', marginTop: '15px', backgroundColor: 'var(--ion-color-medium)' }} />
          <br />
        </>
        :
        props.approvedOrganizers.map((organizer, index: number) => {
          return (
            <FadeIn key={index}>
              <IonItem
                onClick={() => { router.push(`/user/${organizer.userID}`)}}
              >
                <IonLabel style={{ paddingLeft: "1px" }}>
                  <h2>{organizer.username}</h2>
                </IonLabel>
              </IonItem>
            </FadeIn>
          )
        })
      }
    </IonList>
  )
};

export default AdminPendingOrganizersList;