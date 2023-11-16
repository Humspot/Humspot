// Admins way of navigating their pending lists 

import { 
    IonSegment, 
    IonSegmentButton,
    IonLabel,
    IonIcon,
    IonContent,
    IonSkeletonText,
    IonList,
    IonCard,
    IonCardContent,
    IonItem,
    IonThumbnail,
    
} from "@ionic/react";

import {
  addCircleOutline,
  addCircle,
  personOutline,
  personAddOutline
} from "ionicons/icons";
import { useContext, useState } from "react";
import {memo} from "react"
import { HumspotFavoriteResponse } from "../../utils/types";
import SubmissionApproval from "./submissionApproval";
import { Organizations } from "aws-sdk";
import OrganizersApproval from "./organizerApproval";
import approvedOrganizer from "./approvedOrganizer";

const AdminSegment: React.FC = memo(() => { 

  const [selectedSegment, setSelectedSegment] = useState<string>("pendingActivities");
  
    return(
        <>  
        <IonSegment scrollable style={{paddingLeft: "2.5%", paddingRight:"2.5%"}} 
          value={selectedSegment}
          onIonChange={(e) => setSelectedSegment(e.detail.value as string)}>
          <IonSegmentButton value="pendingActivities">  
            <div className="segment-button" style={{ fontSize: "0.8rem"}}>
              <IonIcon 
                icon={addCircleOutline}
                style={{ margin: "5%"}} 
                size="large">
              </IonIcon> 
              <IonLabel> Pending Activities</IonLabel>
            </div>
          </IonSegmentButton>

          <IonSegmentButton value="pendingOrganizer">  
            <div className="segment-button" style={{ fontSize: "0.8rem"}}>
              <IonIcon 
                icon={personAddOutline}
                style={{ margin: "5%"}} 
                size="large">
              </IonIcon> 
              <IonLabel> Pending Organizers</IonLabel>
            </div>
          </IonSegmentButton>

          <IonSegmentButton value="approvedOrganizer">  
            <div className="segment-button" style={{ fontSize: "0.8rem"}}>
              <IonIcon 
                icon={personOutline}
                style={{ margin: "5%"}} 
                size="large">
              </IonIcon> 
              <IonLabel> Approved Organizers</IonLabel>
            </div>
          </IonSegmentButton>

        </IonSegment>

        <IonContent>
          {selectedSegment === "pendingActivities" ? (
            <IonCard>
              <SubmissionApproval />
            </IonCard>

          ) : selectedSegment === "pendingOrganizer" ?(
            <IonCard>
              <OrganizersApproval />
            </IonCard>

          ) : selectedSegment === "approvedOrganizer" ? (
            <IonCard>
              <h1> Orgainzer Approval</h1>
            </IonCard>
          ) : (
            <h1> Nothing Selected</h1>
          )
          };


        </IonContent>
      </>
    )
});

export default AdminSegment