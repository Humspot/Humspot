import { IonToolbar, IonButtons, IonButton, IonIcon, IonHeader, IonCardTitle, IonSkeletonText } from "@ionic/react";
import { addCircleOutline, pencilOutline, settingsOutline } from "ionicons/icons";

import { truncateString } from "../../utils/truncateString";

import { useContext } from "../../utils/my-context";

const ProfileHeader: React.FC = () => {

  const context = useContext();

  return (
    <IonHeader style={{ '--background': 'var(--ion-background-color)' }} className='ion-no-border' mode='ios'>
      <IonToolbar style={{ '--background': 'var(--ion-background-color)' }} mode='ios'>
        <IonCardTitle slot='start' style={{ padding: "10px", fontSize: "1.5rem" }}>
          {context.humspotUser
            ? truncateString(context.humspotUser.username ?? "", 15)
            : <IonSkeletonText animated style={{ width: "50vw", height: "1.5rem" }} />
          }
        </IonCardTitle>
        <IonButtons slot='end'>
          <IonButton disabled={!context.humspotUser} id='open-add-activity-modal' slot='end'>
            <IonIcon size='large' style={{ padding: "1%" }} icon={addCircleOutline} />
          </IonButton>
          <IonButton disabled={!context.humspotUser} id='open-edit-profile-modal' slot='end'>
            <IonIcon size='large' style={{ padding: "1%" }} icon={pencilOutline} />
          </IonButton>
          <IonButton disabled={!context.humspotUser} id='open-profile-page-modal' slot='end'>
            <IonIcon size='large' style={{ padding: "2.5%" }} icon={settingsOutline} />
          </IonButton>
        </IonButtons>
      </IonToolbar>
    </IonHeader>
  );
};

export default ProfileHeader;