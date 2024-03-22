
import { IonContent, IonPage, useIonViewDidEnter, useIonViewWillEnter } from "@ionic/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import useContext from "../utils/hooks/useContext";
import { handleGetUserInfo } from "../utils/server";
import ProfileBio from "../components/Profile/ProfileBio";
import { HumspotUser } from "../utils/types";
import ProfileHeader from "../components/Profile/ProfileHeader";
import ProfileSegments from "../components/Profile/ProfileSegments";

type UserPageParams = {
  uid: string;
};

const User: React.FC<{}> = () => {
  const params = useParams<UserPageParams>();
  const uid: string = params.uid;

  const pageRef = useRef(null);
  const context = useContext();

  const [user, setUser] = useState<HumspotUser | null>(null);

  useIonViewWillEnter(() => {
    if (pageRef && pageRef.current) {
      context.setCurrentPage(pageRef.current);
    }
  }, [pageRef]);

  const fetchUserInfo = useCallback(async (uid: string) => {
    const res = await handleGetUserInfo(uid);
    if (res.success) {
      setUser(res.info);
    }
  }, []);

  useEffect(() => {
    if (uid) {
      fetchUserInfo(uid);
    }
  }, [uid, fetchUserInfo]);

  return (
    <IonPage ref={pageRef}>

      <ProfileHeader user={user} backButton={true} buttons={false} />

      <IonContent scrollY={false}>
        <ProfileBio user={user} />
        <ProfileSegments user={user} />
      </IonContent>

    </IonPage>
  )

};

export default User;