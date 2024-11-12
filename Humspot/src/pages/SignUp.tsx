/**
 * @file SignUp.tsx
 * @fileoverview Page where users can sign up using an email address and password.
 * They are sent a verification email after entering their information.
 */

import React from 'react';
import {
  IonButton, IonContent, IonFab, IonInput, IonItem, IonLabel, IonPage, useIonAlert,
  useIonLoading, useIonRouter, useIonViewDidEnter, useIonViewWillEnter
} from '@ionic/react';

import { useToast } from '@agney/ir-toast';

import GoBackHeader from '../components/Shared/GoBackHeader';

import { dynamicNavigate } from '../utils/functions/dynamicNavigate';
import useContext from '../utils/hooks/useContext';
import { sendPhoneVerificationCode } from '../utils/server';

import '../components/Login/AuthPages.css';
import { formatPhoneNumber, formatToE164 } from '../utils/functions/formatPhone';
import { timeout } from '../utils/functions/timeout';
import { FirebaseAuthentication } from '@capacitor-firebase/authentication';
import { Keyboard, KeyboardResize, KeyboardResizeOptions } from '@capacitor/keyboard';

const resizeOptions: KeyboardResizeOptions = {
  mode: KeyboardResize.None,
};

const defaultResizeOptions: KeyboardResizeOptions = {
  mode: KeyboardResize.Body,
};

const SignUp: React.FC = () => {

  const context = useContext();
  const router = useIonRouter();
  const Toast = useToast();
  const [present, dismiss] = useIonLoading();
  const [presentAlert, dismissAlert] = useIonAlert();

  const phoneRef = React.useRef<HTMLIonInputElement | null>(null);
  const [phoneNumber, setPhoneNumber] = React.useState<string>('');
  const [kbHeight, setKbHeight] = React.useState<number | null>(null);

  const handlePhoneNumberChange = (value: string) => {
    const formattedPhoneNumber = formatPhoneNumber(value);
    setPhoneNumber(formattedPhoneNumber);
  };

  const validatePhoneNumber = (): boolean => {
    const formattedPhoneNumber = formatToE164(phoneNumber);
    if (formattedPhoneNumber.trim().length <= 0) return false;
    const usPhoneRegex = /^\+1\d{10}$/;
    return usPhoneRegex.test(formattedPhoneNumber);
  }

  const clickedOnAgree = async () => {
    try {
      await dismissAlert();
      await present({ message: 'Please Wait...' });
      await Keyboard.hide();
      const formattedPhoneNumber: string = formatToE164(phoneNumber);
      const success: boolean = await sendPhoneVerificationCode(formattedPhoneNumber);
      if (!success) {
        const t = Toast.create({ message: 'Failed to verify phone number. Please try again.', position: 'bottom', duration: 2000, color: 'danger' });
        t.present();
      } else {
        context.setPhoneNumber(formattedPhoneNumber);
      }
    } catch (err) {
      console.error('Error occurred:', err);
      const t = Toast.create({ message: 'Something went wrong!', position: 'bottom', duration: 2000, color: 'danger' });
      t.present();
    } finally {
      await dismiss();
    }
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


  React.useEffect(() => {
    if (context.newHumspotUser) {
      router.canGoBack() && router.goBack();
    }
  }, [context.newHumspotUser]);

  const handlePhoneCodeSent = React.useCallback(async () => {
    await FirebaseAuthentication.addListener('phoneCodeSent', async (event) => {
      console.log('Code sent event received:', event);
      await dismiss();
      await Keyboard.hide();
      dynamicNavigate(router, `/verify-phone-code/${event.verificationId}`, 'forward');
    });
  }, [router]);

  React.useEffect(() => {
    handlePhoneCodeSent();
  }, [handlePhoneCodeSent]);

  React.useEffect(() => {
    const keyboardShowListener = Keyboard.addListener('keyboardWillShow', async (info) => {
      await Keyboard.setResizeMode(resizeOptions);
      setKbHeight(info.keyboardHeight);
    });

    const keyboardHideListener = Keyboard.addListener('keyboardWillHide', async () => {
      await Keyboard.setResizeMode(defaultResizeOptions);
    });

    return () => {
      Keyboard.setResizeMode(defaultResizeOptions);
      keyboardShowListener.remove();
      keyboardHideListener.remove();
    };
  }, []);

  useIonViewDidEnter(async () => {
    context.setPhoneNumber('');
    if (phoneRef.current) {
      phoneRef.current.setFocus();
    }
  });

  useIonViewWillEnter(() => {
    if (context.newHumspotUser) {
      dynamicNavigate(router, '/explore', 'root');
    }
  }, [context.newHumspotUser]);

  useIonViewWillEnter(() => {
    context.setShowTabs(false);
  });

  return (
    <IonPage>
      <GoBackHeader translucent={true} title='Login' onBeforeBack={async () => await Keyboard.hide()} />
      <IonContent scrollY={false}>
        <div>
          <section>

            <IonLabel id='phone-number-label' className='login-label'>Enter your phone number</IonLabel>
            <IonItem lines='none' className='login-input'>
              <IonInput aria-labelledby='phone-number-label' type='tel' ref={phoneRef} value={phoneNumber} onIonInput={(e) => handlePhoneNumberChange(e.target.value as string)}
                onBlur={e => {
                  if (e.relatedTarget === null) {
                    e.target.focus();
                  }
                }}
              />
            </IonItem>

            <IonFab className='login-confirm' vertical="bottom" horizontal="center" style={kbHeight ? { bottom: `${kbHeight}px` } : { bottom: '45%' }}>
              <IonButton className='login-button' onClick={async () => { await clickOnSignUp() }} fill='clear' expand='block' id='signUpButton' >Send Code</IonButton>
            </IonFab>


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