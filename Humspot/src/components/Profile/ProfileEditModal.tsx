import { IonAvatar, IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonInput, IonItem, IonList, IonLoading, IonModal, IonTextarea, IonTitle, IonToolbar } from "@ionic/react";
import { useContext } from "../../utils/my-context";
import { cameraReverseOutline, chevronBackOutline } from "ionicons/icons";
import { useEffect, useRef, useState } from "react";

import avatar from '../../elements/avatar.svg';
import { Camera, CameraResultType } from "@capacitor/camera";
import { useToast } from "@agney/ir-toast";
import { handleAddImages } from "../../utils/server";
import { HumspotUser } from "../../utils/types";


const ProfileEditModal = () => {

  const context = useContext();
  const modalRef = useRef<HTMLIonModalElement | null>(null);

  const [tempUser, setTempUser] = useState<HumspotUser | null | undefined>(null);

  useEffect(() => {
    if (context.humspotUser) {
      setTempUser(context.humspotUser);
    }
  }, [context.humspotUser]);

  const Toast = useToast();

  const handleChooseImage = async () => {
    if (!tempUser) return;
    const res = await handleAddImages(tempUser.userID, 'profile--photos', `profile-pictures/${tempUser.userID}-profile-photo`, false, 1);
    if (res.message) {
      const t = Toast.create({ message: res.message, duration: 2000, color: "danger" });
      t.present();
      return;
    }

    if (res.photoUrls[0]) {
      setTempUser(prevUser =>
        prevUser ? {
          ...prevUser,
          profilePicURL: res.photoUrls[0]
        } : null
      );
    }
  };

  return (
    <IonModal ref={modalRef} trigger="open-edit-profile-modal">
      {!tempUser ? // loading
        <>
          <IonLoading message={"Loading Profile..."} />
        </>
        :
        <>
          <IonHeader className='ion-no-border'>
            <IonToolbar>
              <IonButtons>
                <IonButton style={{ fontSize: '1.25em', marginLeft: '5px' }} onClick={() => { setTempUser(context.humspotUser); modalRef.current?.dismiss(); }}>
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
                  src={tempUser.profilePicURL ?? avatar}
                  alt="User Profile Picture"
                />
                <IonIcon size="large" icon={cameraReverseOutline}
                  role='button' onClick={async () => await handleChooseImage()}
                  style={{ position: "absolute", zIndex: 1000 }} />
              </IonAvatar>
            </section>

            <br />

            <section id="update-profile-inputs">
              <IonList lines='none'>
                <IonItem>
                  <IonInput label="Username" placeholder={tempUser.username}></IonInput>
                </IonItem>
                <IonItem style={{ height: "25vh" }}>
                  <IonTextarea label="Bio" maxlength={250} rows={5} placeholder={tempUser.bio ?? 'Enter something about you here!'} />
                </IonItem>
              </IonList>
            </section>

            <br />

            <IonButton className="login-button" onClick={() => { }} fill="clear" expand="block" id="submit-profile-edit-changes">Update</IonButton>


          </IonContent>

        </>
      }

    </IonModal>
  );

};

export default ProfileEditModal;