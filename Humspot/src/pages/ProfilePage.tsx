import { IonPage } from "@ionic/react";

import ProfileBio from "../components/Profile/ProfileBio";
import ProfileSegments from "../components/Profile/ProfileSegments";
import ProfileHeader from "../components/Profile/ProfileHeader";
import ProfileSettingsModal from "../components/Profile/ProfileSettingsModal";
import ProfileLoginModal from "../components/Profile/ProfileLoginModal";
import ProfileAddActivityModal from "../components/Profile/ProfileAddActivityModal";
import ProfileEditModal from "../components/Profile/ProfileEditModal";

function ProfilePage() {

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

        {/* Modal that prompts the user to login (if not already logged in) */}
        <ProfileLoginModal />

      </IonPage>
    </>
  );
}

export default ProfilePage;
