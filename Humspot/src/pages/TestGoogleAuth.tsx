import { IonButton, IonCard, IonCardContent, IonContent, IonPage, useIonLoading } from "@ionic/react";
import { handleAddEvent, handleGetEventGivenTag, handleGoogleLoginAndVerifyAWSUser, handleLogout } from "../server";
import { useContext } from "../my-context";
import { HumspotEvent } from "../types";

const dummyEvent: HumspotEvent = {
  name: "Sample Event",
  description: "This is a sample description for the dummy event. It's going to be a fun time with various activities.",
  location: "1 Harpst St, Arcata, CA 95521",
  addedByUserID: "5e2e096461e516972e0b1ac2",
  date: "2023-11-30",
  time: "18:30",
  latitude: 40.868700737622106,
  longitude: -124.08785508438247,
  organizer: "Sample Organizer Name",
  tags: ["fun", "sample", "activities"],
};


const TestGoogleAuth: React.FC = () => {

  const context = useContext();

  const [present, dismiss] = useIonLoading();

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


            </IonCardContent>
          </IonCard>
        </IonContent>
      </IonPage>
    </>
  )
};

export default TestGoogleAuth;