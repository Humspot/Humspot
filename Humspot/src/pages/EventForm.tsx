import React, { useState } from 'react';
import { IonPage, IonContent, IonInput, IonButton, IonLabel, IonDatetime, IonTextarea, IonTitle, IonItem, IonList, IonToast } from '@ionic/react';
import { HumspotEvent } from '../utils/types';
import { useContext } from '../utils/my-context';
import { timeout } from '../utils/timeout';
import { useToast } from '@agney/ir-toast';
import { handleAddEvent, handleSubmitEventForApproval } from '../utils/server';
import './EventForm.css'; // Importing the custom CSS

export const EventForm = () => {
    
    const context = useContext();
    const Toast = useToast();

    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

  
    const [event, setEvent] = useState<HumspotEvent>({
        name: '',
        description: '',
        location: '',
        addedByUserID: '', // This should probably come from context or user session
        date: '',
        time: '',
        latitude: 0,
        longitude: 0,
        organizer: '',
        tags: [],
        photoUrls: [],
        websiteURL: '',
      });
      
      const handleChange = (field: keyof HumspotEvent) => (e: CustomEvent) => {
        setEvent({ ...event, [field]: e.detail.value });
      };
    

      // 
      const handleSubmit = async () => {
        // should add in more robust error notification to the user, possibly a toast message or something  
        if (!context.humspotUser || !context.humspotUser.userID) return;
        let eventCopy = event; 
        eventCopy.addedByUserID = context.humspotUser.userID;
        setEvent(eventCopy); 
        const response = await handleSubmitEventForApproval(event);
        console.log(response);

        // Display toast on successful submission
        if (response.success) {
        setToastMessage("Event added successfully!");
        setShowToast(true);
        }
    }

  return (
    <IonPage>
      <IonContent className="event-form-content">
        <IonTitle className="ion-text-center event-form-title">Submit an Event</IonTitle>

        {context.humspotUser?.accountType !== 'user' ?
        <form className="event-form">
            <IonList lines="full">
                <IonItem>
                    <IonLabel position="floating">Name</IonLabel>
                    <IonInput value={event.name} onIonChange={handleChange('name')} placeholder="Enter Name" />
                </IonItem>

                <IonItem>
                    <IonLabel position="floating">Description</IonLabel>
                    <IonTextarea value={event.description} onIonChange={handleChange('description')} placeholder="Enter Description" />
                </IonItem>

                <IonItem>
                    <IonLabel position="floating">Location</IonLabel>
                    <IonInput value={event.location} onIonChange={handleChange('location')} placeholder="Enter Location" />
                </IonItem>

                <IonItem>
                    <IonLabel>Date & Time</IonLabel>
                    <IonDatetime value={event.date} onIonChange={handleChange('date')} placeholder="Select Date" />
                </IonItem>

                <IonItem>
                    <IonLabel>Organizer</IonLabel>
                    <IonInput value={context.humspotUser?.username ?? ''} disabled placeholder="Organizer Name" />
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


export default EventForm;
