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
    useIonRouter
} from "@ionic/react";

import {
  checkmarkCircleOutline,
} from "ionicons/icons";
import { useContext, useState } from "react";
import {memo} from "react"
import { HumspotFavoriteResponse } from "../../utils/types";

function SubmissionApproval({title, description, imgsrc, id}: any) { 
  const router = useIonRouter();
  return(
    <IonCard
      onClick={()=>{
        router.push("/activities/" + id);
      }}
    >
      <div>
        <IonImg
        alt="Attraction Image"
        src={imgsrc}
        className="Pending"
        ></IonImg>
      </div>
      
      <IonCardHeader>
        <IonCardTitle>{title}</IonCardTitle>
        <IonCardSubtitle> {description}</IonCardSubtitle>
      </IonCardHeader>

    </IonCard>
  );
}

export default SubmissionApproval