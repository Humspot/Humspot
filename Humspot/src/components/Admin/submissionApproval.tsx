// View submissions
// Should open activities page and have a button to approve or decline
// Default is unapproved lists
import {
  IonSegment,
  IonSegmentButton,
  IonButton,
  IonLabel,
  IonIcon,
  IonContent,
  IonSkeletonText,
  IonList,
  IonCard,
  IonCardContent,
  IonItem,
  IonThumbnail,
  IonImg,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  useIonRouter,
} from "@ionic/react";

import { checkmarkCircleOutline } from "ionicons/icons";
import { useCallback, useEffect, useState } from "react";
import { useContext } from "../../utils/my-context";
import { handleGetPendingActivitySubmissions } from "../../utils/server";


function SubmissionApproval({ title, description, imgsrc, id }: any) {
  const router = useIonRouter();
  const context = useContext();  
  const [orgSubmissions, setOrgSubumissions] = useState<any[]>([]);

  const fetchSubmissions = useCallback(async () => {
    if (!context.humspotUser) return;
    const response = await handleGetPendingActivitySubmissions(
      1,
      context.humspotUser.userID
    );
    setSubmissions(response.pendingSubmissions);
  }, [context.humspotUser]);
  const [submissions, setSubmissions] = useState<any[]>([]);
  console.log(submissions);

  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  return (
    <IonCard>
      <IonList>
        {submissions.map((submission: any, index: number) => {
          return (
            <IonItem
              key={index}
              onClick={() => {
                router.push("/admin-dashboard/submission/" + submission.submissionID);
              }}
            >
              <IonLabel style={{ paddingLeft: "10px" }}>
                <h2>Event: {submission.name}</h2>
                <p style={{ fontSize: "0.9rem"}}> Created By: {submission.organizer || "Unknown"} </p>
              </IonLabel>
            </IonItem>
          );
        })
        }
      </IonList>
    </IonCard>
  );
}

export default SubmissionApproval;
