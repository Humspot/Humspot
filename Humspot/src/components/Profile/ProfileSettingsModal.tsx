/**
 * @file ProfileSettingsModal.tsx
 * @fileoverview the modal component that displays when clicking on the settings icon on the Profile page.
 * The modal contains several settings, like Notifications, Dark Mode, etc.
 */

import { useEffect, useRef } from 'react';
import {
  IonModal,
  IonList,
  IonItem,
  IonIcon,
  IonLabel,
  IonToggle,
  IonContent,
  useIonRouter,
  IonHeader,
  IonToolbar,
  IonButton,
  IonButtons,
  useIonLoading,
  IonFab,
  IonCardTitle,
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
  logoGoogle,
  chevronBackOutline,
  moon
} from 'ionicons/icons';
import { Preferences } from '@capacitor/preferences';

import { useContext } from '../../utils/hooks/useContext';
import { handleGoogleLoginAndVerifyAWSUser, handleLogout } from '../../utils/server';

import './Profile.css';
import { Keyboard, KeyboardStyleOptions, KeyboardStyle } from '@capacitor/keyboard';
import { StatusBar, Style } from '@capacitor/status-bar';
import { NavigationBar } from '@hugotomazi/capacitor-navigation-bar';
import useIonBackButton from '../../utils/hooks/useIonBackButton';

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
  useIonBackButton(20, async () => { await modalRef.current?.dismiss(); }, [modalRef]);

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
      await StatusBar.setBackgroundColor({ color: '#121212' })
      await NavigationBar.setColor({ color: '#1f1f1f' });
      await Keyboard.setStyle(keyStyleOptionsDark);
    } else {
      document.body.classList.remove('dark');
      await StatusBar.setStyle({ style: Style.Light });
      await StatusBar.setBackgroundColor({ color: '#f5fff7' });
      await NavigationBar.setColor({ color: '#edf2ed' });
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

  /**
   * @description runs when users click on the logout button.
   * It displays an alert dialog where users can cancel or confirm logout.
   */
  const handleShowLogoutDialog = async () => {
    presentAlert({
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

  const handleStatusBarUpdate = async () => {
    if (context.darkMode) {
      await StatusBar.setStyle({ style: Style.Dark });
      await StatusBar.setBackgroundColor({ color: '#121212' })
      await NavigationBar.setColor({ color: '#1f1f1f' });
    } else {
      await StatusBar.setStyle({ style: Style.Light });
      await StatusBar.setBackgroundColor({ color: '#f5fff7' })
      await NavigationBar.setColor({ color: '#edf2ed' });
    }
  };

  return (
    <IonModal ref={modalRef} trigger='open-profile-page-modal'>
      <IonContent className='profile-modal-content' scrollY={false}>
        <IonHeader className='ion-no-border'>
          <IonToolbar className='profile-modal-toolbar'>
            <IonButtons>
              <IonButton style={{ fontSize: '1.15em', marginRight: '15px' }} className='profile-modal-close-button' onClick={() => {
                modalRef.current?.dismiss().then(async () => { await handleStatusBarUpdate() })
              }}
              >
                <IonIcon color='primary' icon={chevronBackOutline} />
              </IonButton>
              <p style={{ fontSize: '1.25rem' }}>Settings</p>
            </IonButtons>
            <IonButtons slot='end'>
              <IonButton onClick={() => { toggleDarkMode(!context.darkMode) }}>
                <IonIcon color={'primary'} icon={context.darkMode ? moon : moonOutline} />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>

        <IonList lines='full'>
          {context.humspotUser === undefined &&
            <>
              <IonItem style={{ marginTop: '10px', marginBottom: '10px' }} role='button' onClick={() => { context.setShowTabs(false); modalRef?.current?.dismiss(); router.push('/sign-up') }}>
                <IonIcon aria-hidden='true' icon={mailOutline} style={{ marginRight: '15px' }} slot='start'></IonIcon>
                <IonLabel>Sign in with Email</IonLabel>
              </IonItem>
              <IonItem style={{ marginTop: '10px', marginBottom: '10px' }} role='button' onClick={async () => { modalRef?.current?.dismiss(); router.push('/explore', 'root', 'replace'); await handleGoogleLoginAndVerifyAWSUser() }}>
                <IonIcon aria-hidden='true' icon={logoGoogle} style={{ marginRight: '15px' }} slot='start'></IonIcon>
                <IonLabel>Sign In with Google</IonLabel>
              </IonItem>
              <br />
            </>
          }
          <IonItem style={{ marginTop: '10px', marginBottom: '10px' }} onClick={() => { modalRef?.current?.dismiss(); router.push('/contact-us') }}>
            <IonIcon aria-hidden='true' icon={mailOutline} style={{ marginRight: '15px' }} slot='start'></IonIcon>
            <IonLabel>Contact Us</IonLabel>
          </IonItem>
          <IonItem style={{ marginTop: '10px', marginBottom: '10px' }} onClick={() => { modalRef?.current?.dismiss(); router.push('/privacy-policy') }}>
            <IonIcon aria-hidden='true' icon={shieldOutline} style={{ marginRight: '15px' }} slot='start'></IonIcon>
            <IonLabel>Privacy Policy</IonLabel>
          </IonItem>
          <IonItem style={{ marginTop: '10px', marginBottom: '10px' }} onClick={() => { modalRef?.current?.dismiss(); router.push('/terms-and-conditions') }}>
            <IonIcon aria-hidden='true' icon={readerOutline} style={{ marginRight: '15px' }} slot='start'></IonIcon>
            <IonLabel>Terms and Conditions</IonLabel>
          </IonItem>
          {context.humspotUser?.accountType === 'admin' &&
            <>
              <IonItem style={{ marginTop: '10px', marginBottom: '10px' }} role='button' onClick={() => { modalRef?.current?.dismiss(); router.push('/admin-dashboard') }}>
                <IonIcon aria-hidden='true' icon={constructOutline} style={{ marginRight: '15px' }} slot='start'></IonIcon>
                <IonLabel>Admin Dashboard</IonLabel>
              </IonItem>
            </>
          }
          {
            context.humspotUser &&
            <IonItem style={{ marginTop: '10px', marginBottom: '10px' }} role='button' onClick={handleShowLogoutDialog}>
              <IonIcon aria-hidden='true' icon={logOutOutline} style={{ marginRight: '15px' }} slot='start'></IonIcon>
              <IonLabel color='danger'>Log Out</IonLabel>
            </IonItem>
          }
        </IonList>
        {context.humspotUser &&
          <IonFab vertical='bottom' horizontal='center' style={{ paddingBottom: '15px' }}>
            <IonCardTitle style={{ fontSize: '0.8rem', fontWeight: '500', textAlign: 'center' }}>Logged in as:<div style={{ padding: '1px' }}></div> <span style={{ fontSize: '1rem', color: 'var(--ion-color-primary)' }}>{context.humspotUser.email}</span></IonCardTitle>
          </IonFab>
        }
      </IonContent>
    </IonModal >
  )
};

export default ProfileSettingsModal;