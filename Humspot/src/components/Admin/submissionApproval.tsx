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
    IonItem 
} from "@ionic/react";

import {star} from "ionicons/icons"
import { useState } from "react";
import {memo} from "react"

const SubmissionApproval: React.FC = memo(() => {

    const [selectedSegment, setSelectedSegment] = useState<string>("favorites");
    
return(
    <>  
        <IonSegment style={{ paddingLeft: "2.5%", paddingRight: "2.5%" }} value={selectedSegment} onIonChange={(e) => { setSelectedSegment(e.detail.value as string) }}> 
        </IonSegment>

        <IonContent>
        {selectedSegment === "favorites" ? (
          <IonCard>
            <IonCardContent>
              <IonList>
                {!favoritesLoading ?
                  favorites.map((favorite: HumspotFavoriteResponse, index: number) => {
                    return (
                      <IonItem className='ion-no-padding' key={favorite.name + index} role='button' onClick={() => {  }}>
                        <IonThumbnail><img src={favorite.photoUrl || ''} /></IonThumbnail>
                        <IonLabel style={{ paddingLeft: "10px" }}>
                          <h2>{favorite.name}</h2>
                          <p style={{ fontSize: "0.9rem" }}>{favorite.description}</p>
                          <p style={{ fontSize: "0.8rem" }}>{favorite.location}</p>
                        </IonLabel>
                      </IonItem>
                    )
                  })
                  :
                  <>
                    <IonSkeletonText style={{ height: "2rem" }} animated />
                    <IonSkeletonText style={{ height: "2rem" }} animated />
                    <IonSkeletonText style={{ height: "2rem" }} animated />
                    <IonSkeletonText style={{ height: "2rem" }} animated />
                  </>
                }
              </IonList>
            </IonCardContent>
          </IonCard>
        ) : (
            <IonContent>  
                <h1> Nothing Yet</h1>
            </IonContent>
        )
        } 
        </IonContent>
    </>

);
});

export default SubmissionApproval