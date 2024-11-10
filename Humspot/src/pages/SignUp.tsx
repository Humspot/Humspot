/**
 * @file SignUp.tsx
 * @fileoverview Page where users can sign up using an email address and password.
 * They are sent a verification email after entering their information.
 */

import React, { useEffect, useRef, useState } from 'react';
import {
  IonButton, IonContent, IonIcon, IonInput, IonItem, IonLabel, IonPage, IonText,
  useIonAlert,
  useIonLoading, useIonRouter, useIonViewDidEnter, useIonViewWillEnter
} from '@ionic/react';
import { eyeOffOutline, eyeOutline } from 'ionicons/icons';

import { useToast } from '@agney/ir-toast';

import AppleWhite from '../assets/images/apple-white.png';
import AppleBlack from '../assets/images/apple-black.png';

import GoBackHeader from '../components/Shared/GoBackHeader';
import GoogleLoginButton from '../components/Login/GoogleLoginButton';

import { dynamicNavigate } from '../utils/functions/dynamicNavigate';
import useContext from '../utils/hooks/useContext';
import { createFirestoreUser, handleAppleLoginAndVerifyAWSUser, handleSignUp, verifyPhoneNumber } from '../utils/server';

import '../components/Login/AuthPages.css';
import { NewHumspotUser } from '../utils/types';
import { formatPhoneNumber } from '../utils/functions/formatPhone';

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

  const phoneRef = React.useRef<HTMLIonInputElement | null>(null);
  const [phoneNumber, setPhoneNumber] = React.useState<string>('');

  const validatePhoneNumber = (): boolean => {
    if (phoneNumber.trim().length <= 0) return false;
    const regex = /^\+\d{1,3}-\d{1,14}$/;
    return regex.test(phoneNumber);
  }

  const clickedOnAgree = async () => {
    await present({ message: 'Please Wait...' });
    const success = await verifyPhoneNumber(phoneNumber);
    if (success) { // create new user in Firestore upon successful phone auth
      const userInfo: { username: string; userID: string } | null = await createFirestoreUser(phoneNumber);
      if (userInfo) {
        const user: NewHumspotUser = {
          userID: userInfo.userID,
          username: userInfo.username,
          phoneNumber,
          accountType: "user",
          accountStatus: "active",
          authProvider: "phone",
          dateCreated: (new Date()).toISOString(),
          email: null,
          profilePicUrl: null,
          bio: null,
          requestForCoordinatorSubmitted: false
        }
        context.setNewHumspotUser(user);
        const t = Toast.create({ message: 'Signed In!', duration: 2000, position: 'bottom', color: 'success' });
        t.present();
        router.goBack();
      } else {
        const t = Toast.create({ message: 'Failed to create user. Please try again.', position: 'bottom', duration: 2000, color: 'danger' });
        t.present();
      }
    } else {
      const t = Toast.create({ message: 'Something went wrong!', position: 'bottom', duration: 2000, color: 'danger' });
      t.present();
    }
    await dismiss();
  }

  const clickOnSignUp = async () => {
    if (!validatePhoneNumber()) {
      const t = Toast.create({ message: 'Invalid phone number!', position: 'bottom', duration: 2000, color: 'danger' });
      t.present();
      return;
    }
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

  const handlePhoneNumberChange = (value: string) => {
    const formattedPhoneNumber = formatPhoneNumber(value);
    console.log(formattedPhoneNumber);
    setPhoneNumber(formattedPhoneNumber);
  };

  useEffect(() => {
    if (context.newHumspotUser) {
      router.canGoBack() && router.goBack();
    }
  }, [context.newHumspotUser]);

  useIonViewDidEnter(() => {
    if (phoneRef.current) {
      phoneRef.current.setFocus();
    }
  });

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
        <div>
          <section>

            <IonLabel id='phone-number-label' className='login-label'>Enter your phone number</IonLabel>
            <IonItem lines='none' className='login-input'>
              <IonInput aria-labelledby='phone-number-label' type='tel' ref={phoneRef} value={phoneNumber} onIonInput={(e) => handlePhoneNumberChange(e.target.value as string)} />
            </IonItem>

            <IonButton className='login-button' onClick={async () => { await clickOnSignUp() }} fill='clear' expand='block' id='signUpButton' >Send Code</IonButton>


            {/* <IonLabel id='password-label' className='login-label'>Password</IonLabel>
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
            <button onClick={async () => { router.push("/explore", 'root', 'replace'); await handleAppleLoginAndVerifyAWSUser(); }}><img style={{ borderRadius: '5px', width: '250px' }} src={context.darkMode ? AppleWhite : AppleBlack} /></button>
            <br /> */}

          </section>
        </div>
      </IonContent>
    </IonPage>
  );

};

export default SignUp;