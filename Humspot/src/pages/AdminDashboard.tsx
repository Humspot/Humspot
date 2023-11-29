import { useIonRouter, useIonViewDidEnter, IonPage, IonContent, IonHeader, IonToolbar, IonCardTitle, IonSkeletonText, IonButton, IonButtons, IonIcon } from "@ionic/react";
import { useContext } from '../utils/my-context';
import AdminSegments from "../components/Admin/AdminSegments";
import { chevronBackOutline } from "ionicons/icons";
import GoBackHeader from "../components/Shared/GoBackHeader";
import { handleAddAttraction } from "../utils/server";
import { HumspotAttraction } from "../utils/types";


const AdminDashboard = () => {
  const context = useContext();
  const router = useIonRouter();

  useIonViewDidEnter(() => {
    context.setShowTabs(false);
  }, []);

  return (
    <IonPage>
      {context.humspotUser?.accountType == 'admin' &&
        <IonContent>
          <GoBackHeader title={"Admin - " + context.humspotUser.username} />
          <div style={{ height: "10px" }} />
          <AdminSegments />
        </IonContent>
      }

    </IonPage>
  )
}

export default AdminDashboard;