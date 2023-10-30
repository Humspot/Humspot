/**
 * @file Profile.tsx
 * @fileoverview The Profile page (4th tab) that displays information about the current user.
 * If not logged in, it will prompt the user to do so.
 */

import { IonPage, useIonRouter, useIonViewWillEnter } from "@ionic/react";

import { useEffect } from "react";
import { useContext } from "../utils/my-context";
import { timeout } from "../utils/timeout";

import ProfileBio from "../components/Profile/ProfileBio";
import ProfileSegments from "../components/Profile/ProfileSegments";
import ProfileHeader from "../components/Profile/ProfileHeader";
import ProfileSettingsModal from "../components/Profile/ProfileSettingsModal";
import ProfileAddActivityModal from "../components/Profile/ProfileAddActivityModal";
import ProfileEditModal from "../components/Profile/ProfileEditModal";

const Profile: React.FC = () => {

  const context = useContext();
  const router = useIonRouter();

  useEffect(() => {
    if (context.humspotUser === undefined) { // not logged in
      timeout(750).then(() => {
        router.push("/sign-up");
      })
    }
  }, [context.humspotUser]);

  useIonViewWillEnter(() => {
    context.setShowTabs(true);
  })

  return (
    <>
      <IonPage>

        {/* Add, Edit, and Settings button */}
        <ProfileHeader />

        {/* Top Bio */}
        <ProfileBio />

        {/* Middle Segmented Area */}
        <ProfileSegments />

        {/* Modal that pops in at the bottom of the page where a user can request to submit events/attractions */}
        <ProfileAddActivityModal />

        {/* Modal that pops in at the bottom of the page where a user can edit their profile */}
        <ProfileEditModal />

        {/* Modal that pops in at the bottom of the page where users can tinker with app settings */}
        <ProfileSettingsModal />

      </IonPage>
    </>
  );
}

export default Profile;
