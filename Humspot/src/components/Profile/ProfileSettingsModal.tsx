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
  useIonAlert,
  useIonToast
} from '@ionic/react';
import {
  moonOutline,
  logOutOutline,
  mailOutline,
  shieldOutline,
  readerOutline,
  logInOutline,
  constructOutline,
  logoGoogle,
  closeCircleOutline,
  logoApple,
  moon
} from 'ionicons/icons';
import { Preferences } from '@capacitor/preferences';

import useContext from '../../utils/hooks/useContext';
import { handleAppleLoginAndVerifyAWSUser, handleDeleteAccount, handleGoogleLoginAndVerifyAWSUser, handleLogout } from '../../utils/server';

import './Profile.css';
import { Keyboard, KeyboardStyleOptions, KeyboardStyle } from '@capacitor/keyboard';
import { StatusBar, Style } from '@capacitor/status-bar';
import { timeout } from '../../utils/functions/timeout';

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
  const [presentAlert, dismissAlert] = useIonAlert();
  const [presentToast] = useIonToast();

  const modalRef = useRef<HTMLIonModalElement | null>(null);
  const [presentingElement, setPresentingElement] = useState<HTMLElement | undefined>(undefined);

  /**
   * @description updates the dark mode values in context and Capacitor Preferences (localStorage).
   * The document body class list, status bar, and keyboard styles are updated to reflect 
   * the selection between light and dark mode.
   * 
   * @param {boolean} isChecked whether the toggle was enabled or disabled by the user.
   */
  const toggleDarkMode = async (isChecked: boolean): Promise<void> => {
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
  };

  /**
   * @description runs when users click on the logout button on the alert dialog.
   * Presents a loading indicator during the duration of the logout using useIonLoading.
   * @see handleLogout
   */
  const clickOnLogout = async (): Promise<void> => {
    await present({ message: 'Logging Out...' })
    await handleLogout();
    await dismiss();
  };

  const clickOnDeleteAccount = async (userID: string): Promise<void> => {
    await present({ message: 'Deleting account...' });
    const res = await handleDeleteAccount(userID);
    if (res.success) {
      await handleLogout();
      await presentToast({ message: res.message, color: 'secondary' });
    } else {
      await presentToast({ message: res.message, color: 'danger' });
    }
    await dismiss();
  };

  /**
   * @description runs when users click on the logout button.
   * It displays an alert dialog where users can cancel or confirm logout.
   */
  const handleShowLogoutDialog = async () => {
    await presentAlert({
      cssClass: 'ion-alert-logout',
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
            handler: async () => {
              await clickOnLogout();
            },
          },
        ]
    })
  };

  const handleShowSecondDeleteAccountDialog = async () => {
    console.log('Show second delete account dialog');
    await presentAlert({
      cssClass: 'ion-alert-logout',
      header: 'Delete Account',
      message: 'Are you REALLY sure you want to delete your account?',
      buttons:
        [
          {
            text: 'Cancel',
            role: 'cancel',
            cssClass: 'alert-cancel-button',
          },
          {
            cssClass: 'alert-cancel-button',
            text: 'I\'m sure, delete my account',
            handler: async () => {
              if (!context.humspotUser) return;
              await clickOnDeleteAccount(context.humspotUser.userID);
            },
          },
        ]
    })
  }

  const handleShowDeleteAccountDialog = async () => {
    await presentAlert({
      cssClass: 'ion-alert-logout',
      header: 'Delete Humspot Account',
      message: 'Are you sure you want to delete your account?',
      buttons:
        [
          {
            text: 'Cancel',
            role: 'cancel',
            cssClass: 'alert-cancel-button',
          },
          {
            cssClass: 'alert-cancel-button',
            text: 'Delete my Account',
            handler: async () => {
              console.log('Delete my Account');
              await dismissAlert();
              await handleShowSecondDeleteAccountDialog();
            }
          },
        ]
    })
  };

  /**
   * @description runs when the modal dismisses. This function fixes an issue with dark mode styles
   * incorrectly applying when the modal is opened.
   */
  const handleStatusBarUpdate = async () => {
    if (context.darkMode) {
      await StatusBar.setStyle({ style: Style.Dark });
    } else {
      await StatusBar.setStyle({ style: Style.Light });
    }
  };

  useEffect(() => {
    setPresentingElement(props.page);
  }, [props.page]);

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
            <IonButtons slot='end'>
              <IonButton slot='end' className='profile-modal-close-button' onClick={() => toggleDarkMode(!context.darkMode)}>
                <IonIcon icon={context.darkMode ? moon : moonOutline}></IonIcon>
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>

        {/* <br /> */}

        <IonList lines='full'>
          {context.humspotUser === undefined &&
            <>
              <IonItem style={{ marginTop: '10px', marginBottom: '10px' }} role='button' onClick={async () => { modalRef?.current?.dismiss().then(async () => { context.setShowTabs(false); await timeout(250); router.push('/sign-up') }) }}>
                <IonIcon aria-hidden='true' icon={mailOutline} slot='start' ></IonIcon>
                <IonLabel>Sign In with Email</IonLabel>
              </IonItem>
              <IonItem style={{ marginTop: '10px', marginBottom: '10px' }} role='button' onClick={async () => { modalRef?.current?.dismiss(); router.push('/explore', 'root', 'replace'); await handleGoogleLoginAndVerifyAWSUser() }}>
                <IonIcon aria-hidden='true' icon={logoGoogle} slot='start' ></IonIcon>
                <IonLabel>Sign In with Google</IonLabel>
              </IonItem>
              <IonItem style={{ marginTop: '10px', marginBottom: '10px' }} role='button' onClick={async () => { modalRef?.current?.dismiss(); router.push('/explore', 'root', 'replace'); await handleAppleLoginAndVerifyAWSUser() }}>
                <IonIcon aria-hidden='true' icon={logoApple} slot='start' ></IonIcon>
                <IonLabel>Sign In with Apple</IonLabel>
              </IonItem>
              <br />
            </>
          }
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
              {/* <p style={{fontSize: "1.25rem", textAlign: 'center', fontWeight: '1000'}}>Account</p>
              <IonItem style={{ marginTop: '10px', marginBottom: '10px' }} role='button' onClick={async () => { modalRef?.current?.dismiss().then(async () => { context.setShowTabs(false); await timeout(250); router.push('/sign-up') }) }}>
                <IonIcon aria-hidden='true' icon={mailOutline} slot='start' ></IonIcon>
                <IonLabel>Sign In with Email</IonLabel>
              </IonItem>
              <IonItem style={{ marginTop: '10px', marginBottom: '10px' }} role='button' onClick={async () => { modalRef?.current?.dismiss(); router.push('/explore', 'root', 'replace'); await handleGoogleLoginAndVerifyAWSUser() }}>
                <IonIcon aria-hidden='true' icon={logoGoogle} slot='start' ></IonIcon>
                <IonLabel>Sign In with Google</IonLabel>
              </IonItem>
              <IonItem style={{ marginTop: '10px', marginBottom: '10px' }} role='button' onClick={async () => { modalRef?.current?.dismiss(); router.push('/explore', 'root', 'replace'); await handleAppleLoginAndVerifyAWSUser() }}>
                <IonIcon aria-hidden='true' icon={logoApple} slot='start' ></IonIcon>
                <IonLabel>Sign In with Apple</IonLabel>
              </IonItem> */}
            </>
            : context.humspotUser ?
              <>
                <IonItem style={{ marginTop: '10px', marginBottom: '10px' }} role='button' onClick={handleShowLogoutDialog}>
                  <IonIcon aria-hidden='true' icon={logOutOutline} slot='start' ></IonIcon>
                  <IonLabel color='danger'>Log Out</IonLabel>
                </IonItem>
                <IonItem style={{ marginTop: '10px', marginBottom: '10px' }} role='button' onClick={handleShowDeleteAccountDialog}>
                  <IonIcon aria-hidden='true' icon={closeCircleOutline} slot='start' ></IonIcon>
                  <IonLabel color='danger'>Delete Account</IonLabel>
                </IonItem>
              </>
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