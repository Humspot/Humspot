import React, { useState } from 'react';
import { IonPage, IonContent, IonInput, IonButton, IonLabel, IonDatetime, IonTextarea, IonTitle, IonItem, IonList, IonToast, InputChangeEventDetail, IonSegment, IonSegmentButton } from '@ionic/react';
import { HumspotEvent } from '../utils/types';
import { useContext } from '../utils/my-context';
import { timeout } from '../utils/timeout';
import { useToast } from '@agney/ir-toast';
import { handleAddEvent, handleSubmitEventForApproval } from '../utils/server';
import './EventForm.css'; // Importing the custom CSS
import { Map, Marker } from "pigeon-maps"; // Importing the map component

export const EventForm = () => {

  const context = useContext();
  const Toast = useToast();
  const [addressValidated, setAddressValidated] = useState<boolean>(false);
  const [zoom, setZoom] = useState(15);
  const [center, setCenter] = useState<[number, number]>([40.87649434150835, -124.07918370203882]);
  const [mapPinLatLong, setMapPinLatLong] = useState<[number, number] | null>(null);

  const [event, setEvent] = useState<HumspotEvent>({
    name: '',
    description: '',
    location: '',
    addedByUserID: '', // This should probably come from context or user session
    date: '',
    time: '',
    latitude: null,
    longitude: null,
    organizer: '',
    tags: [],
    photoUrls: [],
    websiteURL: null,
  });

  const handleChange = (field: keyof HumspotEvent) => (e: CustomEvent) => {
    let value: any = e.detail.value;

    // Special handling for photoUrls as an array
    if (field === 'photoUrls' && typeof value === 'string') {
      value = value ? [value] : [];
    }

    // Update the event state
    setEvent({ ...event, [field]: value });
  };

  const getLatLong = async (address: string): Promise<{ latitude: number; longitude: number; } | undefined> => {
    if (address.length <= 0) {
      const t = Toast.create({ message: 'Please provide a location', duration: 2000, color: 'danger' });
      t.present();
      throw new Error("No Address found!")
    };

    const url = `https://geocode.maps.co/search?q=${encodeURIComponent(address)}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    if (data.length === 0) {
      return;
    }
    return {
      latitude: parseFloat(data[0].lat),
      longitude: parseFloat(data[0].lon),
    };
  };

  // 
  const handleSubmit = async () => {
    // should add in more robust error notification to the user, possibly a toast message or something  
    if (!context.humspotUser || !context.humspotUser.userID) return;
    if (!addressValidated) {
      const t = Toast.create({ message: 'Please validate provided description', duration: 2000, color: 'danger' });
      t.present();
      return;
    }

    if (!event.name || !event.description) {
      const t = Toast.create({ message: 'Please fill out all input fields!', duration: 2000, color: 'danger' });
      t.present();
      return;
    }

    let eventCopy = event;
    if (mapPinLatLong) {
      eventCopy.latitude = mapPinLatLong[0];
      eventCopy.longitude = mapPinLatLong[1];
    }

    eventCopy.addedByUserID = context.humspotUser.userID;
    eventCopy.organizer = context.humspotUser.username ?? '';
    setEvent(eventCopy);
    const response = await handleSubmitEventForApproval(eventCopy);
    console.log(response);

    // Display toast on successful submission
    let color = "danger";

    if (response.success) {
      color = "success";
    }

    const t = Toast.create({ message: response.message, duration: 2000, color: color });
    t.present();
  }

  const handleAddressValidation = async () => {
    let latLong = await getLatLong(event.location);
    if (!latLong) {
      const t = Toast.create({ message: 'Address not found, place pin on map', duration: 2000, color: 'warning' });
      t.present();
    } else {
      const t = Toast.create({ message: 'Address found, validate location on map', duration: 2000, color: 'success' });
      t.present();
      setCenter([latLong.latitude, latLong.longitude]);
      setMapPinLatLong([latLong.latitude, latLong.longitude]);
    }
    setAddressValidated(true);
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

              <>
                <IonItem>
                  <IonLabel position="floating">Location/Address</IonLabel>
                  <IonInput value={event.location} onIonChange={handleChange('location')} placeholder="Enter Location" />
                  <IonButton onClick={() => { handleAddressValidation() }}>Validate Address</IonButton>
                </IonItem>
              </>

              <>
                <IonItem>
                  <IonLabel position="floating">Drop pin(optional)</IonLabel>
                  <div style={{ position: 'relative' }}>
                    <Map
                      maxZoom={14}
                      height={300}
                      width={300}
                      attribution={false}
                      zoom={zoom}
                      center={center}
                      onClick={(e) => {
                        setMapPinLatLong(e.latLng);
                      }}
                      onBoundsChanged={({ center, zoom }) => {
                        setCenter(center);
                        setZoom(zoom);
                      }}
                    >
                      {mapPinLatLong &&
                        <Marker width={40} anchor={[mapPinLatLong[0], mapPinLatLong[1]]}></Marker>
                      }
                    </Map>
                    {!addressValidated &&
                      <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        fontSize: '20px'
                      }}>
                        <IonTitle color='primary'>Enter a Location First</IonTitle>
                      </div>
                    }
                  </div>
                </IonItem>


              </>
              <br></br>
              <IonItem>
                <IonLabel>Date & Time</IonLabel>
                <IonDatetime onIonChange={handleChange('date')} placeholder="Select Date" />
              </IonItem>

              <IonItem>
                <IonInput value={event.photoUrls ? event.photoUrls[0] : ''}
                  onIonChange={handleChange('photoUrls')} placeholder="Enter Photo URL" />
              </IonItem>

              <IonItem>
                <IonInput value={event.websiteURL || ''} onIonChange={handleChange('websiteURL')} placeholder="Enter Website URL" />
              </IonItem>

              <IonItem>
                <IonLabel>Organizer</IonLabel>
                <IonInput value={context.humspotUser?.username ?? ''} disabled placeholder="Organizer Name" />
              </IonItem>
            </IonList>

            <IonButton expand="block" onClick={async () => await handleSubmit()}>Submit</IonButton>

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
/*
if user inputs a valid location, update the map pin to that location
else user inputs a location that does not have a valid lat/long, then do nothing
*/ 