import { IonModal, IonList, IonItem, IonIcon, IonLabel, IonToggle, IonAlert, IonButton, IonCardTitle, IonFooter } from "@ionic/react";
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
    <IonModal style={{ "--background": "var(--ion-item-background)" }} trigger="open-profile-page-modal" handle breakpoints={[0, 0.45, 0.55]} initialBreakpoint={0.45}>
      <IonList lines='full'>
        <IonItem>
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
      <IonItem >
        <IonCardTitle className='ion-text-center'>v.1.0.0 - Humspot Dev Team</IonCardTitle>
      </IonItem>
    </IonModal>
  )
};

export default ProfileSettingsModal;