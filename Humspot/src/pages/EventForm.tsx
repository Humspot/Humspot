import React, { useState } from 'react';
import { IonPage, IonContent, IonInput, IonButton, IonLabel, IonDatetime, IonTextarea, IonTitle } from '@ionic/react';
import { HumspotEvent } from '../utils/types';
import { useContext } from '../utils/my-context';
import { timeout } from '../utils/timeout';
import { useToast } from '@agney/ir-toast';
import { handleAddEvent, handleSubmitEventForApproval } from '../utils/server';


export const EventForm = () => {
    
    const context = useContext();
    const Toast = useToast();
  
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
    
      const handleSubmit = async () => {
        if (!context.humspotUser || !context.humspotUser.userID) return;
        let eventCopy = event; 
        eventCopy.addedByUserID = context.humspotUser.userID;
        setEvent(eventCopy); 
        const response = await handleSubmitEventForApproval(event);
        console.log(response);
    }

  return (
    <IonPage>
      <IonContent>

        <IonTitle className='ion-text-center' style={{ paddingTop: "10%" }}>Submit an Event</IonTitle>

        {context.humspotUser?.accountType !== 'user' ?

          <form style={{ padding: "10px" }}>
            <IonLabel>Name:</IonLabel>
            <IonInput value={event.name} onIonChange={handleChange('name')} placeholder="Enter Name" />

            <br />

            <IonLabel>Description:</IonLabel>
            <IonTextarea value={event.description} onIonChange={handleChange('description')} placeholder="Enter Description" />

            <br />

            <IonLabel>Location:</IonLabel>
            <IonInput value={event.location} onIonChange={handleChange('location')} placeholder="Enter Location" />

            <br />

            <IonLabel>Date & Time:</IonLabel>
            <IonDatetime value={event.date} onIonChange={handleChange('date')} placeholder="Select Date" />

            <br />

            <IonLabel>Organizer:</IonLabel>
            <IonInput value={context.humspotUser?.username ?? ''} disabled placeholder="Enter Organizer" />

            <br />



            <br />

            <IonButton onClick={async() => await handleSubmit()}>Submit</IonButton>
          </form>

          :
          <>
            <br />
            <h2 className='ion-text-center'>You must be an admin or organizer to submit an event or attraction!</h2>
          </>
        }
      </IonContent>
    </IonPage>
  );
};

export default EventForm;

