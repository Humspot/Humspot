/**
 * @file SignUp.tsx
 * @fileoverview Page where users can sign up using an email address and password.
 * They are sent a verification email after entering their information.
 */

import { useRef, useState } from "react";
import {
  IonButton, IonContent, IonIcon, IonInput, IonItem, IonLabel, IonPage, IonText,
  useIonLoading, useIonRouter, useIonViewWillEnter
} from "@ionic/react";
import { eyeOffOutline, eyeOutline } from "ionicons/icons";

import { useToast } from "@agney/ir-toast";

import { useContext } from "../utils/my-context";
import { handleSignUp } from "../utils/server";
import GoBackHeader from "../components/Shared/GoBackHeader";
import GoogleLoginButton from "../components/Login/GoogleLoginButton";


import '../components/Login/AuthPages.css';
import { dynamicNavigate } from "../utils/dynamicNavigate";


const SignUp: React.FC = () => {

  const context = useContext();
  const router = useIonRouter();
  const Toast = useToast();
  const [present, dismiss] = useIonLoading();

  const emailRef = useRef<HTMLIonInputElement | null>(null);
  const passwordRef = useRef<HTMLIonInputElement | null>(null);

  const [showPassword, setShowPassword] = useState<boolean>(false);

  useIonViewWillEnter(() => {
    if (context.humspotUser) {
      dynamicNavigate(router, '/explore', 'root');
    }
  }, [context.humspotUser]);

  useIonViewWillEnter(() => {
    context.setShowTabs(false);
  });

  const clickOnSignUp = async () => {
    if (!passwordRef || !emailRef) return;
    await present({ message: "Please Wait..." });
    const success: boolean = await handleSignUp(
      emailRef.current?.value as string ?? '',
      passwordRef.current?.value as string ?? '',
    );
    if (success) { // route to verify page, on success email is sent with code
      const t = Toast.create({ message: "Success! Check your email for a verification code.", duration: 2000, color: "success" });
      t.present();
      dynamicNavigate(router, "/verify-email/" + encodeURIComponent(emailRef.current?.value as string) + "/sign-up-verify", 'root')
    } else {
      const t = Toast.create({ message: "Something went wrong!", duration: 2000, color: "danger" });
      t.present();
    }
    await dismiss();
  };

  return (
    <IonPage>
      <GoBackHeader title="Sign Up" />
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

            <IonButton className="login-button" onClick={async () => { await clickOnSignUp() }} fill="clear" expand="block" id="signUpButton" >Sign Up</IonButton>
            <p style={{ fontSize: "0.9rem" }}><IonText color='primary'><span onClick={() => { router.push("/sign-in") }}>Sign In to an Existing Account</span></IonText></p>

            <p>OR</p>

            <GoogleLoginButton />

            <br />

          </section>
        </div>
      </IonContent>
    </IonPage>
  );

};

export default SignUp;