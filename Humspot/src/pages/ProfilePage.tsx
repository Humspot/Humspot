import {
  IonContent,
  IonPage,
  useIonToast,
} from "@ionic/react";

import ProfileBio from "../components/Profile/ProfileBio";
import ProfileSegments from "../components/Profile/ProfileSegments";
import ProfileHeader from "../components/Profile/ProfileHeader";
import ProfileSettingsModal from "../components/Profile/ProfileSettingsModal";
import ProfileLoginModal from "../components/Profile/ProfileLoginModal";
import { useEffect } from "react";
import { timeout } from "../utils/timeout";

function ProfilePage() {

  const [present] = useIonToast();

  // useEffect(() => {
  //   timeout(1000).then(() => {
  //     present({
  //       message: 'This is a test notification!',
  //       duration: 3500,
  //       position: 'top',
  //       buttons: [
  //         {
  //           text: 'Dismiss',
  //           role: 'cancel',
  //           handler: () => { }
  //         }
  //       ],
  //       // cssClass: 'toast-options',
  //     });
  //   })

  // }, []);

  return (
    <>
      <IonPage>
        <IonContent>

          {/* Settings button */}
          <ProfileHeader />

          {/* Top Bio */}
          <ProfileBio />

          {/* Middle Segmented Area */}
          <ProfileSegments />

          {/* Modal that pops in at the bottom of the page */}
          <ProfileSettingsModal />

          {/* Modal that prompts the user to login (if not already logged in) */}
          <ProfileLoginModal />

        </IonContent>
      </IonPage>
    </>
  );
}

export default ProfilePage;
