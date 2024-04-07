
import { IonContent, IonPage, useIonToast, useIonViewDidEnter, useIonViewWillEnter } from "@ionic/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import useContext from "../utils/hooks/useContext";
import { handleGetIsUserBlocked, handleGetUserInfo } from "../utils/server";
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
  const [presentToast] = useIonToast();

  const [user, setUser] = useState<HumspotUser | null | undefined>(null);

  useIonViewWillEnter(() => {
    if (pageRef && pageRef.current) {
      context.setCurrentPage(pageRef.current);
    }
  }, [pageRef]);

  const fetchUserInfo = useCallback(async (uid: string) => {
    if (context.humspotUser) {
      const { success, isUserBlocked } = await handleGetIsUserBlocked(context.humspotUser.userID, uid);
      if (!success) {
        presentToast({ message: "Something went wrong", duration: 2000, color: "danger" });
        return;
      }
      if (!isUserBlocked) {
        const res = await handleGetUserInfo(uid);
        if (res.success) {
          setUser(res.info);
        } else {
          presentToast({ message: "Something went wrong", color: "danger", duration: 2000 });
        }
        return;
      }
      setUser(undefined);
    }

  }, [context.humspotUser]);

  useEffect(() => {
    if (uid) {
      fetchUserInfo(uid);
    }
  }, [uid, fetchUserInfo]);

  return (
    <IonPage ref={pageRef}>

      <ProfileHeader user={user} buttons={false} backButton shareButton />

      <IonContent scrollY={false}>
        <ProfileBio user={user} />
        <ProfileSegments user={user} submissions={true} />
      </IonContent>

    </IonPage>
  )

};

export default User;