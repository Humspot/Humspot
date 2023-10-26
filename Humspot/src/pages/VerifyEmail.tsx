/**
 * @file VerifyEmail.tsx 
 * @fileoverview Page where users can enter the verification code sent to them via email. 
 * Upon success, the user is re-routed to the login page.
 */

import { useRef } from "react";
import { useParams } from "react-router-dom";
import {
  IonButton, IonCardTitle, IonContent, IonInput, IonItem,
  IonLabel, IonPage, useIonLoading, useIonRouter, useIonViewWillEnter
} from "@ionic/react";


import { useToast } from "@agney/ir-toast";

import { confirmSignUp } from "../utils/server";
import { useContext } from "../utils/my-context";

import './SignUp.css';


type VerifyEmailParams = {
  email: string;
};

const VerifyEmail = () => {

  const { email } = useParams<VerifyEmailParams>();
  const decodedEmail: string = decodeURIComponent(email);

  const codeRef = useRef<HTMLIonInputElement | null>(null);

  const Toast = useToast();
  const context = useContext();
  const router = useIonRouter();
  const [present, dismiss] = useIonLoading();

  useIonViewWillEnter(() => {
    context.setShowTabs(false);
  });

  const clickOnVerify = async () => {
    if (!codeRef || !codeRef.current) return;
    present({ message: "Verifying..." });
    const res: boolean = await confirmSignUp(decodedEmail, codeRef.current?.value as string ?? '');
    if (!res) {
      const t = Toast.create({ message: "Incorrect code!", duration: 2000, color: "danger" });
      t.present();
    } else {
      const t = Toast.create({ message: "Success! Redirecting to sign in...", duration: 2000, color: "success" });
      t.present();
      router.push("/sign-in");
    }
    dismiss();
  };

  return (
    <IonPage>
      <IonContent>

        <div className="center-content">
          <section className="center-container">
            <IonCardTitle style={{ fontSize: "2em", textAlign: "center", marginBottom: "50px" }}>Verify Email</IonCardTitle>

            <IonLabel id="email-label" className="login-label">Email</IonLabel>
            <IonItem className='login-input-verify'>
              <IonInput aria-labelledby="email-label" type="email" value={decodedEmail} disabled />
            </IonItem>

            <IonLabel id="code-label" className="login-label">Verification Code</IonLabel>
            <IonItem className='login-input-verify'>
              <IonInput aria-labelledby="code-label" type="email" ref={codeRef} />
            </IonItem>

            <br />

            <div style={{ height: "5%" }} />

            <IonButton className="login-button-verify" onClick={() => { clickOnVerify() }} fill="clear" expand="block" id="signInButton">Verify</IonButton>

          </section>
        </div>

      </IonContent>
    </IonPage>
  )

};


export default VerifyEmail;