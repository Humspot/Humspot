import { useEffect, useRef } from "react";
import {
  IonAvatar, IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonInput, IonItem, IonLabel,
  IonList, IonLoading, IonModal, IonTextarea, IonTitle, IonToolbar, useIonLoading
} from "@ionic/react";
import { cameraReverseOutline, chevronBackOutline } from "ionicons/icons";

import { useToast } from "@agney/ir-toast";

import avatar from '../../assets/images/avatar.svg';
import { useContext } from "../../utils/my-context";
import { handleAddProfileImageToS3, handleUpdateProfilePhoto, handleUpdateUserProfile } from "../../utils/server";
import { Camera, CameraResultType } from "@capacitor/camera";

let uniqueString = new Date().getTime(); // Use a timestamp to force cache refresh

const ProfileEditModal: React.FC = () => {

  const context = useContext();
  const Toast = useToast();
  const [present, dismiss] = useIonLoading();

  const modalRef = useRef<HTMLIonModalElement | null>(null);
  const usernameRef = useRef<HTMLIonInputElement | null>(null);
  const bioRef = useRef<HTMLIonTextareaElement | null>(null);

  useEffect(() => {
    const eventListener: any = (ev: CustomEvent<any>) => {
      ev.detail.register(20, async () => {
        await modalRef?.current?.dismiss();
      });
    };

    document.addEventListener('ionBackButton', eventListener);

    return () => {
      document.removeEventListener('ionBackButton', eventListener);
    };
  }, [modalRef]);

  const clickUpdateProfilePhoto = async () => {
    if (!context.humspotUser) {
      const t = Toast.create({ message: "Something went wrong", duration: 2000, color: "danger" });
      t.present();
      return;
    }
    present({ message: "Loading..." });
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      // source: CameraSource.Prompt, uncomment when on iOS / Android
      resultType: CameraResultType.Uri,
    });

    if (!image) return;
    if (!image.webPath) {
      const toast = Toast.create({ message: 'Something went wrong', duration: 2000, color: 'danger' });
      toast.present();
      return;
    }
    const path = await fetch(image.webPath!);
    const blobRes = await path.blob();
    if (blobRes) {
      if (blobRes.size > 15_000_000) { // 15 MB
        const toast = Toast.create({ message: 'Image too large', duration: 2000, color: 'danger' });
        toast.present();
        return;
      } else {
        const res = await handleAddProfileImageToS3(context.humspotUser.userID, blobRes);
        const added = await handleUpdateProfilePhoto(context.humspotUser.userID, res.photoUrl);
        if (!added.success) {
          const t = Toast.create({ message: "Something went wrong", duration: 2000, color: "danger" });
          t.present();
        }
        let tempUser = { ...context.humspotUser, profilePicURL: `${res.photoUrl}?${uniqueString}` };
        context.setHumspotUser(tempUser);
        const t = Toast.create({ message: "File uploaded successfully", duration: 2000, color: "success" });
        t.present();
      }
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
            <IonToolbar style={{ '--background': 'var(--ion-item-background' }}>
              <IonButtons>
                <IonButton color='secondary' style={{ fontSize: '1.25em', marginLeft: '5px' }} onClick={() => { usernameRef.current = null; bioRef.current = null; modalRef.current?.dismiss(); }}>
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
                  style={{ opacity: "0.5" }}
                  src={`${context.humspotUser.profilePicURL ?? avatar}?${uniqueString}`}
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

            <IonButton color='secondary' className="edit-modal-button" onClick={async () => { await clickUpdateProfile() }}  expand="block" id="submit-profile-edit-changes">Update</IonButton>

          </IonContent>

        </>
      }

    </IonModal>
  );

};

export default ProfileEditModal;