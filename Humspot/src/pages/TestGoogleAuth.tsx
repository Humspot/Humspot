import { IonButton, IonCard, IonCardContent, IonContent, IonPage, useIonLoading } from "@ionic/react";
import { handleAddEvent, handleAddImages, handleAddToFavorites, handleGetEventGivenTag, handleGoogleLoginAndVerifyAWSUser, handleLogout } from "../server";
import { useContext } from "../my-context";
import { HumspotEvent } from "../types";

const dummyEvent: HumspotEvent = {
  name: "THIS IS A TEST",
  description: "This is a sample description for the dummy event. It's going to be a fun time with various activities.",
  location: "1111 Harpst St, Arcata, CA 95521",
  addedByUserID: "5e2e096461e516972e0b1ac2",
  date: "2023-10-30",
  time: "15:30",
  latitude: 39.868700737622106,
  longitude: -124.08785508438247,
  organizer: "admin",
  tags: ["test"],
  photoUrls: []
};


const TestGoogleAuth: React.FC = () => {

  const context = useContext();

  const [present, dismiss] = useIonLoading();

  const handleTestFavorite = async (activityID: string) => {
    const userID: string = context.humspotUser.userID;
    const res = handleAddToFavorites(userID, activityID);
  }

  const handleTestImages = async () => {
    const photoUrls: string[] = await handleAddImages(context.humspotUser.userID);
    if(photoUrls.length < 0) {
      console.log("Something went wrong when uploading photos!");
    }

    dummyEvent.photoUrls = photoUrls;
    const res = await handleAddEvent(dummyEvent);
    console.log(res);

  }

  /**
   * @description runs when the user clicks the login button. It ensures the user is not already logged in.
   * If not, it calls handleGoogleLoginAndVerifyAWSUser and caches authentication credentials accordingly.
   */
  const handleLogin = async () => {
    if (context.humspotUser.email) return; // if user is already logged in
    present({ duration: 0, message: "Logging in..." });
    await handleGoogleLoginAndVerifyAWSUser();
    dismiss();
  };

  return (
    <>
      <IonPage>
        <IonContent>
          <IonCard>
            <IonCardContent>
              {context.humspotUser.email ?
                <>
                  <p>Currently logged in as: {JSON.stringify(context.humspotUser)}</p>
                  <IonButton color='dark' onClick={async () => await handleLogout()}>Logout</IonButton>

                </>
                :
                <>
                  <p>Currently a Guest User</p>
                  <IonButton color='dark' onClick={async () => await handleLogin()}>Login</IonButton>
                </>
              }

              <IonButton color='dark' disabled onClick={async () => await handleAddEvent(dummyEvent)}>TEST SUBMIT EVENT (Change Dummy Event Variable)</IonButton>
              <IonButton color='dark' onClick={async () => await handleGetEventGivenTag(1, "fun")}>TEST GET EVENTS GIVEN TAG</IonButton>

              <IonButton color='dark' onClick={async () => handleTestImages()}>Test Image Upload</IonButton>

              <IonButton color='dark' onClick={async () => await handleTestFavorite('59c7351a86b71e1b8c6693a0d')}>Test Favorite ActivityID: 59c7351a86b71e1b8c6693a0d</IonButton>

            </IonCardContent>
          </IonCard>
        </IonContent>
      </IonPage>
    </>
  )
};

export default TestGoogleAuth;