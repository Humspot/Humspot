/**
 * @file SignIn.tsx
 * @fileoverview The Sign in page.
 */

import { useRef, useState } from 'react';
import {
  IonButton, IonContent, IonIcon, IonInput, IonItem, IonLabel, IonPage, IonText,
  useIonAlert,
  useIonLoading, useIonRouter, useIonViewWillEnter,
} from '@ionic/react';
import { eyeOffOutline, eyeOutline } from 'ionicons/icons';

import { useToast } from '@agney/ir-toast';

import AppleWhite from '../assets/images/apple-white.png';
import AppleBlack from '../assets/images/apple-black.png';

import GoBackHeader from '../components/Shared/GoBackHeader';
import GoogleLoginButton from '../components/Login/GoogleLoginButton';

import useContext from '../utils/hooks/useContext';
import { handleSignIn } from '../utils/server';
import { dynamicNavigate } from '../utils/functions/dynamicNavigate';

import '../components/Login/AuthPages.css';

const inputNote: React.CSSProperties = {
  fontSize: '0.85em',
  textAlign: 'right',
  color: 'gray',
  fontFamily: 'Arial',
};

const SignIn = () => {

  const context = useContext();
  const router = useIonRouter();
  const Toast = useToast();
  const [present, dismiss] = useIonLoading();
  const [presentAlert] = useIonAlert();

  const emailRef = useRef<HTMLIonInputElement | null>(null);
  const passwordRef = useRef<HTMLIonInputElement | null>(null);

  const [showPassword, setShowPassword] = useState<boolean>(false);

  const clickedOnAgree = async () => {
    await present({ message: 'Signing In...' })
    const success = await handleSignIn(
      emailRef.current?.value as string ?? '',
      passwordRef.current?.value as string ?? '',
    );
    if (!success) {
      const t = Toast.create({ message: 'Something went wrong!', position: 'bottom', duration: 2000, color: 'danger' });
      t.present();
    } else {
      dynamicNavigate(router, '/profile', 'root');
    }
    await dismiss();
  };

  /**
   * @description runs when the user clicks on the Sign In button. 
   * It presents a loading spinner while the username and password is verified and authenticated. 
   * Upon success, route to /profile.
   * @see handleSignIn
   */
  const clickOnSignIn = async (): Promise<void> => {
    if (!passwordRef || !emailRef) return;
    await presentAlert({
      cssClass: 'ion-alert-logout',
      header: 'Humspot Sign In',
      message: `By signing in to a Humspot account you confirm that you agree to our Terms of Service and Privacy Policy.`,
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
      router.push('/explore');
    }
  }, [context.humspotUser]);

  useIonViewWillEnter(() => {
    context.setShowTabs(false);
  });


  return (
    <IonPage>

      <GoBackHeader translucent={true} title='Sign In' />

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

            <IonButton className='login-button' onClick={async () => { await clickOnSignIn() }} fill='clear' expand='block' id='signInButton' >Sign In</IonButton>

            <p style={inputNote}><IonText onClick={() => { router.push('/forgot-password') }}>forgot your password?</IonText></p>

            <p style={{ fontSize: '0.9rem' }}><IonText color='primary'><span onClick={() => { router.goBack(); }}>Register for an Account</span></IonText></p>
            <p>OR</p>
            <GoogleLoginButton />
            <br />
            {/* <p>OR</p> */}
            <button onClick={() => { }}><img style={{ borderRadius: '5px', width: '250px' }} src={context.darkMode ? AppleWhite : AppleBlack} /></button>

          </section>
        </div>
      </IonContent>
    </IonPage>
  );

};

export default SignIn;