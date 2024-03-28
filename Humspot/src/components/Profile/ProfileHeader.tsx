/**
 * @file ProfileHeader.tsx
 * @fileoverview the header on the Profile page, Contains the buttons which opens the corresponding 
 * modal components as well as the user's username.
 */

import { IonToolbar, IonButtons, IonButton, IonIcon, IonHeader, IonCardTitle, IonSkeletonText, IonTitle, useIonRouter } from "@ionic/react";
import { alertCircleOutline, chevronBackOutline, pencilOutline, settingsOutline, shareOutline } from "ionicons/icons";

import useContext from "../../utils/hooks/useContext";

import './Profile.css';
import { HumspotUser } from "../../utils/types";
import { handleShare } from "../../utils/functions/handleShare";

type ProfileHeaderProps = {
  user: HumspotUser | null | undefined;
  buttons: boolean;
  backButton: boolean;
  shareButton: boolean;
}

const ProfileHeader = (props: ProfileHeaderProps) => {

  const humspotUser = props.user;
  const router = useIonRouter();

  const handleReport = async () => {

  };

  return (
    <IonHeader className='ion-no-border profile-modal-content' mode='ios' >
      <IonToolbar style={{ '--background': 'var(--ion-background-color)' }} mode='ios'>
        {props.backButton &&
          <IonButtons>
            <IonButton style={{ fontSize: '1.15em', marginLeft: '-2.5px' }} onClick={() => { router.goBack(); }}>
              <IonIcon icon={chevronBackOutline} /> <p>Back</p>
            </IonButton>
          </IonButtons>
        }
        <IonCardTitle slot={props.backButton ? 'end' : 'start'} className='profile-header-title'>
          {humspotUser
            ? humspotUser.username
            : <IonSkeletonText animated style={{ width: "50vw", height: "1.5rem" }} />
          }
        </IonCardTitle>
        {props.buttons &&
          <IonButtons slot='end'>
            <IonButton disabled={!humspotUser} id='open-edit-profile-modal' slot='end'>
              <IonIcon size='large' style={{ padding: "1%" }} icon={pencilOutline} />
            </IonButton>
            <IonButton id='open-profile-page-modal' slot='end'>
              <IonIcon size='large' style={{ padding: "2.5%" }} icon={settingsOutline} />
            </IonButton>
          </IonButtons>
        }
        {props.shareButton &&
          <IonButtons slot='end'>
            <IonButton disabled={!humspotUser} slot='end' onClick={() => handleShare('Checkout ' + humspotUser?.username + '\'s profile on Humspot!')}>
              <IonIcon style={{ padding: "1%" }} icon={shareOutline} />
            </IonButton>
            <IonButton disabled={!humspotUser} slot='end' onClick={async () => await handleReport()}>
              <IonIcon style={{ paddingTop: "10%" }} icon={alertCircleOutline} />
            </IonButton>
          </IonButtons>
        }
      </IonToolbar>
    </IonHeader>
  );
};

export default ProfileHeader;