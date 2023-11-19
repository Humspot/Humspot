import React, { useState } from 'react';
import { IonPage, IonContent, IonInput, IonButton, IonLabel, IonDatetime, IonTextarea, IonTitle } from '@ionic/react';
import { HumspotEvent } from '../utils/types';
import { useContext } from '../utils/my-context';
import { timeout } from '../utils/timeout';
import { useToast } from '@agney/ir-toast';

export const SubmitEventPage: React.FC = () => {

  const context = useContext();
  const Toast = useToast();

  return (
    <IonPage>
      <IonContent></IonContent>
    </IonPage>
  );
};

export default SubmitEventPage;