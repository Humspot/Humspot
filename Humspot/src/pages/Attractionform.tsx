import React, { useState } from 'react';
import { IonPage, IonContent, IonInput, IonButton, IonLabel, IonDatetime, IonTextarea, IonTitle, IonItem } from '@ionic/react';
import { HumspotAttraction } from '../utils/types';
import { useContext } from '../utils/my-context';
import { useToast } from '@agney/ir-toast';


console.log("The computer sees this page ");
export const AttractionForm = () => {

    const context = useContext();
    const Toast = useToast();

    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    const [attraction, setAttraction] = useState<HumspotAttraction>({
        name: '',
        description: '',
        location: '',
        addedByUserID: '',
        websiteUrl: '', 
        latitude: 0,
        longitude: 0,
        openTimes: '',
        tags: [],
        photoUrls: [],
      });


    return (
        <IonPage>
            <IonContent className="attraction-form-content">
                <IonTitle className="ion-text-center attraction-form-title">Submit an Attraction</IonTitle>
                <p>hello</p>
            </IonContent>
        </IonPage>
    );
};

export default AttractionForm;
