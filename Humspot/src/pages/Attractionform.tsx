import React, { useState } from 'react';
import { IonPage, IonContent, IonInput, IonButton, IonLabel, IonDatetime, IonTextarea, IonTitle, IonItem, IonList, IonToast} from '@ionic/react';
import { HumspotAttraction } from '../utils/types';
import { useContext } from '../utils/my-context';
import { useToast } from '@agney/ir-toast';
import { handleAddEvent, handleSubmitEventForApproval } from '../utils/server';


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
        closeTimes: '',
        tags: [],
        photoUrls: [],
      });


      const handleChange = (field: keyof HumspotAttraction) => (e: CustomEvent) => {
        setAttraction({ ...attraction, [field]: e.detail.value });
      };

    
      const handleSubmit = async () => {
        // should add in more robust error notification to the user, possibly a toast message or something  
        if (!context.humspotUser || !context.humspotUser.userID) return;
        let attractionCopy = attraction; 
        attractionCopy.addedByUserID = context.humspotUser.userID;
        setAttraction(attractionCopy); 
        const response = await handleSubmitEventForApproval();
        console.log(response);

        // Display toast on successful submission
        if (response.success) {
        setToastMessage("Event added successfully!");
        setShowToast(true);
        }
    }
    

    return (
        <IonPage>
            <IonContent className="attraction-form-content">
                <IonTitle className="ion-text-center attraction-form-title">Submit an Attraction</IonTitle>

        {context.humspotUser?.accountType !== 'user' ?
        <form className="attraction-form">
            <IonList lines="full">
                <IonItem>
                    <IonLabel position="floating">Name</IonLabel>
                    <IonInput value={attraction.name} onIonChange={handleChange('name')} placeholder="Enter Name" />
                </IonItem>

                <IonItem>
                    <IonLabel position="floating">Description</IonLabel>
                    <IonTextarea value={attraction.description} onIonChange={handleChange('description')} placeholder="Enter Description" />
                </IonItem>

                <IonItem>
                    <IonLabel position="floating">Location</IonLabel>
                    <IonInput value={attraction.location} onIonChange={handleChange('location')} placeholder="Enter Location" />
                </IonItem>

                <IonItem>
                <IonLabel position="floating">Open Time</IonLabel>
                <IonDatetime 
                    displayFormat="h:mm A" 
                    placeholder="Select Open Time" 
                    value={attraction.openTimes} 
                    onIonChange={handleChange('openTimes')}>
                </IonDatetime>
                </IonItem>


                <IonLabel position="floating">Close Time</IonLabel>
                <IonItem>
                <IonDatetime 
                    displayFormat="h:mm A" 
                    placeholder="Select Close Time" 
                    value={attraction.closeTimes} 
                    onIonChange={handleChange('closeTimes')}>
                </IonDatetime>
                </IonItem>

                <IonItem>
                    <IonLabel position="floating">Website URL</IonLabel>
                    <IonInput value={attraction.websiteUrl} onIonChange={handleChange('websiteUrl')} placeholder="Enter Website URL" />
                </IonItem>
            </IonList>

            <IonButton expand="block" onClick={async () => await handleSubmit()}>Submit</IonButton>

            <IonToast
            isOpen={showToast}
            onDidDismiss={() => setShowToast(false)}
            message={toastMessage}
            duration={2000}
            />
        </form>
        :
        <div className="ion-text-center access-denied-message">
            You must be an admin or organizer to submit an event or attraction!
        </div>
        }
      </IonContent>
  </IonPage>
  );
};

export default AttractionForm;
