/**
 * @file ProfileHeader.tsx
 * @fileoverview the header on the Profile page, Contains the buttons which opens the corresponding 
 * modal components as well as the user's username.
 */

import { IonToolbar, IonButtons, IonButton, IonIcon, IonHeader, IonCardTitle, IonSkeletonText } from "@ionic/react";
import { pencilOutline, settingsOutline } from "ionicons/icons";

import { useContext } from "../../utils/hooks/useContext";

import './Profile.css';

const ProfileHeader: React.FC = () => {

  const context = useContext();

  return (
    <IonHeader className='ion-no-border profile-modal-content' mode='ios' style={{ paddingBottom: 0, marginBottom: 0 }}>
      <IonToolbar style={{ '--background': 'var(--ion-background-color)', paddingBottom: 0, marginBottom: 0 }} mode='ios'>
        <IonCardTitle slot='start' className='profile-header-title'>
          {context.humspotUser
            ? context.humspotUser.username
            : <IonSkeletonText animated style={{ width: "50vw", height: "1.5rem" }} />
          }
        </IonCardTitle>
        <IonButtons slot='end'>
          <IonButton disabled={!context.humspotUser} id='open-edit-profile-modal' slot='end'>
            <IonIcon size='large' style={{ padding: "1%" }} icon={pencilOutline} />
          </IonButton>
          <IonButton id='open-profile-page-modal' slot='end'>
            <IonIcon size='large' style={{ padding: "2.5%" }} icon={settingsOutline} />
          </IonButton>
        </IonButtons>
      </IonToolbar>
    </IonHeader>
  );
};

export default ProfileHeader;