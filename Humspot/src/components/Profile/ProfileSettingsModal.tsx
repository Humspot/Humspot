import { IonModal, IonList, IonItem, IonIcon, IonLabel, IonToggle, IonAlert, IonButton, IonCardTitle, IonFooter, IonContent, IonTitle } from "@ionic/react";
import { notificationsOutline, moonOutline, logOutOutline, settingsOutline } from "ionicons/icons";
import { useContext } from "../../utils/my-context";
import { handleLogout } from "../../utils/server";
import { Dialog } from "@capacitor/dialog";

const ProfileSettingsModal = () => {

  const context = useContext();

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
    <IonModal trigger="open-profile-page-modal" handle breakpoints={[0, 0.55, 0.99]} initialBreakpoint={0.55}>
      <IonContent style={{'--background' : 'var(--ion-item-background'}}>
        <br />
        <IonTitle className='ion-text-center' style={{ padding: "5%", fontSize: "1.5rem" }}>Settings</IonTitle>
        <IonList lines='full'>
          <IonItem style={{}}>
            <IonIcon aria-hidden="true" icon={notificationsOutline} slot="start"></IonIcon>
            <IonLabel><IonToggle>Notifications </IonToggle></IonLabel>
          </IonItem>
          <br />
          <IonItem>
            <IonIcon aria-hidden="true" icon={moonOutline} slot="start"></IonIcon>
            <IonLabel><IonToggle checked={context.darkMode}>Dark Mode</IonToggle></IonLabel>
          </IonItem>
          <br />
          <IonItem>
            <IonIcon aria-hidden="true" icon={settingsOutline} slot="start"></IonIcon>
            <IonLabel>More Settings...</IonLabel>
          </IonItem>
          <br />
          <IonItem role='button' id="modal-logout-button">
            <IonIcon aria-hidden="true" icon={logOutOutline} slot="start"></IonIcon>
            <IonLabel color='danger'>Log Out</IonLabel>
          </IonItem>
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
        <IonCardTitle style={{ padding: "10%" }} className='ion-text-center'>v.1.0.0 - Humspot</IonCardTitle>
      </IonContent>
    </IonModal>
  )
};

export default ProfileSettingsModal;