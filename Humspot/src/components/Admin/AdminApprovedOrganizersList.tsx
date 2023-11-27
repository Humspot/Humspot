import { IonList, IonSkeletonText, IonItem, IonLabel, } from "@ionic/react";
import FadeIn from "@rcnoverwatcher/react-fade-in-react-18/src/FadeIn";

const AdminPendingOrganizersList = (props: { approvedOrganizers: any[]; loading: boolean; }) => {

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
          props.approvedOrganizers.map((organizer: any, index: number) => {
            return (
              <FadeIn key={index}>
                <IonItem
                  onClick={() => { }}
                >
                  <IonLabel style={{ paddingLeft: "10px" }}>
                    <h2>{organizer.username}</h2>
                  </IonLabel>
                </IonItem>
              </FadeIn>
            )
          })
        }
      </IonList>
    </>
  )
};

export default AdminPendingOrganizersList;