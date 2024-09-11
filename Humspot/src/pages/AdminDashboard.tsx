

import { IonPage, IonContent, useIonViewWillEnter } from "@ionic/react";
import useContext from '../utils/hooks/useContext';
import AdminSegments from "../components/Admin/AdminSegments";
import GoBackHeader from "../components/Shared/GoBackHeader";
import { useRef } from "react";


const AdminDashboard = () => {
  const context = useContext();

  const pageRef = useRef(null);

  useIonViewWillEnter(() => {
    context.setShowTabs(false);
    if (pageRef && pageRef.current) {
      context.setCurrentPage(pageRef.current);
    }
  }, [pageRef]);

  return (
    <IonPage ref={pageRef}>
      {context.humspotUser?.accountType == 'admin' &&
        <>
          <GoBackHeader translucent={true} title={"Admin Dashboard"} />
          <IonContent scrollY={false}>
            <AdminSegments />
          </IonContent>
        </>
      }

    </IonPage>
  )
}

export default AdminDashboard;