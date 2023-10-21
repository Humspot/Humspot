import { IonToolbar, IonButtons, IonButton, useIonRouter, IonIcon } from "@ionic/react";
import { addOutline, settingsOutline } from "ionicons/icons";
import { useContext } from "../../utils/my-context";


const ProfileHeader: React.FC = () => {

  const context = useContext();
  const router = useIonRouter();

  return (
    <>
      <IonButton
        className='profile-header-button'
        color="primary"
        fill="clear"
        id="open-profile-page-modal"
        disabled={!context.humspotUser}
      >
        <IonIcon style={{ padding: "15%" }} size='large' icon={settingsOutline} />
      </IonButton>
    </>
  )
};

export default ProfileHeader;