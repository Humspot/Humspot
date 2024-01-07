/**
 * @file ProfileSettingsModal.tsx
 * @fileoverview the modal component that displays when clicking on the settings icon on the Profile page.
 * The modal contains several settings, like Notifications, Dark Mode, etc.
 */

import { useEffect, useRef, useState } from 'react';
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
  IonButtons,
  useIonLoading,
  IonFab,
  IonCardTitle,
  IonAlert,
  useIonAlert
} from '@ionic/react';
import {
  moonOutline,
  logOutOutline,
  mailOutline,
  shieldOutline,
  readerOutline,
  logInOutline,
  constructOutline,
  logoGoogle
} from 'ionicons/icons';
import { Preferences } from '@capacitor/preferences';

import { useContext } from '../../utils/hooks/useContext';
import { canDismiss } from '../../utils/functions/canDismiss';
import { handleGoogleLoginAndVerifyAWSUser, handleLogout } from '../../utils/server';

import './Profile.css';
import { Keyboard, KeyboardStyleOptions, KeyboardStyle } from '@capacitor/keyboard';
import { StatusBar, Style } from '@capacitor/status-bar';

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
  const [present, dismiss] = useIonLoading();
  const [presentAlert] = useIonAlert();

  const modalRef = useRef<HTMLIonModalElement | null>(null);
  const [presentingElement, setPresentingElement] = useState<HTMLElement | undefined>(undefined);

  const toggleDarkMode = async (isChecked: boolean) => {
    context.setDarkMode(isChecked);
    await Preferences.set({ key: 'darkMode', value: JSON.stringify(isChecked) });
    if (isChecked) {
      document.body.classList.add('dark');
      await StatusBar.setStyle({ style: Style.Dark });
      await Keyboard.setStyle(keyStyleOptionsDark);
    } else {
      document.body.classList.remove('dark');
      await StatusBar.setStyle({ style: Style.Light });
      await Keyboard.setStyle(keyStyleOptionsLight);
    }
  }

  const clickOnLogout = async () => {
    await present({ message: 'Logging Out...' })
    await handleLogout();
    await dismiss();
  };

  const handleShowLogoutDialog = async () => {
    presentAlert({
      header: 'Logout',
      message: 'Are you sure you want to logout?',
      buttons:
        [
          {
            text: 'Cancel',
            role: 'cancel',
            cssClass: 'alert-cancel-button',
          },
          {
            text: 'Logout',
            cssClass: 'ion-alert-dialog-confirm',
            handler: async () => {
              await clickOnLogout();
            },
          },
        ]
    })
  }


  useEffect(() => {
    setPresentingElement(props.page);
  }, [props.page]);

  const handleStatusBarUpdate = async () => {
    if (context.darkMode) {
      await StatusBar.setStyle({ style: Style.Dark });
    } else {
      await StatusBar.setStyle({ style: Style.Light });
    }
  }


  return (
    <IonModal ref={modalRef} onDidDismiss={handleStatusBarUpdate} trigger='open-profile-page-modal' presentingElement={presentingElement}>
      <IonContent className='profile-modal-content' scrollY={false}>
        <IonHeader className='ion-no-border'>
          <IonToolbar className='profile-modal-toolbar'>
            <IonTitle className='profile-modal-title'>Settings</IonTitle>
            <IonButtons>
              <IonButton className='profile-modal-close-button' onClick={() => {
                modalRef.current?.dismiss().then(async () => { await handleStatusBarUpdate() })
              }}>
                <p>Close</p>
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>

        <br />

        <IonList lines='full'>
          <IonItem>
            <IonIcon aria-hidden='true' icon={moonOutline} slot='start' ></IonIcon>
            <IonLabel><IonToggle checked={context.darkMode} onIonChange={(e) => { toggleDarkMode(e.detail.checked) }}>Dark Mode</IonToggle></IonLabel>
          </IonItem>
          <IonItem style={{ marginTop: '10px', marginBottom: '10px' }} onClick={() => { modalRef?.current?.dismiss().then(() => { router.push('/contact-us') }) }}>
            <IonIcon aria-hidden='true' icon={mailOutline} slot='start' ></IonIcon>
            <IonLabel>Contact Us</IonLabel>
          </IonItem>
          <IonItem style={{ marginTop: '10px', marginBottom: '10px' }} onClick={() => { modalRef?.current?.dismiss().then(() => { router.push('/privacy-policy') }) }}>
            <IonIcon aria-hidden='true' icon={shieldOutline} slot='start' ></IonIcon>
            <IonLabel>Privacy Policy</IonLabel>
          </IonItem>
          <IonItem style={{ marginTop: '10px', marginBottom: '10px' }} onClick={() => { modalRef?.current?.dismiss().then(() => { router.push('/terms-and-conditions') }) }}>
            <IonIcon aria-hidden='true' icon={readerOutline} slot='start' ></IonIcon>
            <IonLabel>Terms and Conditions</IonLabel>
          </IonItem>
          {context.humspotUser?.accountType === 'admin' &&
            <>
              <IonItem style={{ marginTop: '10px', marginBottom: '10px' }} role='button' onClick={() => { modalRef?.current?.dismiss().then(() => { router.push('/admin-dashboard') }) }}>
                <IonIcon aria-hidden='true' icon={constructOutline} slot='start'></IonIcon>
                <IonLabel>Admin Dashboard</IonLabel>
              </IonItem>
            </>
          }
          {context.humspotUser === undefined ?
            <>
              <IonItem style={{ marginTop: '10px', marginBottom: '10px' }} role='button' onClick={() => { context.setShowTabs(false); modalRef?.current?.dismiss().then(() => { router.push('/sign-up') }) }}>
                <IonIcon aria-hidden='true' icon={logInOutline} slot='start' ></IonIcon>
                <IonLabel>Sign Up / Sign In</IonLabel>
              </IonItem>
              <IonItem style={{ marginTop: '10px', marginBottom: '10px' }} role='button' onClick={async () => { modalRef?.current?.dismiss(); router.push('/explore', 'root', 'replace'); await handleGoogleLoginAndVerifyAWSUser() }}>
                <IonIcon aria-hidden='true' icon={logoGoogle} slot='start' ></IonIcon>
                <IonLabel>Google Sign In</IonLabel>
              </IonItem>
            </>
            : context.humspotUser ?
              <IonItem style={{ marginTop: '10px', marginBottom: '10px' }} role='button' onClick={handleShowLogoutDialog}>
                <IonIcon aria-hidden='true' icon={logOutOutline} slot='start' ></IonIcon>
                <IonLabel color='danger'>Log Out</IonLabel>
              </IonItem>
              :
              <></>
          }
        </IonList>
        {context.humspotUser &&
          <IonFab vertical='bottom' horizontal='center' style={{ paddingBottom: "15px" }}>
            <IonCardTitle style={{ fontSize: '0.8rem', fontWeight: '500', textAlign: 'center' }}>Logged in as:<div style={{ padding: '1px' }}></div> <span style={{ fontSize: '1rem', color: 'var(--ion-color-primary)' }}>{context.humspotUser.email}</span></IonCardTitle>
          </IonFab>
        }
      </IonContent>
    </IonModal >
  )
};

export default ProfileSettingsModal;