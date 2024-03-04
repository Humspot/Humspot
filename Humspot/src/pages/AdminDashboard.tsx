

import { useIonViewDidEnter, IonPage, IonContent } from "@ionic/react";
import useContext from '../utils/hooks/useContext';
import AdminSegments from "../components/Admin/AdminSegments";
import GoBackHeader from "../components/Shared/GoBackHeader";


const AdminDashboard = () => {
  const context = useContext();

  useIonViewDidEnter(() => {
    context.setShowTabs(false);
  }, []);

  return (
    <IonPage>
      {context.humspotUser?.accountType == 'admin' &&
        <>
          <GoBackHeader translucent={true} title={"Admin - " + context.humspotUser.username} />
          <div style={{ height: "10px" }} />
          <AdminSegments />
        </>
      }

    </IonPage>
  )
}

export default AdminDashboard;