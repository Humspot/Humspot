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
    IonThumbnail 
} from "@ionic/react";

import {
  checkmarkCircleOutline,
} from "ionicons/icons";
import { useContext, useState } from "react";
import {memo} from "react"
import { HumspotFavoriteResponse } from "../../utils/types";

const AdminSegment: React.FC = memo(() => { 
    return(
        <>  
        <IonSegment style={{paddingLeft: "2.5%", paddingRight:"2.5%"}}>
          <IonSegmentButton value="pendingActivities">  
            <div className="segment-button" style={{ fontSize: "0.8rem"}}>
              <IonIcon 
                icon={checkmarkCircleOutline}
                style={{ margin: "5%"}} 
                size="large">
              </IonIcon> 
              <IonLabel> Pending Activities</IonLabel>
            </div>
          </IonSegmentButton>
  
        </IonSegment>
      </>
    )
});

export default AdminSegment