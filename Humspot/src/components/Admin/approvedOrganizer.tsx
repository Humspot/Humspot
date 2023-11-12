// View pending Organizers  
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

const approvedOrganizer: React.FC = memo(() => { 

  return(
    <>  
        <h1> Approved Organizers </h1>
    </>

  );
});

export default approvedOrganizer