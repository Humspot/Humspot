/**
 * @file ForgotPassword.tsx
 * @fileoverview the page where users can submit a forgot password request. This will send an email to the user with an OTP.
 */

import { useToast } from '@agney/ir-toast';
import { IonButton, IonContent, IonInput, IonItem, IonLabel, IonPage, useIonLoading, useIonRouter } from '@ionic/react';
import { useRef } from 'react';
import { handleForgotPassword } from '../utils/server';
import GoBackHeader from '../components/Shared/GoBackHeader';
import { dynamicNavigate } from '../utils/functions/dynamicNavigate';

const ForgotPassword = () => {

  const router = useIonRouter();
  const Toast = useToast();
  const [present, dismiss] = useIonLoading();

  const emailRef = useRef<HTMLIonInputElement | null>(null);

  const clickOnForgotPassword = async () => {
    if (!emailRef || !emailRef.current) return;
    await present({ message: 'Loading...' });
    const success: boolean = await handleForgotPassword(emailRef.current.value as string);
    if (success) { // route to verify page, on success email is sent with code
      const t = Toast.create({ message: 'Success! Check your email for a verification code.', duration: 2000, color: 'success' });
      t.present();
      dynamicNavigate(router, '/verify-email/' + encodeURIComponent(emailRef.current?.value as string) + '/password-verify', 'root');
    } else {
      const t = Toast.create({ message: 'Something went wrong!', duration: 2000, color: 'danger' });
      t.present();
    }
    await dismiss();
  };

  return (
    <IonPage>
      <GoBackHeader title='Forgot Password' />
      <IonContent>
        <div className='center-content'>
          <section className='center-container'>

            <IonLabel id='email-label' className='login-label'>Email</IonLabel>
            <IonItem lines='none' className='login-input'>
              <IonInput aria-labelledby='email-label' type='email' ref={emailRef} placeholder='email@email.com' />
            </IonItem>

            <IonButton className='login-button' onClick={async () => { await clickOnForgotPassword() }} fill='clear' expand='block' id='passwordResetButton' >Send Password Reset</IonButton>

            <div style={{ height: '25vh' }} />

          </section>
        </div>
      </IonContent>
    </IonPage>
  )

};

export default ForgotPassword;