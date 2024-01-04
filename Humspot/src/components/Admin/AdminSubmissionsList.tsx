// View submissions
// Should open activities page and have a button to approve or decline
// Default is unapproved lists
import {
  IonLabel,
  IonSkeletonText,
  IonList,
  IonItem,
  useIonRouter,
  IonCardTitle,
} from "@ionic/react";
import FadeIn from "@rcnoverwatcher/react-fade-in-react-18/src/FadeIn";

function AdminSubmissionsList(props: { submissions: any[], loading: boolean; }) {

  const router = useIonRouter();

  if (!props.loading && props.submissions.length <= 0) {
    return (
      <IonCardTitle className="ion-text-center" style={{ fontSize: '1.25rem' }}>No Submissions</IonCardTitle>
    )
  }

  return (
    <IonList lines='full'>
      {props.loading ?
        <>
          <div style={{ paddingLeft: "10px", paddingRight: "5px", paddingTop: "10px", paddingBottom: "0" }}>
            <IonSkeletonText animated style={{ height: "1.25rem", width: '100%', borderRadius: "5px" }} />
          </div>
          <div style={{ paddingLeft: "10px", paddingRight: "5px", paddingTop: "1px", paddingBottom: "0" }}>
            <IonSkeletonText animated style={{ height: "1rem", width: '80%', borderRadius: "5px" }} />
          </div>
          <div style={{ paddingLeft: "10px", paddingRight: "5px", paddingTop: "1px", paddingBottom: "0" }}>
            <IonSkeletonText animated style={{ height: "0.9rem", width: '60%', borderRadius: "5px" }} />
          </div>
          <div style={{ height: '0.1vh', marginTop: '15px', backgroundColor: 'var(--ion-color-medium)' }} />
          <div style={{ paddingLeft: "10px", paddingRight: "5px", paddingTop: "10px", paddingBottom: "0" }}>
            <IonSkeletonText animated style={{ height: "1.25rem", width: '100%', borderRadius: "5px" }} />
          </div>
          <div style={{ paddingLeft: "10px", paddingRight: "5px", paddingTop: "1px", paddingBottom: "0" }}>
            <IonSkeletonText animated style={{ height: "1rem", width: '80%', borderRadius: "5px" }} />
          </div>
          <div style={{ paddingLeft: "10px", paddingRight: "5px", paddingTop: "1px", paddingBottom: "0" }}>
            <IonSkeletonText animated style={{ height: "0.9rem", width: '60%', borderRadius: "5px" }} />
          </div>
          <div style={{ height: '0.1vh', marginTop: '15px', backgroundColor: 'var(--ion-color-medium)' }} />
          <div style={{ paddingLeft: "10px", paddingRight: "5px", paddingTop: "10px", paddingBottom: "0" }}>
            <IonSkeletonText animated style={{ height: "1.25rem", width: '100%', borderRadius: "5px" }} />
          </div>
          <div style={{ paddingLeft: "10px", paddingRight: "5px", paddingTop: "1px", paddingBottom: "0" }}>
            <IonSkeletonText animated style={{ height: "1rem", width: '80%', borderRadius: "5px" }} />
          </div>
          <div style={{ paddingLeft: "10px", paddingRight: "5px", paddingTop: "1px", paddingBottom: "0" }}>
            <IonSkeletonText animated style={{ height: "0.9rem", width: '60%', borderRadius: "5px" }} />
          </div>
          <div style={{ height: '0.1vh', marginTop: '15px', backgroundColor: 'var(--ion-color-medium)' }} />
          <div style={{ paddingLeft: "10px", paddingRight: "5px", paddingTop: "10px", paddingBottom: "0" }}>
            <IonSkeletonText animated style={{ height: "1.25rem", width: '100%', borderRadius: "5px" }} />
          </div>
          <div style={{ paddingLeft: "10px", paddingRight: "5px", paddingTop: "1px", paddingBottom: "0" }}>
            <IonSkeletonText animated style={{ height: "1rem", width: '80%', borderRadius: "5px" }} />
          </div>
          <div style={{ paddingLeft: "10px", paddingRight: "5px", paddingTop: "1px", paddingBottom: "0" }}>
            <IonSkeletonText animated style={{ height: "0.9rem", width: '60%', borderRadius: "5px" }} />
          </div>
          <div style={{ height: '0.1vh', marginTop: '15px', backgroundColor: 'var(--ion-color-medium)' }} />
          <div style={{ paddingLeft: "10px", paddingRight: "5px", paddingTop: "10px", paddingBottom: "0" }}>
            <IonSkeletonText animated style={{ height: "1.25rem", width: '100%', borderRadius: "5px" }} />
          </div>
          <div style={{ paddingLeft: "10px", paddingRight: "5px", paddingTop: "1px", paddingBottom: "0" }}>
            <IonSkeletonText animated style={{ height: "1rem", width: '80%', borderRadius: "5px" }} />
          </div>
          <div style={{ paddingLeft: "10px", paddingRight: "5px", paddingTop: "1px", paddingBottom: "0" }}>
            <IonSkeletonText animated style={{ height: "0.9rem", width: '60%', borderRadius: "5px" }} />
          </div>
          <div style={{ height: '0.1vh', marginTop: '15px', backgroundColor: 'var(--ion-color-medium)' }} />
          <div style={{ paddingLeft: "10px", paddingRight: "5px", paddingTop: "10px", paddingBottom: "0" }}>
            <IonSkeletonText animated style={{ height: "1.25rem", width: '100%', borderRadius: "5px" }} />
          </div>
          <div style={{ paddingLeft: "10px", paddingRight: "5px", paddingTop: "1px", paddingBottom: "0" }}>
            <IonSkeletonText animated style={{ height: "1rem", width: '80%', borderRadius: "5px" }} />
          </div>
          <div style={{ paddingLeft: "10px", paddingRight: "5px", paddingTop: "1px", paddingBottom: "0" }}>
            <IonSkeletonText animated style={{ height: "0.9rem", width: '60%', borderRadius: "5px" }} />
          </div>
          <br />
        </>
        :
        props.submissions.map((submission: any, index: number) => {
          return (
            <FadeIn key={index}>
              <IonItem
                onClick={() => {
                  router.push("/admin-dashboard/submission/" + submission.submissionID)
                }}
              >
                <IonLabel>
                  <h2>{submission.activityType.charAt(0).toUpperCase() + submission.activityType.slice(1)}: {submission.name}</h2>
                  <p>{submission.description}</p>
                  <p style={{ fontSize: "0.9rem" }}>Submitted By: {submission.organizer || "Unknown"} </p>
                </IonLabel>
              </IonItem>
            </FadeIn>
          )
        })
      }
    </IonList>
  )
}

export default AdminSubmissionsList;
