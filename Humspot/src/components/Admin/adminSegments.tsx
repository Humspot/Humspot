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
  checkmarkCircleOutline,
  checkmarkCircle,
  addCircleOutline,
  addCircle
} from "ionicons/icons";
import { useContext, useState } from "react";
import {memo} from "react"
import { HumspotFavoriteResponse } from "../../utils/types";
import SubmissionApproval from "./submissionApproval";

const AdminSegment: React.FC = memo(() => { 

    return(
        <>  
        <IonSegment style={{paddingLeft: "2.5%", paddingRight:"2.5%"}}>
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
  
          <IonSegmentButton value="approvedActivities">  
            <div className="segment-button" style={{ fontSize: "0.8rem"}}>
              <IonIcon 
                icon={addCircle}
                style={{ margin: "5%"}} 
                size="large">
              </IonIcon> 
              <IonLabel> Approved Activities</IonLabel>
            </div>
          </IonSegmentButton>

          <IonSegmentButton value="pendingOrganizer">  
            <div className="segment-button" style={{ fontSize: "0.8rem"}}>
              <IonIcon 
                icon={checkmarkCircleOutline}
                style={{ margin: "5%"}} 
                size="large">
              </IonIcon> 
              <IonLabel> Pending Organizers</IonLabel>
            </div>
          </IonSegmentButton>

          <IonSegmentButton value="approvedOrganizer">  
            <div className="segment-button" style={{ fontSize: "0.8rem"}}>
              <IonIcon 
                icon={checkmarkCircle}
                style={{ margin: "5%"}} 
                size="large">
              </IonIcon> 
              <IonLabel> Approved Organizers</IonLabel>
            </div>
          </IonSegmentButton>

        </IonSegment>
      </>
    )
});

export default AdminSegment