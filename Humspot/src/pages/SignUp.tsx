/**
 * @file SignUp.tsx
 * @fileoverview Page where users can sign up using an email address and password.
 * They are sent a verification email after entering their information.
 */

import { useRef, useState } from 'react';
import {
  IonButton, IonContent, IonIcon, IonInput, IonItem, IonLabel, IonPage, IonText,
  useIonAlert,
  useIonLoading, useIonRouter, useIonViewWillEnter
} from '@ionic/react';
import { eyeOffOutline, eyeOutline } from 'ionicons/icons';

import { useToast } from '@agney/ir-toast';

import GoBackHeader from '../components/Shared/GoBackHeader';
import GoogleLoginButton from '../components/Login/GoogleLoginButton';

import { dynamicNavigate } from '../utils/functions/dynamicNavigate';
import useContext from '../utils/hooks/useContext';
import { handleSignUp } from '../utils/server';

import '../components/Login/AuthPages.css';

const inputNote: React.CSSProperties = {
  fontSize: '0.85em',
  textAlign: 'right',
  color: 'gray',
  fontFamily: 'Arial',
};


const SignUp: React.FC = () => {

  const context = useContext();
  const router = useIonRouter();
  const Toast = useToast();
  const [present, dismiss] = useIonLoading();
  const [presentAlert] = useIonAlert();

  const emailRef = useRef<HTMLIonInputElement | null>(null);
  const passwordRef = useRef<HTMLIonInputElement | null>(null);

  const [showPassword, setShowPassword] = useState<boolean>(false);

  const clickedOnAgree = async () => {
    await present({ message: 'Please Wait...' });
    const success: boolean = await handleSignUp(
      emailRef.current?.value as string ?? '',
      passwordRef.current?.value as string ?? '',
    );
    if (success) { // route to verify page, on success email is sent with code
      const t = Toast.create({ message: 'Success! Check your email for a verification code', position: 'bottom', duration: 2000, color: 'secondary' });
      t.present();
      dynamicNavigate(router, '/verify-email/' + encodeURIComponent(emailRef.current?.value as string) + '/sign-up-verify', 'root')
    } else {
      const t = Toast.create({ message: 'Something went wrong!', position: 'bottom', duration: 2000, color: 'danger' });
      t.present();
    }
    await dismiss();
  }

  const clickOnSignUp = async () => {
    if (!passwordRef || !emailRef) return;
    await presentAlert({
      cssClass: 'ion-alert-logout',
      header: 'Humspot Sign Up',
      message: `By signing up to Humspot you confirm that you agree to our Terms of Service and Privacy Policy.`,
      buttons:
        [
          {
            text: 'Cancel',
            role: 'cancel',
            cssClass: 'alert-cancel-button',
          },
          {
            text: 'I agree',
            handler: async () => {
              await clickedOnAgree();
            },
          },
        ]
    });
  };

  useIonViewWillEnter(() => {
    if (context.humspotUser) {
      dynamicNavigate(router, '/explore', 'root');
    }
  }, [context.humspotUser]);

  useIonViewWillEnter(() => {
    context.setShowTabs(false);
  });

  return (
    <IonPage>
      <GoBackHeader translucent={true} title='Sign Up' />
      <IonContent scrollY={false}>
        <div className='center-content'>
          <section className='center-container'>

            <IonLabel id='email-label' className='login-label'>Email</IonLabel>
            <IonItem lines='none' className='login-input'>
              <IonInput aria-labelledby='email-label' type='email' ref={emailRef} placeholder='email@email.com' />
            </IonItem>

            <IonLabel id='password-label' className='login-label'>Password</IonLabel>
            <IonItem lines='none' className='login-input'>
              <IonInput aria-labelledby='password-label' clearOnEdit={false} type={showPassword ? 'text' : 'password'} ref={passwordRef} placeholder='••••••••' />
              <IonButton slot='end' fill='clear' onClick={() => { setShowPassword(!showPassword) }}>
                <IonIcon color='medium' icon={showPassword ? eyeOutline : eyeOffOutline} />
              </IonButton>
            </IonItem>
            <br />


            <IonButton className='login-button' onClick={async () => { await clickOnSignUp() }} fill='clear' expand='block' id='signUpButton' >Sign Up</IonButton>
            <p style={inputNote}><IonText onClick={() => { router.push('/terms-and-conditions') }}>Terms and Conditions</IonText></p>
            <p style={{ fontSize: '0.9rem' }}><IonText color='primary'><span onClick={() => { router.push('/sign-in') }}>Sign In to an Existing Account</span></IonText></p>
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