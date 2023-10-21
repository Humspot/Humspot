import React, { useState } from 'react';
import { IonPage, IonContent, IonInput, IonButton, IonLabel, IonDatetime, IonTextarea, IonTitle } from '@ionic/react';
import { HumspotEvent } from '../utils/types';
import { useContext } from '../utils/my-context';
import { timeout } from '../utils/timeout';
import { useToast } from '@agney/ir-toast';

export const SubmitEventPage: React.FC = () => {

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
  });

  const handleChange = (field: keyof HumspotEvent) => (e: CustomEvent) => {
    setEvent({ ...event, [field]: e.detail.value });
  };

  const handleSubmit = async () => {
    if (!context.humspotUser || !context.humspotUser.userID) return;

    timeout(1000).then(() => {
      const t = Toast.create({ message: "Event submitted!", duration: 2000, color: "dark" });
      t.present();
    });

  };

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

            <IonLabel>Tags (comma separated):</IonLabel>
            <IonInput value={event.tags.join(',')} onIonChange={handleChange('tags')} placeholder="fun, adventure, nature" />



            <br />

            <IonButton onClick={handleSubmit}>Submit</IonButton>
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

export default SubmitEventPage;