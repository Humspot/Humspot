import { IonButton, IonCard, IonCardContent, IonContent, IonPage, useIonLoading } from "@ionic/react";
import { handleAWSLogout, handleGoogleLoginAndVerifyAWSUser, handleGoogleLogout } from "../server";
import { guestUser, useContext } from "../my-context";
import { Preferences } from "@capacitor/preferences";


const TestGoogleAuth: React.FC = () => {

  const context = useContext();

  const [present, dismiss] = useIonLoading();

  /**
   * @description runs when the user clicks the login button.
   * It ensures the user is not already logged in.
   * If not, it calls handleGoogleLoginAndVerifyAWSUser
   * and caches authentication credentials accordingly.
   */
  const handleLogin = async () => {
    if (context.humspotUser.loggedIn) return; // if user is already logged in
    present({
      duration: 0,
      message: "Logging in..."
    });
    const { success, user } = await handleGoogleLoginAndVerifyAWSUser();
    if (success && user) {
      await Preferences.set({ key: 'humspotUser', value: JSON.stringify(user) })
      context.setHumspotUser(user);
    } else {
      console.log("Login failed.");
    }
    dismiss();
  };

  /**
   * @description runs when the user clicks the logout button.
   * It calls handleGoogleLogout and handleAWSLogout and removes the cached auth credentials.
   */
  const handleLogout = async () => {
    present({
      duration: 0,
      message: "Logging out..."
    });
    await handleGoogleLogout();
    await handleAWSLogout();
    context.setHumspotUser(guestUser);
    sessionStorage.clear();
    localStorage.clear();
    dismiss();
    window.location.reload();
  }

  return (
    <>
      <IonPage>
        <IonContent>
          <IonCard>
            <IonCardContent>
              {context.humspotUser.loggedIn ?
                <>
                  <p>User logged in! User info: {JSON.stringify(context.humspotUser)}</p>
                  <IonButton onClick={async () => await handleLogout()}>Logout</IonButton>
                </>
                :
                <>
                  <p>Guest User</p>
                  <IonButton onClick={async () => await handleLogin()}>Login</IonButton>
                </>
              }
            </IonCardContent>
          </IonCard>
        </IonContent>
      </IonPage>
    </>
  )
};

export default TestGoogleAuth;