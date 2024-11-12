
import { IonPage, IonContent, useIonRouter, useIonLoading } from "@ionic/react";
import React from "react";
import VerificationInput from "react-verification-input";
import GoBackHeader from "../components/Shared/GoBackHeader";
import { useToast } from "@agney/ir-toast";
import { PhoneAuthProvider, signInWithCredential } from "firebase/auth";
import { useParams } from 'react-router-dom';
import auth, { createOrGetFirestoreUser } from "../utils/server";
import { NewHumspotUser } from "../utils/types";
import useContext from "../utils/hooks/useContext";
import { dynamicNavigate } from "../utils/functions/dynamicNavigate";
import { Keyboard } from "@capacitor/keyboard";

type SearchParams = {
  verificationId: string;
};

const codeLength: number = 6;

const VerifyPhoneCode = () => {
  const params = useParams<SearchParams>();
  const verificationId: string = decodeURIComponent(params.verificationId) ?? '';

  const Toast = useToast();
  const router = useIonRouter();
  const context = useContext();
  const [present, dismiss] = useIonLoading();

  const [input, setInput] = React.useState<string>('');

  const handleChange = (value: string) => {
    setInput(value);
  };

  const handleVerify = async () => {
    try {
      await Keyboard.hide();
      await present({ message: 'Verifying...' });

      const credential = PhoneAuthProvider.credential(
        verificationId,
        input.trim(),
      );
      const userCredential = await signInWithCredential(auth, credential);
    }
    catch (err) {
      console.error(err);
      const t = Toast.create({ message: "Invalid code", duration: 2000, color: 'danger', position: 'bottom' });
      t.present();
      await dismiss();
    }
  };

  React.useEffect(() => {
    if (input.length === codeLength) {
      handleVerify();
    }
  }, [input]);

  return (
    <IonPage>

      <GoBackHeader translucent={true} title='Verify Phone' />

      <IonContent scrollY={false}>
        <div className='center-content'>
          <section className='center-container'>
            <p style={{ fontSize: '1.1rem' }}>Enter the code that was texted to you</p>
            <VerificationInput
              classNames={context.darkMode ? {
                container: "container",
                character: "character-dark",
                characterSelected: "character--selected",
              } : {
                container: "container",
                character: "character-light",
                characterSelected: "character--selected",
              }}
              autoFocus
              onChange={handleChange}
            // onComplete={handleVerify}
            />
          </section>
        </div>
      </IonContent>
    </IonPage>
  )

};

export default VerifyPhoneCode;