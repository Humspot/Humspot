import { IonModal, IonList, IonItem, IonIcon, IonLabel, IonToggle, IonAlert, IonContent, IonTitle, useIonRouter } from "@ionic/react";
import { notificationsOutline, moonOutline, logOutOutline, mailOutline, shieldOutline, readerOutline, logInOutline } from "ionicons/icons";
import { useContext } from "../../utils/my-context";
import { handleGoogleLoginAndVerifyAWSUser, handleLogout } from "../../utils/server";
import { Dialog } from "@capacitor/dialog";
import { useRef } from "react";

const ProfileSettingsModal = () => {

  const context = useContext();
  const router = useIonRouter();

  const modalRef = useRef<HTMLIonModalElement | null>(null);

  const logout = async () => {
    // USE DIALOG WHEN PORTING TO iOS and MD
    // const { value } = await Dialog.confirm({
    //   title: 'Logout',
    //   message: `Are you sure you want to logout?`,
    //   okButtonTitle: 'Logout'
    // });
    // if (!value) { return; }
    // await handleLogout();

  };


  return (
    <IonModal ref={modalRef} trigger="open-profile-page-modal" handle breakpoints={[0, 0.8, 0.99]} initialBreakpoint={0.8}>
      <IonContent style={{ '--background': 'var(--ion-item-background' }}>
        <br />
        <IonTitle className='ion-text-center' style={{ padding: "5%", fontSize: "1.5rem" }}>Settings</IonTitle>
        <IonList lines='full'>
          <IonItem disabled={!context.humspotUser} style={{}}>
            <IonIcon aria-hidden="true" icon={notificationsOutline} slot="start"></IonIcon>
            <IonLabel><IonToggle disabled={!context.humspotUser}>Notifications </IonToggle></IonLabel>
          </IonItem>
          <br />
          <IonItem>
            <IonIcon aria-hidden="true" icon={moonOutline} slot="start"></IonIcon>
            <IonLabel><IonToggle checked={context.darkMode} onIonChange={(e) => { }}>Dark Mode</IonToggle></IonLabel>
          </IonItem>
          <br />
          <IonItem onClick={() => { modalRef?.current?.dismiss(); router.push("/contact-us") }}>
            <IonIcon aria-hidden="true" icon={mailOutline} slot="start"></IonIcon>
            <IonLabel color='primary'>Contact Us</IonLabel>
          </IonItem>
          <br />
          <IonItem onClick={() => { modalRef?.current?.dismiss(); router.push("/privacy-policy") }}>
            <IonIcon aria-hidden="true" icon={shieldOutline} slot="start"></IonIcon>
            <IonLabel color='primary'>Privacy Policy</IonLabel>
          </IonItem>
          <br />
          <IonItem onClick={() => { modalRef?.current?.dismiss(); router.push("/terms-and-conditions") }}>
            <IonIcon aria-hidden="true" icon={readerOutline} slot="start"></IonIcon>
            <IonLabel color='primary'>Terms and Conditions</IonLabel>
          </IonItem>
          <br />
          {context.humspotUser === undefined ?
            <>
              <IonItem role='button' onClick={() => { modalRef?.current?.dismiss(); router.push("/sign-up") }}>
                <IonIcon aria-hidden="true" icon={logInOutline} slot="start"></IonIcon>
                <IonLabel color='primary'>Sign Up / Sign In</IonLabel>
              </IonItem>
              <br />
              <IonItem role='button' onClick={async () => { modalRef?.current?.dismiss(); await handleGoogleLoginAndVerifyAWSUser() }}>
                <IonIcon aria-hidden="true" icon={logOutOutline} slot="start"></IonIcon>
                <IonLabel color='primary'>Google Sign In</IonLabel>
              </IonItem>
            </>
            :
            <IonItem role='button' id="modal-logout-button">
              <IonIcon aria-hidden="true" icon={logOutOutline} slot="start"></IonIcon>
              <IonLabel color='danger'>Log Out</IonLabel>
            </IonItem>
          }

          <br />

          <IonAlert
            header="Are you sure you want to log out?"
            trigger="modal-logout-button"
            buttons={[
              {
                text: "Cancel",
                role: "cancel",
                handler: () => {
                  console.log("Alert canceled");
                },
              },
              {
                text: "Log Out",
                role: "confirm",
                handler: async () => {
                  await handleLogout();
                },
              },
            ]}
            onDidDismiss={({ detail }) =>
              console.log(`Dismissed with role: ${detail.role}`)
            }
          />
        </IonList>
        <p className='ion-text-center'>v.1.0.0 - Humspot</p>
      </IonContent>
    </IonModal>
  )
};

export default ProfileSettingsModal;