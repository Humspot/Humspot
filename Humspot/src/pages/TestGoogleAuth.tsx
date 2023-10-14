import { IonButton, IonCard, IonCardContent, IonContent, IonPage, useIonLoading } from "@ionic/react";
import { handleGoogleLoginAndVerifyAWSUser, handleLogout } from "../server";
import { useContext } from "../my-context";


const TestGoogleAuth: React.FC = () => {

  const context = useContext();

  const [present, dismiss] = useIonLoading();


  /**
   * @description runs when the user clicks the login button. It ensures the user is not already logged in.
   * If not, it calls handleGoogleLoginAndVerifyAWSUser and caches authentication credentials accordingly.
   */
  const handleLogin = async () => {
    if (context.humspotUser.loggedIn) return; // if user is already logged in
    present({ duration: 0, message: "Logging in..." });
    const success = await handleGoogleLoginAndVerifyAWSUser();
    dismiss();
  };

  return (
    <>
      <IonPage>
        <IonContent>
          <IonCard>
            <IonCardContent>
              {context.humspotUser.loggedIn ?
                <>
                  <p>Currently logged in as: {context.humspotUser.email}</p>
                  <IonButton onClick={async () => await handleLogout()}>Logout</IonButton>

                </>
                :
                <>
                  <p>Currently a Guest User</p>
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