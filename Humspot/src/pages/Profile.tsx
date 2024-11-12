/**
 * @file Profile.tsx
 * @fileoverview The Profile page (4th tab) that displays information about the current user.
 * If not logged in, it will prompt the user to do so.
 * @see /src/components/Profile for the components / CSS used on this page.
 */

import { IonContent, IonPage, useIonViewDidEnter, useIonViewWillEnter } from "@ionic/react";

import { memo, useRef } from "react";
import useContext from "../utils/hooks/useContext";

import ProfileBio from "../components/Profile/ProfileBio";
import ProfileSegments from "../components/Profile/ProfileSegments";
import ProfileHeader from "../components/Profile/ProfileHeader";
import ProfileSettingsModal from "../components/Profile/ProfileSettingsModal";
import ProfileEditModal from "../components/Profile/ProfileEditModal";

const Profile: React.FC = () => {

  const context = useContext();

  const page = useRef();

  useIonViewDidEnter(() => {
    context.setShowTabs(true);
  }, []);

  useIonViewWillEnter(() => {
    if (page && page.current) {
      context.setCurrentPage(page.current);
    }
  }, [page]);

  return (
    <>
      <IonPage ref={page}>

        {/* Edit, and Settings button */}
        <ProfileHeader user={context.newHumspotUser} blocked={false} backButton={false} buttons={true} shareButton={false} />

        <IonContent scrollY={false}>
          <ProfileBio user={context.newHumspotUser} blocked={false} />
          <ProfileSegments user={context.newHumspotUser} submissions={false} />
        </IonContent>

        {/* Modal where users can edit their profile */}
        <ProfileEditModal page={page.current} />

        {/* Modal where users can tinker with app settings */}
        <ProfileSettingsModal page={page.current} />

      </IonPage>
    </>
  );
}

export default memo(Profile);
