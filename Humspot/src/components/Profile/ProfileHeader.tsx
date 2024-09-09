/**
 * @file ProfileHeader.tsx
 * @fileoverview the header on the Profile page, Contains the buttons which opens the corresponding 
 * modal components as well as the user's username.
 */

import { IonToolbar, IonButtons, IonButton, IonIcon, IonHeader, IonCardTitle, IonSkeletonText, IonContent, IonTextarea, IonModal, useIonRouter, IonTitle, useIonAlert, useIonToast, useIonLoading, IonNote } from "@ionic/react";
import { alertCircleOutline, chevronBackOutline, pencilOutline, settingsOutline, shareSocialOutline } from "ionicons/icons";

import { useContext } from "../../utils/hooks/useContext";

import './Profile.css';
import { handleShare } from "../../utils/functions/handleShare";
import { HumspotUser } from "../../utils/types";
import { useRef, useState } from "react";
import { handleBlockUser, handleClickOnReportButton } from "../../utils/server";

type ProfileHeaderProps = {
  user: HumspotUser | null | undefined;
  buttons: boolean;
  backButton: boolean;
  shareButton: boolean;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = (props: ProfileHeaderProps) => {

  const { user, buttons, backButton, shareButton } = props;
  const router = useIonRouter();
  const context = useContext();
  const [presentAlert] = useIonAlert();
  const [presentToast] = useIonToast();
  const [presentLoading, dismissLoading] = useIonLoading();
  const [loading, setLoading] = useState<boolean>(false);
  const modalRef = useRef<HTMLIonModalElement | null>(null);
  const [details, setDetails] = useState<string>('');

  const clickOnReport = async () => {
    modalRef.current && modalRef.current.present();
  }

  const handleReport = async () => {
    if (!user) return;
    await presentAlert({
      cssClass: 'ion-alert-logout',
      header: 'Report / Block',
      message: `Are you sure you want to report / block ${user.username}?`,
      buttons:
        [
          {
            text: 'Cancel',
            role: 'cancel',
            cssClass: 'alert-cancel-button',
          },
          {
            text: 'Report',
            id: 'click-on-report',
            cssClass: 'alert-cancel-button',
            handler: async () => {
              await clickOnReport();
            },
          },
        ]
    });
  };

  const handleReportUser = async () => {
    if (!details || details.trim().length <= 0) {
      presentToast({ message: 'Please provide a reason why', color: 'danger', duration: 2000 });
      return;
    }
    if (context.humspotUser && user) {
      setLoading(true);
      const res = await handleClickOnReportButton(context.humspotUser.userID, context.humspotUser.email, user.userID, user?.email, details);
      if (res.success) {
        presentToast({ message: 'Report sent successfully', color: 'secondary', duration: 2000 });
      } else {
        presentToast({ message: 'Something went wrong', color: 'danger', duration: 2000 });
      }
      setLoading(false);
    }
  };

  const handleClickOnBlockUser = async () => {
    if (!context.humspotUser || !user) return;
    await presentLoading({ message: "Blocking..." });
    const res = await handleBlockUser(context.humspotUser.userID, user.userID)
    if (res.success) {
      presentToast({ message: 'User blocked', color: 'secondary', duration: 2000 });
    } else {
      presentToast({ message: 'Something went wrong', color: 'danger', duration: 2000 });
    }
    await dismissLoading();
  };

  return (
    <>
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
            {user === null
              ? <IonSkeletonText animated style={{ width: "50vw", height: "1.5rem", borderRadius: '5px' }} />
              : user === undefined ?
                "Humspot Guest"
                : user.username
            }
          </IonCardTitle>
          {props.buttons &&
            <IonButtons slot='end'>
              <IonButton disabled={!user} id='open-edit-profile-modal' slot='end'>
                <IonIcon size='large' style={{ padding: "1%", opacity: user ? '100%' : '0%' }} icon={pencilOutline} />
              </IonButton>
              <IonButton id='open-profile-page-modal' slot='end'>
                <IonIcon size='large' style={{ padding: "2.5%" }} icon={settingsOutline} />
              </IonButton>
            </IonButtons>
          }
          {props.shareButton &&
            <IonButtons slot='end'>
              <IonButton disabled={!user} slot='end' onClick={() => handleShare('Checkout ' + user?.username + '\'s profile on Humspot!')}>
                <IonIcon style={{ padding: "1%" }} icon={shareSocialOutline} />
              </IonButton>
              {user && context.humspotUser && user.userID !== context.humspotUser.userID &&
                <IonButton disabled={!user} slot='end' onClick={async () => await handleReport()}>
                  <IonIcon color='danger' style={{ paddingTop: "10%" }} icon={alertCircleOutline} />
                </IonButton>
              }
            </IonButtons>
          }
        </IonToolbar>
      </IonHeader>

      <IonModal ref={modalRef}>
        <IonHeader className='ion-no-border'>
          <IonToolbar className='profile-modal-content'>
            <IonTitle className='profile-modal-title'>Report / Block</IonTitle>
            <IonButtons>
              <IonButton className='profile-modal-close-button' onClick={() => { modalRef.current?.dismiss() }}>
                <p>Close</p>
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>

        <IonContent className='profile-modal-content' scrollY={false}>
          <section >
            <p style={{ paddingLeft: '20px', paddingRight: '20px' }}>You are reporting {user ? user.username : ' a user'}, please provide a reason below</p>
            <IonTextarea style={{ padding: '20px' }} onIonInput={(e) => setDetails(e.detail.value as string)} placeholder="This user is not being nice! ..." rows={3}> </IonTextarea>
            <IonButton color='danger' disabled={loading} className="profile-edit-modal-update-button" onClick={handleReportUser} expand="block">Report</IonButton>
            <p style={{ fontSize: '0.9rem' }} className='ion-text-center'><IonNote className='ion-text-center'><span>OR</span></IonNote></p>
            <IonButton color='danger' disabled={loading} className="profile-edit-modal-update-button" onClick={handleClickOnBlockUser} expand="block">Block User</IonButton>
          </section>
        </IonContent>
      </IonModal>
    </>
  );
};

export default ProfileHeader;