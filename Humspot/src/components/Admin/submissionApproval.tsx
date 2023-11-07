// View submissions
// Should open activities page and have a button to approve or decline
// Default is unapproved lists
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

const SubmissionApproval: React.FC = memo(() => { 

  return(
      <h1> Submission Approval</h1>
  );
});

export default SubmissionApproval