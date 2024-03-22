
import { IonPage, useIonViewDidEnter, useIonViewWillEnter } from "@ionic/react";
import { useRef } from "react";
import { useParams } from "react-router-dom";
import useContext from "../utils/hooks/useContext";

type UserPageParams = {
  uid: string;
};

const User: React.FC<{}> = () => {
  const params = useParams<UserPageParams>();
  const uid: string = params.uid;

  const pageRef = useRef(null);
  const context = useContext();

  useIonViewDidEnter(() => {
    context.setShowTabs(true);
  }, []);

  useIonViewWillEnter(() => {
    if (pageRef && pageRef.current) {
      context.setCurrentPage(pageRef.current);
    }
  }, [pageRef]);

  return (
    <IonPage ref={pageRef}>

    </IonPage>
  )

};

export default User;