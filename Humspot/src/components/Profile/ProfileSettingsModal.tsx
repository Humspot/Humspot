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

import { useContext } from "../../utils/my-context";
import { handleGoogleLoginAndVerifyAWSUser, handleLogout } from "../../utils/server";
import { Capacitor } from "@capacitor/core";
import { Keyboard, KeyboardStyle, KeyboardStyleOptions } from "@capacitor/keyboard";
import { Preferences } from "@capacitor/preferences";
import { StatusBar, Style } from "@capacitor/status-bar";

const keyStyleOptionsDark: KeyboardStyleOptions = {
  style: KeyboardStyle.Dark
};
const keyStyleOptionsLight: KeyboardStyleOptions = {
  style: KeyboardStyle.Light
};
type ProfileSettingsModalProps = {
  page: HTMLElement | undefined;
};

async function canDismiss(data?: any, role?: string) {
  return role !== 'gesture';
};

const ProfileSettingsModal: React.FC<ProfileSettingsModalProps> = (props) => {

  const context = useContext();
  const router = useIonRouter();

  const modalRef = useRef<HTMLIonModalElement | null>(null);

  const toggleDarkMode = async (isChecked: boolean) => {
    if (isChecked) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
    context.setDarkMode(isChecked);
    await Preferences.set({ key: "darkMode", value: JSON.stringify(isChecked) });
  }

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

  const clickOnLogout = async () => {
    const { value } = await Dialog.confirm({
      title: 'Logout',
      message: `Are you sure you want to logout?`,
      okButtonTitle: 'Logout'
    });
    if (!value) { return; }
    await handleLogout();
  };

  const [presentingElement, setPresentingElement] = useState<HTMLElement | undefined>(undefined);

  useEffect(() => {
    setPresentingElement(props.page);
  }, [props.page]);


  return (
    <IonModal ref={modalRef} trigger="open-profile-page-modal" presentingElement={presentingElement} canDismiss={canDismiss}>
      <IonContent style={{ '--background': 'var(--ion-item-background' }}>
        <IonHeader className='ion-no-border'>
          <IonToolbar style={{ '--background': 'var(--ion-item-background' }}>
            <IonTitle style={{ fontSize: "1.25rem" }}>Settings</IonTitle>
            <IonButtons style={{ height: "5vh" }}>
              <IonButton style={{ fontSize: '1.15em', }} onClick={() => { modalRef.current?.dismiss(); }}>
                <p>Close</p>
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <br />
        <IonTitle className='ion-text-center' style={{ padding: "5%", fontSize: "1.5rem" }}>Settings</IonTitle>
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
              <IonItem role='button' onClick={() => { modalRef?.current?.dismiss(); router.push("/admin-dashboard") }}>
                <IonIcon aria-hidden="true" icon={constructOutline} slot="start" color='medium'></IonIcon>
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
        {/* <p className='ion-text-center'>v.1.0.0 - Humspot</p> */}
      </IonContent>
    </IonModal >
  )
};

export default ProfileSettingsModal;