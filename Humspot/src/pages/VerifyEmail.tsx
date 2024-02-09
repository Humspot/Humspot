/**
 * @file VerifyEmail.tsx 
 * @fileoverview Page where users can enter the verification code sent to them via email. 
 * This page is used for initial sign up verification as well as password reset requests.
 * Upon success, the user is re-routed to the login page.
 */

import { useRef, useState } from "react";
import { useParams } from "react-router-dom";
import {
  IonButton, IonCardTitle, IonContent, IonIcon, IonInput, IonItem,
  IonLabel, IonPage, useIonLoading, useIonRouter, useIonViewWillEnter
} from "@ionic/react";


import { useToast } from "@agney/ir-toast";

import { confirmSignUp, handleResetPassword } from "../utils/server";
import { useContext } from "../utils/hooks/useContext";

import '../components/Login/AuthPages.css';
import { eyeOutline, eyeOffOutline } from "ionicons/icons";
import { dynamicNavigate } from "../utils/functions/dynamicNavigate";


type VerifyEmailParams = {
  email: string;
  toVerify: string;
};

const VerifyEmail = () => {

  const { email, toVerify } = useParams<VerifyEmailParams>();
  const decodedEmail: string = decodeURIComponent(email);

  const codeRef = useRef<HTMLIonInputElement | null>(null);
  const passwordRef = useRef<HTMLIonInputElement | null>(null);

  const Toast = useToast();
  const context = useContext();
  const router = useIonRouter();
  const [present, dismiss] = useIonLoading();

  const [showPassword, setShowPassword] = useState<boolean>(false);

  useIonViewWillEnter(() => {
    context.setShowTabs(false);
  });

  const clickOnVerifyResetPassword = async () => {
    if (!codeRef || !codeRef.current || !passwordRef || !passwordRef.current) return;
    await present({ message: "Updating password..." });
    const res: boolean = await handleResetPassword(decodedEmail, codeRef.current?.value as string ?? '', passwordRef.current?.value as string ?? '');
    if (!res) {
      const t = Toast.create({ message: "Incorrect code!", position: 'bottom', duration: 2000, color: "danger" });
      t.present();
    } else {
      const t = Toast.create({ message: "Success! Redirecting to sign in...", position: 'bottom', duration: 2000, color: 'secondary' });
      t.present();
      dynamicNavigate(router, '/sign-in', 'root');
    }
    await dismiss();
  };

  const clickOnVerifySignUp = async () => {
    if (!codeRef || !codeRef.current) return;
    await present({ message: "Verifying..." });
    const res: boolean = await confirmSignUp(decodedEmail, codeRef.current?.value as string ?? '');
    if (!res) {
      const t = Toast.create({ message: "Incorrect code!", position: 'bottom', duration: 2000, color: "danger" });
      t.present();
    } else {
      const t = Toast.create({ message: "Success! Redirecting to sign in...", position: 'bottom', duration: 2000, color: 'secondary' });
      t.present();
      dynamicNavigate(router, '/sign-in', 'root');
    }
    await dismiss();
  };

  return (
    <IonPage>
      <IonContent>

        <div className="center-content">
          <section className="center-container">
            <IonCardTitle style={{ fontSize: "2em", textAlign: "center", marginBottom: "50px" }}>Verify Email</IonCardTitle>

            <IonLabel className='login-label'>Email</IonLabel>
            <IonItem lines="none" className='login-input'>
              <IonInput aria-labelledby="email-label" type="email" value={decodedEmail} disabled />
            </IonItem>

            {toVerify === "password-verify" &&
              <>
                <IonLabel id="new-password-label" className="login-label">New Password</IonLabel>
                <IonItem lines="none" className='login-input'>
                  <IonInput aria-labelledby='new-password-label' clearOnEdit={false} type={showPassword ? "text" : "password"} ref={passwordRef} placeholder="••••••••" />
                  <IonButton slot="end" fill="clear" onClick={() => { setShowPassword(!showPassword) }}>
                    <IonIcon color="medium" icon={showPassword ? eyeOutline : eyeOffOutline} />
                  </IonButton>
                </IonItem>
              </>
            }

            <IonLabel id="code-label" className="login-label">Verification Code</IonLabel>
            <IonItem lines='none' className='login-input' style={{ width: "70vw" }}>
              <IonInput aria-labelledby="code-label" type="email" ref={codeRef} />
            </IonItem>

            <br />

            <div style={{ height: "5%" }} />

            <IonButton
              className="login-button-verify"
              onClick={() => {
                if (toVerify === "sign-up-verify") clickOnVerifySignUp();
                else if (toVerify === "password-verify") clickOnVerifyResetPassword();
              }}
              fill="clear"
              expand="block">
              {toVerify === "sign-up-verify" ? "Verify" : "Reset Password"}
            </IonButton>

          </section>
        </div>

      </IonContent>
    </IonPage>
  )

};


export default VerifyEmail;