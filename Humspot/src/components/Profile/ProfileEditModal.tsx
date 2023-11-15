import { useEffect, useRef, useState } from "react";
import {
  IonAvatar, IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonInput, IonItem, IonLabel,
  IonList, IonLoading, IonModal, IonTextarea, IonTitle, IonToolbar, useIonLoading
} from "@ionic/react";
import { cameraReverseOutline, chevronBackOutline } from "ionicons/icons";

import { useToast } from "@agney/ir-toast";

import avatar from '../../assets/images/avatar.svg';
import { useContext } from "../../utils/my-context";
import { handleAddImages, handleUpdateProfilePhoto, handleUpdateUserProfile } from "../../utils/server";

type ProfileEditModalProps = {
  page: HTMLElement | undefined;
};

async function canDismiss(data?: any, role?: string) {
  return role !== 'gesture';
};

const ProfileEditModal: React.FC<ProfileEditModalProps> = (props) => {

  const context = useContext();
  const Toast = useToast();
  const [present, dismiss] = useIonLoading();

  const modalRef = useRef<HTMLIonModalElement | null>(null);
  const usernameRef = useRef<HTMLIonInputElement | null>(null);
  const bioRef = useRef<HTMLIonTextareaElement | null>(null);

  const [presentingElement, setPresentingElement] = useState<HTMLElement | undefined>(undefined);

  const clickUpdateProfilePhoto = async () => {
    if (!context.humspotUser) {
      const t = Toast.create({ message: "Something went wrong", duration: 2000, color: "danger" });
      t.present();
      return;
    }
    const res = await handleAddImages('profile--photos', `profile-pictures/${context.humspotUser.userID}-profile-photo`, false, 1, present);
    if (res.message || !res.photoUrls || !res.photoUrls[0]) {
      const t = Toast.create({ message: res.message, duration: 2000, color: "danger" });
      t.present();
      dismiss();
      return;
    }

    if (res.photoUrls[0]) {
      const added = await handleUpdateProfilePhoto(context.humspotUser.userID, res.photoUrls[0]);
      if (!added.success) {
        const t = Toast.create({ message: "Something went wrong", duration: 2000, color: "danger" });
        t.present();
      }
      let uniqueString = new Date().getTime(); // Use a timestamp to force cache refresh
      let updatedImageUrl = `${res.photoUrls[0]}?${uniqueString}`;
      let tempUser = { ...context.humspotUser, profilePicURL: updatedImageUrl };
      context.setHumspotUser(tempUser);
      const t = Toast.create({ message: "File uploaded successfully", duration: 2000, color: "success" });
      t.present();
    }
    dismiss();
  };

  const clickUpdateProfile = async () => {
    if (!context.humspotUser || !usernameRef.current || !bioRef.current) {
      const t = Toast.create({ message: "Something went wrong", duration: 2000, color: "danger" });
      t.present();
      return;
    }
    if (!usernameRef.current.value || usernameRef.current.value.toString().trim().length <= 0) {
      const t = Toast.create({ message: "Username cannot be empty!", duration: 2000, color: "danger" });
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
    const res = await handleUpdateUserProfile(context.humspotUser.userID, (usernameRef.current.value as string).replace(/\s/g, ""), (bioRef.current.value as string));
    if (res.success) {
      let tempUser = { ...context.humspotUser, username: (usernameRef.current.value as string).replace(/\s/g, ""), bio: bioRef.current.value as string };
      context.setHumspotUser(tempUser);
      const t = Toast.create({ message: "Updated profile successfully", duration: 2000, color: "success" });
      t.present();
      modalRef.current && modalRef.current.dismiss();
    } else {
      const t = Toast.create({ message: "Something went wrong", duration: 2000, color: "danger" });
      t.present();
    }
    dismiss();
  };

  useEffect(() => {
    setPresentingElement(props.page);
  }, [props.page]);

  return (
    <IonModal ref={modalRef} trigger="open-edit-profile-modal" presentingElement={presentingElement} canDismiss={canDismiss}>
      {!context.humspotUser ? // loading
        <>
          <IonLoading message={"Loading Profile..."} />
        </>
        :
        <>
          <IonHeader className='ion-no-border'>
            <IonToolbar>
              <IonTitle style={{ fontSize: "1.25rem" }}>Edit Profile</IonTitle>
              <IonButtons style={{ height: "5vh" }}>
                <IonButton style={{ fontSize: '1.15em', marginLeft: "-2.5%" }} onClick={() => { usernameRef.current = null; bioRef.current = null; modalRef.current?.dismiss(); }}>
                  <IonIcon icon={chevronBackOutline} /> <p>Back</p>
                </IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>

          <IonContent style={{ '--background': 'var(--ion-item-background' }}>
            <br />

            <section className='avatar-wrapper-center'>
              <IonAvatar className="user-avatar-settings">
                <img
                  style={{ opacity: "0.5" }}
                  src={context.humspotUser.profilePicURL ?? avatar}
                  alt="User Profile Picture"
                />
                <IonIcon size="large" icon={cameraReverseOutline}
                  role='button' onClick={async () => await clickUpdateProfilePhoto()} />
              </IonAvatar>
            </section>


            <br />

            <section id="update-profile-inputs">
              <IonList lines='none'>
                <IonItem>
                  <IonLabel position="fixed">Username</IonLabel>
                  <IonInput aria-label="Username" ref={usernameRef} maxlength={50} value={context.humspotUser.username}></IonInput>
                </IonItem>
                <IonItem>
                  <IonLabel position="fixed" style={{ alignSelf: 'flex-start' }}>About</IonLabel>
                  <IonTextarea aria-label="About" ref={bioRef} maxlength={250} rows={3} value={context.humspotUser.bio} />
                </IonItem>
              </IonList>
            </section>

            <br />

            <IonButton className="login-button" onClick={async () => { await clickUpdateProfile() }} fill="clear" expand="block" id="submit-profile-edit-changes">Update</IonButton>

          </IonContent>

        </>
      }

    </IonModal>
  );

};

export default ProfileEditModal;