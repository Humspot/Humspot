import {
  IonAvatar, IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonInput, IonItem,
  IonList, IonLoading, IonModal, IonTextarea, IonTitle, IonToolbar, useIonLoading
} from "@ionic/react";
import { useContext } from "../../utils/my-context";
import { cameraReverseOutline, chevronBackOutline } from "ionicons/icons";
import { useEffect, useRef, useState } from "react";

import avatar from '../../elements/avatar.svg';
import { useToast } from "@agney/ir-toast";
import { handleAddImages, handleUpdateUserProfile } from "../../utils/server";


const ProfileEditModal = () => {

  const context = useContext();
  const Toast = useToast();
  const [present, dismiss] = useIonLoading();

  const modalRef = useRef<HTMLIonModalElement | null>(null);
  const usernameRef = useRef<HTMLIonInputElement | null>(null);
  const bioRef = useRef<HTMLIonTextareaElement | null>(null);

  const handleUpdateProfilePhoto = async () => {
    if (!context.humspotUser) {
      const t = Toast.create({ message: "Something went wrong", duration: 2000, color: "danger" });
      t.present();
      return;
    }
    const res = await handleAddImages('profile--photos', `profile-pictures/${context.humspotUser.userID}-profile-photo`, false, 1, present);
    if (res.message) {
      const t = Toast.create({ message: res.message, duration: 2000, color: "danger" });
      t.present();
      dismiss();
      return;
    }

    if (res.photoUrls[0]) {
      if (res.photoUrls[0]) {
        let uniqueString = new Date().getTime(); // Use a timestamp to force cache refresh
        let updatedImageUrl = `${res.photoUrls[0]}?${uniqueString}`;
        let tempUser = { ...context.humspotUser, profilePicURL: updatedImageUrl };
        context.setHumspotUser(tempUser);
        const t = Toast.create({ message: "File uploaded successfully", duration: 2000, color: "success" });
        t.present();
      }
    }
    dismiss();
  };

  const updateProfile = async () => {
    if (!context.humspotUser || usernameRef.current == null || bioRef.current == null) {
      const t = Toast.create({ message: "Something went wrong", duration: 2000, color: "danger" });
      t.present();
      return;
    }
    if (usernameRef.current.value === context.humspotUser.username
      && bioRef.current.value === context.humspotUser.bio) {
      const t = Toast.create({ message: "Nothing to update", duration: 2000, color: "danger" });
      t.present();
      return;
    }
    present({ message: "Updating..." });
    const res = await handleUpdateUserProfile(context.humspotUser.userID, (usernameRef.current.value as string), (bioRef.current.value as string), "");
    if (res.success) {
      let tempUser = { ...context.humspotUser, username: usernameRef.current.value as string, bio: bioRef.current.value as string };
      context.setHumspotUser(tempUser);
      const t = Toast.create({ message: "Updated profile successfully", duration: 2000, color: "success" });
      t.present();
    } else {
      const t = Toast.create({ message: "Something went wrong", duration: 2000, color: "danger" });
      t.present();
    }
    dismiss();
  }

  return (
    <IonModal ref={modalRef} trigger="open-edit-profile-modal">
      {!context.humspotUser ? // loading
        <>
          <IonLoading message={"Loading Profile..."} />
        </>
        :
        <>
          <IonHeader className='ion-no-border'>
            <IonToolbar>
              <IonButtons>
                <IonButton style={{ fontSize: '1.25em', marginLeft: '5px' }} onClick={() => { usernameRef.current = null; bioRef.current = null; modalRef.current?.dismiss(); }}>
                  <IonIcon icon={chevronBackOutline} />
                </IonButton>
                <IonTitle>Edit Profile</IonTitle>
              </IonButtons>
            </IonToolbar>
          </IonHeader>

          <IonContent style={{ '--background': 'var(--ion-item-background' }}>
            <br />

            <section className='avatar-wrapper-center'>
              <IonAvatar className="user-avatar-settings">
                <img
                  src={context.humspotUser.profilePicURL}
                  alt="User Profile Picture"
                />
                <IonIcon size="large" icon={cameraReverseOutline}
                  role='button' onClick={async () => await handleUpdateProfilePhoto()}
                  style={{ position: "absolute", zIndex: 1000 }} />
              </IonAvatar>
            </section>

            <br />

            <section id="update-profile-inputs">
              <IonList lines='none'>
                <IonItem>
                  <IonInput ref={usernameRef} maxlength={50} label="Username" value={context.humspotUser.username} ></IonInput>
                </IonItem>
                <IonItem style={{ height: "25vh" }}>
                  <IonTextarea ref={bioRef} label="Bio" maxlength={250} rows={5} value={context.humspotUser.bio} />
                </IonItem>
              </IonList>
            </section>

            <br />

            <IonButton className="login-button" onClick={async () => { await updateProfile() }} fill="clear" expand="block" id="submit-profile-edit-changes">Update</IonButton>

          </IonContent>

        </>
      }

    </IonModal>
  );

};

export default ProfileEditModal;