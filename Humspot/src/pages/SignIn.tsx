import { useRef, useState } from "react";
import {
  IonButton, IonContent, IonIcon, IonInput, IonItem, IonLabel, IonPage, IonText,
  useIonLoading, useIonRouter, useIonViewWillEnter,
} from "@ionic/react";
import { eyeOffOutline, eyeOutline } from "ionicons/icons";

import { useContext } from "../utils/hooks/useContext";
import { handleSignIn } from "../utils/server";

import { useToast } from "@agney/ir-toast";

import GoBackHeader from "../components/Shared/GoBackHeader";
import GoogleLoginButton from "../components/Login/GoogleLoginButton";

import '../components/Login/AuthPages.css';
import { dynamicNavigate } from "../utils/functions/dynamicNavigate";

const inputNote: React.CSSProperties = {
  fontSize: "0.85em",
  textAlign: "right",
  color: "gray",
  fontFamily: "Arial",
};

const SignIn = () => {

  const context = useContext();
  const router = useIonRouter();
  const Toast = useToast();
  const [present, dismiss] = useIonLoading();

  const emailRef = useRef<HTMLIonInputElement | null>(null);
  const passwordRef = useRef<HTMLIonInputElement | null>(null);

  const [showPassword, setShowPassword] = useState<boolean>(false);

  useIonViewWillEnter(() => {
    if (context.humspotUser) {
      router.push("/explore");
    }
  }, [context.humspotUser]);

  useIonViewWillEnter(() => {
    context.setShowTabs(false);
  });

  const clickOnSignIn = async () => {
    if (!passwordRef || !emailRef) return;
    await present({ message: "Signing In..." })
    const success = await handleSignIn(
      emailRef.current?.value as string ?? '',
      passwordRef.current?.value as string ?? '',
    );
    if (!success) {
      const t = Toast.create({ message: "Something went wrong!", duration: 2000, color: "danger" });
      t.present();
    } else {
      dynamicNavigate(router, '/profile', 'root');
    }
    await dismiss();
  };

  return (
    <IonPage>
      <GoBackHeader title="Sign In" />
      <IonContent>
        <div className="center-content">
          <section className="center-container">

            <IonLabel id="email-label" className="login-label">Email</IonLabel>
            <IonItem className='login-input'>
              <IonInput aria-labelledby="email-label" type="email" ref={emailRef} placeholder="email@email.com" />
            </IonItem>

            <IonLabel id="password-label" className="login-label">Password</IonLabel>
            <IonItem className='login-input'>
              <IonInput aria-labelledby='password-label' clearOnEdit={false} type={showPassword ? "text" : "password"} ref={passwordRef} placeholder="••••••••" />
              <IonButton slot="end" fill="clear" onClick={() => { setShowPassword(!showPassword) }}>
                <IonIcon color="medium" icon={showPassword ? eyeOutline : eyeOffOutline} />
              </IonButton>
            </IonItem>
            <br />
            <div style={{ height: "5%" }} />

            <IonButton className="login-button" onClick={async () => { await clickOnSignIn() }} fill="clear" expand="block" id="signInButton" >Sign In</IonButton>

            <p style={inputNote}><IonText onClick={() => { router.push("/forgot-password") }}>forgot your password?</IonText></p>


            <p style={{ fontSize: "0.9rem" }}><IonText color='primary'><span onClick={() => { router.goBack(); }}>Register for an Account</span></IonText></p>
            <p>OR</p>

            <GoogleLoginButton />

            <br />

          </section>
        </div>
      </IonContent>
    </IonPage>
  );

};

export default SignIn;