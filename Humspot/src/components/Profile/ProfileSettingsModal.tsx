/**
 * @file ProfileSettingsModal.tsx
 * @fileoverview the modal component that displays when clicking on the settings icon on the Profile page.
 * The modal contains several settings, like Notifications, Dark Mode, etc.
 */

import { useEffect, useRef, useState } from "react";
import {
  IonModal,
  IonList,
  IonItem,
  IonIcon,
  IonLabel,
  IonToggle,
  IonContent,
  IonTitle,
  useIonRouter,
  IonHeader,
  IonToolbar,
  IonButton,
  IonButtons
} from "@ionic/react";
import {
  notificationsOutline,
  moonOutline,
  logOutOutline,
  mailOutline,
  shieldOutline,
  readerOutline,
  logInOutline,
  constructOutline
} from "ionicons/icons";

import { Dialog } from "@capacitor/dialog";
import { Preferences } from "@capacitor/preferences";

import { useContext } from "../../utils/hooks/useContext";
import { canDismiss } from "../../utils/functions/canDismiss";
import { handleGoogleLoginAndVerifyAWSUser, handleLogout } from "../../utils/server";

import './Profile.css';
import { Keyboard, KeyboardStyleOptions, KeyboardStyle } from "@capacitor/keyboard";
import { StatusBar, Style } from "@capacitor/status-bar";

type ProfileSettingsModalProps = {
  page: HTMLElement | undefined;
};

const keyStyleOptionsLight: KeyboardStyleOptions = {
  style: KeyboardStyle.Light
};
const keyStyleOptionsDark: KeyboardStyleOptions = {
  style: KeyboardStyle.Dark
};

const ProfileSettingsModal: React.FC<ProfileSettingsModalProps> = (props) => {

  const context = useContext();
  const router = useIonRouter();

  const modalRef = useRef<HTMLIonModalElement | null>(null);
  const [presentingElement, setPresentingElement] = useState<HTMLElement | undefined>(undefined);

  const toggleDarkMode = async (isChecked: boolean) => {
    if (isChecked) {
      document.body.classList.add("dark");
      await StatusBar.setStyle({ style: Style.Dark });
      await Keyboard.setStyle(keyStyleOptionsDark);
    } else {
      document.body.classList.remove("dark");
      await StatusBar.setStyle({ style: Style.Light });
      await Keyboard.setStyle(keyStyleOptionsLight);
    }
    await Preferences.set({ key: "darkMode", value: JSON.stringify(isChecked) });
    context.setDarkMode(isChecked);
  }

  const clickOnLogout = async () => {
    const { value } = await Dialog.confirm({
      title: 'Logout',
      message: `Are you sure you want to logout?`,
      okButtonTitle: 'Logout'
    });
    if (!value) { return; }
    await handleLogout();
  };


  useEffect(() => {
    setPresentingElement(props.page);
  }, [props.page]);


  return (
    <IonModal ref={modalRef} trigger="open-profile-page-modal" presentingElement={presentingElement} canDismiss={canDismiss}>
      <IonContent className='profile-modal-content'>
        <IonHeader className='ion-no-border'>
          <IonToolbar className='profile-modal-toolbar'>
            <IonTitle className='profile-modal-title'>Settings</IonTitle>
            <IonButtons>
              <IonButton className='profile-modal-close-button' onClick={() => {
                modalRef.current?.dismiss().then(async () => {
                  if (context.darkMode) {
                    await StatusBar.setStyle({ style: Style.Dark });
                  } else {
                    await StatusBar.setStyle({ style: Style.Light });
                  }
                })
              }}>
                <p>Close</p>
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>

        <br />

        <IonList lines='full'>
          <IonItem disabled={!context.humspotUser} style={{}}>
            <IonIcon aria-hidden="true" icon={notificationsOutline} slot="start" color='medium'></IonIcon>
            <IonLabel><IonToggle disabled={!context.humspotUser}>Notifications </IonToggle></IonLabel>
          </IonItem>
          <br />
          <IonItem>
            <IonIcon aria-hidden="true" icon={moonOutline} slot="start" ></IonIcon>
            <IonLabel><IonToggle checked={context.darkMode} onIonChange={(e) => { toggleDarkMode(e.detail.checked) }}>Dark Mode</IonToggle></IonLabel>
          </IonItem>
          <br />
          <IonItem onClick={() => { modalRef?.current?.dismiss().then(() => { router.push("/contact-us") }) }}>
            <IonIcon aria-hidden="true" icon={mailOutline} slot="start" ></IonIcon>
            <IonLabel>Contact Us</IonLabel>
          </IonItem>
          <br />
          <IonItem onClick={() => { modalRef?.current?.dismiss().then(() => { router.push("/privacy-policy") }) }}>
            <IonIcon aria-hidden="true" icon={shieldOutline} slot="start" ></IonIcon>
            <IonLabel>Privacy Policy</IonLabel>
          </IonItem>
          <br />
          <IonItem onClick={() => { modalRef?.current?.dismiss().then(() => { router.push("/terms-and-conditions") }) }}>
            <IonIcon aria-hidden="true" icon={readerOutline} slot="start" ></IonIcon>
            <IonLabel>Terms and Conditions</IonLabel>
          </IonItem>
          <br />
          {context.humspotUser?.accountType === 'admin' &&
            <>
              <IonItem role='button' onClick={() => { modalRef?.current?.dismiss().then(() => { router.push("/admin-dashboard") }) }}>
                <IonIcon aria-hidden="true" icon={constructOutline} slot="start"></IonIcon>
                <IonLabel>Admin Dashboard</IonLabel>
              </IonItem>
              <br />
            </>
          }
          {context.humspotUser === undefined ?
            <>
              <IonItem role='button' onClick={() => { modalRef?.current?.dismiss().then(() => { router.push("/sign-up") }) }}>
                <IonIcon aria-hidden="true" icon={logInOutline} slot="start" ></IonIcon>
                <IonLabel>Sign Up / Sign In</IonLabel>
              </IonItem>
              <br />
              <IonItem role='button' onClick={async () => { modalRef?.current?.dismiss(); await handleGoogleLoginAndVerifyAWSUser() }}>
                <IonIcon aria-hidden="true" icon={logOutOutline} slot="start" ></IonIcon>
                <IonLabel>Google Sign In</IonLabel>
              </IonItem>
            </>
            : context.humspotUser ?
              <IonItem role='button' onClick={async () => { await clickOnLogout() }}>
                <IonIcon aria-hidden="true" icon={logOutOutline} slot="start" ></IonIcon>
                <IonLabel color='danger'>Log Out</IonLabel>
              </IonItem>
              :
              <></>
          }

          <br />
        </IonList>
      </IonContent>
    </IonModal >
  )
};

export default ProfileSettingsModal;