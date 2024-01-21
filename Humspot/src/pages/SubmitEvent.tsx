

import { useRef, useState } from 'react';
import {
  IonPage, IonContent, IonInput, IonButton, IonLabel, IonDatetime, IonTextarea, IonTitle, IonItem,
  useIonLoading, IonChip, IonIcon, IonModal, IonButtons, IonHeader, IonToolbar, IonLoading, IonCard, useIonViewWillEnter, IonCardContent, IonCardHeader, IonAlert, useIonRouter
} from '@ionic/react';
import { HumspotEvent } from '../utils/types';
import { useContext } from '../utils/hooks/useContext';
import { useToast } from '@agney/ir-toast';
import { handleSubmitEventForApproval, handleUploadSubmissionImages } from '../utils/server';
import { Map, Marker } from "pigeon-maps";
import { addOutline, cameraOutline, chevronDownOutline, mapOutline } from 'ionicons/icons';
import { Camera, CameraResultType } from '@capacitor/camera';
import GoBackHeader from '../components/Shared/GoBackHeader';

import { canDismiss } from '../utils/functions/canDismiss';


const eventTags: string[] = [
  "Fun",
  "Adventure",
  "Relax",
  "Chill",
  "Music",
  "Festival",
  "Food",
  "School",
  "Hiking",
  "Beach",
  "Educational",
  "Cultural",
  "Art",
  "Dance",
  "Nature",
  "Outdoor",
  "Indoor",
  "Fitness",
  "Yoga",
  "Meditation",
  "Technology",
  "Science",
  "Networking",
  "Business",
  "Entrepreneurship",
  "Community",
  "Charity",
  "Volunteering",
  "Health",
  "Wellness",
  "Cooking",
  "Baking",
  "Crafts",
  "DIY",
  "Workshop",
  "Lecture",
  "Seminar",
  "Conference",
  "TradeShow",
  "Exhibition",
  "Theatre",
  "Cinema",
  "Movies",
  "Comedy",
  "Drama",
  "Romance",
  "SciFi",
  "Fantasy",
  "Horror",
  "Thriller",
  "Mystery",
  "Family",
  "Kids",
  "Teens",
  "Adults",
  "Seniors",
  "Pets",
  "Animals",
  "Gardening",
  "Environment",
  "Sustainability",
  "Politics",
  "History",
  "Literature",
  "Poetry",
  "Writing",
  "Journalism",
  "Photography",
  "Film",
  "Animation",
  "VideoGames",
  "Esports",
  "BoardGames",
  "CardGames",
  "RolePlaying",
  "Fashion",
  "Beauty",
  "Makeup",
  "Skincare",
  "Haircare",
  "Shopping",
  "Auction",
  "Sale",
  "Fundraising",
  "Donations",
  "Spirituality",
  "Religion",
  "Philosophy",
  "Astrology",
  "Travel",
  "Tourism",
  "Sports",
  "Snow",
  "Automotive",
  "Cycling",
  "Running",
];

const PHOTO_UPLOAD_LIMIT: number = 5;

export const EventForm = () => {

  const context = useContext();
  const router = useIonRouter();
  const Toast = useToast();
  const [present, dismiss] = useIonLoading();

  const pageRef = useRef(null);
  const mapModalRef = useRef<HTMLIonModalElement | null>(null);

  const nameRef = useRef<HTMLIonInputElement | null>(null);
  const descRef = useRef<HTMLIonTextareaElement | null>(null);
  const locationRef = useRef<HTMLIonInputElement | null>(null);
  const dateTimeRef = useRef<HTMLIonDatetimeElement | null>(null);
  const websiteUrlRef = useRef<HTMLIonInputElement | null>(null);

  const refs = [nameRef, descRef, locationRef, dateTimeRef];

  const [photos, setPhotos] = useState<string[] | undefined>(undefined);
  const [blobs, setBlobs] = useState<Blob[] | null>(null);
  const [addressValidating, setAddressValidating] = useState<boolean>(false);
  const [location, setLocation] = useState<string>("");
  const [zoom, setZoom] = useState(15);
  const [center, setCenter] = useState<[number, number]>([40.87649434150835, -124.07918370203882]);
  const [mapPinLatLong, setMapPinLatLong] = useState<[number, number] | null>(null);
  const [visibleTags, setVisibleTags] = useState<string[]>(eventTags.slice(0, 20));
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const showMoreTags = () => {
    const nextTags = eventTags.slice(visibleTags.length, visibleTags.length + 20);
    setVisibleTags([...visibleTags, ...nextTags]);
  };

  const addNewTag = (tag: string) => {
    if (!tag) return;
    for (let i = 0; i < visibleTags.length; i++) {
      if (visibleTags[i].toLowerCase().trim() === tag.toLowerCase().trim()) {
        const t = Toast.create({ message: `${tag} already in list!`, position: 'bottom', duration: 2000, color: 'danger' });
        t.present();
        return;
      }
    }
    setVisibleTags([tag, ...visibleTags]);
  }

  const isFormValid = () => {
    return refs.every(ref => ref.current && ref.current.value && (ref.current.value as string).trim() !== '');
  };

  const getLatLong = async (address: string): Promise<{ latitude: number; longitude: number; } | undefined> => {
    if (address.length <= 0) {
      const t = Toast.create({ message: 'Please provide a location', position: 'bottom', duration: 2000, color: 'danger' });
      t.present();
      throw new Error("No Address found!")
    };

    const url = `https://geocode.maps.co/search?q=${encodeURIComponent(address)}`;
    const response = await fetch(url);

    if (!response.ok) {
      return;
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

  const handleSelectImages = async () => {
    const images = await Camera.pickImages({
      quality: 90,
      limit: 5,
      presentationStyle: 'popover'
    });

    if (!images || !images.photos) { dismiss(); return; }
    present({ message: "Loading..." });
    setPhotos([]);
    setBlobs([]);
    let blobArr: Blob[] = [];
    let photoArr: string[] = [];
    let limit: number = images.photos.length > PHOTO_UPLOAD_LIMIT ? PHOTO_UPLOAD_LIMIT : images.photos.length;
    for (let i = 0; i < limit; ++i) {
      const image = images.photos[i];
      console.log(image);
      if (!image.webPath) {
        const toast = Toast.create({ message: 'Something went wrong with one or more of the photos', position: 'bottom', duration: 2000, color: 'danger' });
        toast.present();
      }
      const res = await fetch(image.webPath!);
      const blobRes = await res.blob();
      if (blobRes) {
        if (blobRes.size > 15_000_000) { // 15 MB
          const toast = Toast.create({ message: 'Image ' + (i + 1) + ' too large', position: 'bottom', duration: 2000, color: 'danger' });
          toast.present();
        } else {
          blobArr.push(blobRes);
          photoArr.push(image.webPath!);
        }
      }
    }
    setBlobs(blobArr);
    setPhotos(photoArr);
    dismiss();
  }

  const handleSubmit = async () => {
    if (!context.humspotUser || !context.humspotUser.userID) return;
    if (!isFormValid()) {
      const t = Toast.create({ message: 'Please fill out all input fields!', position: 'bottom', duration: 2000, color: 'danger' });
      t.present();
      return;
    }

    present({ message: "Submitting event..." });

    let uploadedPhotoUrls: string[] = [];
    if (blobs) {
      const res = await handleUploadSubmissionImages(blobs, 'event-photos');
      if (!res.success) {
        const t = Toast.create({ message: "Photos failed to upload, reload the page to try again", position: 'bottom', duration: 2000, color: 'danger' });
        t.present();
      } else {
        uploadedPhotoUrls = res.photoUrls;
      }
    }

    const selectedDateTime = new Date(dateTimeRef?.current?.value as string);

    const event: HumspotEvent = {
      name: nameRef?.current?.value! as string,
      description: descRef?.current?.value! as string,
      location: locationRef?.current?.value! as string,
      websiteURL: websiteUrlRef?.current?.value! as string,
      addedByUserID: context.humspotUser.userID,
      latitude: mapPinLatLong ? mapPinLatLong[0] : null,
      longitude: mapPinLatLong ? mapPinLatLong[1] : null,
      organizer: context.humspotUser.username ?? '',
      tags: selectedTags,
      date: selectedDateTime.toISOString().split('T')[0],
      time: selectedDateTime.toTimeString().split(' ')[0],
      photoUrls: uploadedPhotoUrls
    }

    const response = await handleSubmitEventForApproval(event);

    let color = "danger";
    if (response.success) {
      color = "success";
    }
    const t = Toast.create({ message: response.message, position: 'bottom', duration: 2000, color: color });
    t.present();

    await dismiss();
    router.goBack();
  }

  const handleAddressValidation = async () => {
    if (!locationRef || !locationRef.current || !locationRef.current.value) return;
    setAddressValidating(true);
    let latLong = await getLatLong(locationRef.current.value as string);
    if (!latLong) {
      const t = Toast.create({ message: 'Address not found, place pin on map', position: 'bottom', duration: 2000, color: 'warning' });
      t.present();
    } else {
      const t = Toast.create({ message: 'Address found, validate location on map', position: 'bottom', duration: 2000, color: 'success' });
      t.present();
      setCenter([latLong.latitude, latLong.longitude]);
      setMapPinLatLong([latLong.latitude, latLong.longitude]);
    }
    setAddressValidating(false);
  };

  useIonViewWillEnter(() => {
    context.setShowTabs(false);
  }, []);

  return (
    <IonPage ref={pageRef}>
      <GoBackHeader title="Submit Event" />
      <IonContent fullscreen>

        {context.humspotUser && context.humspotUser.accountType !== 'user' ?
          <>
            <div style={{ background: 'var(--ion-background-color)', padding: '5px' }}>
              <IonItem style={{ '--background': 'var(--ion-background-color)' }} lines='full'>
                <IonLabel position='stacked'>Name</IonLabel>
                <IonInput aria-label="Name" style={{ marginTop: "5px" }} ref={nameRef} placeholder="Cal Poly Humboldt - Grad Party" />
              </IonItem>
              <br />
              <IonItem style={{ '--background': 'var(--ion-background-color)' }} lines='full'>
                <IonLabel position='stacked'>Description</IonLabel>
                <IonTextarea maxlength={500} rows={3} ref={descRef} placeholder="This event will be super fun! Graduates + family are invited to this special event. Visit our site for more info." />
              </IonItem>
              <br />
              <IonItem lines="full" style={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', '--background': 'var(--ion-background-color)' }}>
                <IonLabel position="stacked">Location / Address</IonLabel>
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                  <IonInput
                    aria-label="Location / Address"
                    ref={locationRef}
                    placeholder="1 Harpst St, Arcata CA"
                    onIonInput={(e) => { setLocation(e.detail.value ?? '') }}
                    style={{ flexGrow: 1, marginRight: '10px', marginTop: '5px' }}
                  />
                  <IonButton color='secondary' id='address-verification' disabled={!location}>
                    <IonIcon icon={mapOutline} />
                  </IonButton>
                </div>
              </IonItem>
              <br />
              <IonItem onClick={() => { }} className='no-ripple' style={{ '--background': 'var(--ion-background-color)' }} lines='full'>
                <IonLabel position='stacked'>Date and Time</IonLabel>
                <IonDatetime color='secondary' mode='ios' yearValues="2023,2024,2025,2026,2027,2028,2029,2030" style={{ marginTop: "20px" }} ref={dateTimeRef} min={(new Date()).toISOString()} />
              </IonItem>
              <br />
              <IonItem style={{ '--background': 'var(--ion-background-color)' }} lines='full'>
                <IonLabel position='stacked'>Website <i>(Optional)</i></IonLabel>
                <IonInput aria-label="Website" style={{ marginTop: "5px" }} ref={websiteUrlRef} placeholder="https://www.google.com" />
              </IonItem>
              <br />
              <IonItem style={{ '--background': 'var(--ion-background-color)' }} lines='full'>
                <IonLabel position='stacked'>Photos <i>(Optional)</i></IonLabel>
                <div style={{ height: "1vh" }} />
                {photos && photos.length > 0 &&
                  photos.map((url: string, index: number) => {
                    return (
                      <div key={index}>
                        <IonCard className='ion-no-margin' >
                          <img src={url} />
                        </IonCard>
                        <br />
                      </div>
                    )
                  })
                }
                <IonCard button onClick={handleSelectImages} style={{ position: 'relative', textAlign: 'center', height: "100px", width: "100px", marginLeft: "-1.5px" }}>
                  <br />
                  <IonCardContent>
                    <IonIcon
                      icon={cameraOutline}
                      style={{ fontSize: '40px', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
                    />
                  </IonCardContent>
                  <IonCardHeader>
                    <p className='ion-no-padding ion-no-margin' style={{ fontSize: "1rem" }}>
                      {photos && photos.length > 0 ? 'Change' : 'Add'}
                    </p>
                  </IonCardHeader>
                </IonCard>
              </IonItem>
              <br />
              <IonItem style={{ '--background': 'var(--ion-background-color)', '--min-height': "50px" }} lines='none'>
                <IonLabel position='stacked'>Tags <i>(Optional)</i></IonLabel>
              </IonItem>
              <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', paddingRight: "5px", paddingLeft: "5px" }}>
                <IonButton id='add-custom-tag' className='ion-no-padding' fill='clear'>
                  <IonChip style={{ width: `60px` }}>
                    <IonIcon icon={addOutline} style={{ marginRight: '5px' }} />
                  </IonChip>
                </IonButton>
                {visibleTags.map((tag: string, idx: number) => (
                  <IonChip
                    key={tag + idx}
                    onClick={() => toggleTag(tag)}
                    color={selectedTags.includes(tag) ? "secondary" : "dark"}
                  >
                    <IonLabel>{tag}</IonLabel>
                  </IonChip>
                ))}
                {visibleTags.length < eventTags.length && (
                  <div style={{ display: "flex", marginLeft: "25vw", marginRight: "25vw" }}>
                    <IonButton color='secondry' fill='clear' onClick={showMoreTags}> &nbsp;&nbsp;Show More &nbsp;<IonIcon icon={chevronDownOutline} /></IonButton>
                  </div>
                )}

                <IonAlert
                  style={{ '--background': 'var(--ion-background-color)' }}
                  trigger="add-custom-tag"
                  header="Add custom tag"
                  cssClass='ion-alert-custom-tag'
                  buttons={[
                    {
                      text: 'Cancel',
                      cssClass: 'alert-cancel-button'
                    },
                    {
                      text: 'Add',
                      handler: (data) => {
                        if (data.tag.length > 50) {
                          const t = Toast.create({ message: "Custom tag must not exceed 50 characters", position: 'bottom', duration: 3000, color: "danger" });
                          t.present();
                          return;
                        }
                        if (data.tag.length > 0) {
                          addNewTag(data.tag.trim());
                        }
                      }
                    }
                  ]}
                  inputs={[
                    {
                      name: 'tag',
                      type: 'text',
                      placeholder: 'House Party',
                      max: '50'
                    }
                  ]}
                />

              </div>

              <IonButton color='secondary' expand="block" style={{ padding: "10px" }} onClick={async () => await handleSubmit()}>Submit</IonButton>
              <br />
            </div>

          </>
          : context.humspotUser === null ? (
            <>
              <div className="ion-text-center access-denied-message" style={{ padding: "10px" }}>
                Loading...
              </div>
            </>
          ) : context.humspotUser === undefined ? (
            <div className="ion-text-center access-denied-message" style={{ padding: "10px" }}>
              You must be logged in to submit an event!
            </div>
          ) : (
            <div className="ion-text-center access-denied-message" style={{ padding: "10px" }}>
              You must be an admin or organizer to submit an event! Request to be one <a onClick={() => router.push("/become-a-coordinator")}>here</a>
            </div>
          )
        }

        {context.humspotUser?.accountType !== 'user' &&
          <IonModal ref={mapModalRef} canDismiss={canDismiss} onIonModalWillPresent={handleAddressValidation} trigger='address-verification' handle={false} /* presentingElement={pageRef?.current!} */>
            <IonContent fullscreen>
              <IonLoading isOpen={addressValidating} />
              <IonHeader className='ion-no-border'>
                <IonToolbar>
                  <IonButtons >
                    <IonButton style={{ fontSize: '1.05em', marginLeft: '5px' }} onClick={() => { mapModalRef && mapModalRef.current && mapModalRef.current.dismiss() }}>
                      Close
                    </IonButton>
                    <IonTitle>Map Pin Selection</IonTitle>
                  </IonButtons>
                </IonToolbar>
              </IonHeader>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{}}>
                  <Map
                    maxZoom={14}
                    height={400}
                    width={500}
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
                      <Marker color='var(--ion-color-secondary)' width={40} anchor={[mapPinLatLong[0], mapPinLatLong[1]]}></Marker>
                    }
                  </Map>
                </div>
                {!addressValidating && locationRef?.current?.value &&
                  <div style={{ margin: '10px', width: '100%', textAlign: 'center' }}>
                    <p style={{ fontSize: "16px", fontWeight: "500" }}>
                      Address Entered: <br /> {locationRef.current.value}
                    </p>
                  </div>
                }
                <div style={{ paddingLeft: '10px', paddingRight: '10px' }}>
                  <IonButton
                    expand="block"
                    color="danger"
                    onClick={() => {
                      setMapPinLatLong(null);
                      mapModalRef?.current?.dismiss();
                    }}
                  >
                    Do Not Use Precise Location
                  </IonButton>
                  <IonButton
                    expand="block"
                    onClick={() => {
                      mapModalRef?.current?.dismiss();
                    }}
                  >
                    Save Location
                  </IonButton>
                </div>
              </div>
            </IonContent>
          </IonModal>
        }

      </IonContent>
    </IonPage >
  );
};


export default EventForm;