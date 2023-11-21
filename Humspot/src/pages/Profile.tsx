/**
 * @file Profile.tsx
 * @fileoverview The Profile page (4th tab) that displays information about the current user.
 * If not logged in, it will prompt the user to do so.
 */

import { IonPage, useIonRouter, useIonViewWillEnter } from "@ionic/react";

import { memo, useEffect } from "react";
import { useContext } from "../utils/my-context";
import { timeout } from "../utils/timeout";

import ProfileBio from "../components/Profile/ProfileBio";
import ProfileSegments from "../components/Profile/ProfileSegments";
import ProfileHeader from "../components/Profile/ProfileHeader";
import ProfileSettingsModal from "../components/Profile/ProfileSettingsModal";
import ProfileAddActivityModal from "../components/Profile/ProfileActivitiesModal";
import ProfileEditModal from "../components/Profile/ProfileEditModal";
import { navigateBack } from "../components/Shared/BackButtonNavigation";

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
  }, []);

  useEffect(() => {
    const eventListener: any = (ev: CustomEvent<any>) => {
      ev.detail.register(10, () => {
        navigateBack(router);
      });
    };

    document.addEventListener('ionBackButton', eventListener);

    return () => {
      document.removeEventListener('ionBackButton', eventListener);
    };
  }, [router]);

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

export default memo(Profile);
