import { useEffect, useRef, useState } from "react";
import {
  IonPage,
  IonContent,
  IonInput,
  IonButton,
  IonLabel,
  IonDatetime,
  IonTextarea,
  IonTitle,
  IonItem,
  IonList,
  useIonLoading,
  IonChip,
  IonIcon,
  IonModal,
  IonButtons,
  IonHeader,
  IonToolbar,
  IonLoading,
  IonCard,
  useIonViewWillEnter,
  useIonRouter,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
} from "@ionic/react";
import { HumspotAttraction } from "../utils/types";
import { useContext } from "../utils/my-context";
import { useToast } from "@agney/ir-toast";
import { Map, Marker } from "pigeon-maps";
import {
  cameraOutline,
  chevronBackOutline,
  chevronDownOutline,
  mapOutline,
} from "ionicons/icons";
import {
  handleSubmitAttractionForApproval,
  handleUploadEventImages,
} from "../utils/server";
import { Camera, CameraResultType } from "@capacitor/camera";
import GoBackHeader from "../components/Shared/GoBackHeader";
import { navigateBack } from "../components/Shared/BackButtonNavigation";

const attractionTags: string[] = [
  "Beach",
  "Hiking",
  "Camping",
  "Fishing",
  "Sightseeing",
  "Swimming",
  "Kayaking",
  "Canoeing",
  "Boating",
  "Biking",
  "Hunting",
  "Wildlife",
  "Birding",
  "Photography",
  "Scenic",
  "Historic",
  "Museum",
  "Cultural",
  "Food",
  "Shopping",
  "Winery",
  "Brewery",
  "Distillery",
  "Golf",
  "Skiing",
  "Snowboarding",
  "Snowmobiling",
  "Snowshoeing",
  "Cross Country Skiing",
];

async function canDismiss(data?: any, role?: string) {
  return role !== "gesture";
}

const PHOTO_UPLOAD_LIMIT: number = 5;

const SubmitAttractionPage = () => {
  const context = useContext();
  const Toast = useToast();
  const router = useIonRouter();
  const [present, dismiss] = useIonLoading();

  const mapModalRef = useRef<HTMLIonModalElement | null>(null);

  const nameRef = useRef<HTMLIonInputElement | null>(null);
  const descRef = useRef<HTMLIonTextareaElement | null>(null);
  const locationRef = useRef<HTMLIonInputElement | null>(null);
  const websiteUrlRef = useRef<HTMLIonInputElement | null>(null);
  const openTimesRef = useRef<HTMLIonInputElement | null>(null);


  const refs = [nameRef, descRef, locationRef];

  const [photos, setPhotos] = useState<string[] | undefined>(undefined);
  const [blobs, setBlobs] = useState<Blob[] | null>(null);
  const [addressValidating, setAddressValidating] = useState<boolean>(false);
  const [location, setLocation] = useState<string>("");
  const [zoom, setZoom] = useState(15);
  const [center, setCenter] = useState<[number, number]>([
    40.87649434150835, -124.07918370203882,
  ]);
  const [mapPinLatLong, setMapPinLatLong] = useState<[number, number] | null>(
    null
  );
  const [visibleTags, setVisibleTags] = useState<string[]>(
    attractionTags.slice(0, 20)
  );
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const showMoreTags = () => {
    const nextTags = attractionTags.slice(
      visibleTags.length,
      visibleTags.length + 20
    );
    setVisibleTags([...visibleTags, ...nextTags]);
  };

  const isFormValid = () => {
    return refs.every(
      (ref) =>
        ref.current &&
        ref.current.value &&
        (ref.current.value as string).trim() !== ""
    );
  };

  const getLatLong = async (
    address: string
  ): Promise<{ latitude: number; longitude: number } | undefined> => {
    if (address.length <= 0) {
      const t = Toast.create({
        message: "Please provide a location",
        duration: 2000,
        color: "danger",
      });
      t.present();
      throw new Error("No Address found!");
    }

    const url = `https://geocode.maps.co/search?q=${encodeURIComponent(
      address
    )}`;
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
    present({ message: "Loading..." });
    const images = await Camera.pickImages({
      quality: 90,
      limit: 5,
    });

    if (!images || !images.photos) {
      dismiss();
      return;
    }
    setPhotos([]);
    setBlobs([]);
    let blobArr: Blob[] = [];
    let photoArr: string[] = [];
    let limit: number =
      images.photos.length > PHOTO_UPLOAD_LIMIT
        ? PHOTO_UPLOAD_LIMIT
        : images.photos.length;
    for (let i = 0; i < limit; ++i) {
      const image = images.photos[i];
      console.log(image);
      if (!image.webPath) {
        const toast = Toast.create({
          message: "Something went wrong with one or more of the photos",
          duration: 2000,
          color: "danger",
        });
        toast.present();
      }
      const res = await fetch(image.webPath!);
      const blobRes = await res.blob();
      if (blobRes) {
        if (blobRes.size > 15_000_000) {
          // 15 MB
          const toast = Toast.create({
            message: "Image " + (i + 1) + " too large",
            duration: 2000,
            color: "danger",
          });
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
  };

  const handleSubmit = async () => {
    if (!context.humspotUser || !context.humspotUser.userID) return;
    if (!isFormValid()) {
      const t = Toast.create({
        message: "Please fill out all input fields!",
        duration: 2000,
        color: "danger",
      });
      t.present();
      return;
    }

    present({ message: "Submitting attraction..." });

    let uploadedPhotoUrls: string[] = [];
    if (blobs) {
      const res = await handleUploadEventImages(blobs); // might need to change this to handleUploadAttractionImages
      if (!res.success) {
        const t = Toast.create({
          message: "Photos failed to upload, reload the page to try again",
          duration: 2000,
          color: "danger",
        });
        t.present();
      } else {
        uploadedPhotoUrls = res.photoUrls;
      }
    }


    const attraction: HumspotAttraction = {
      name: nameRef?.current?.value! as string,
      description: descRef?.current?.value! as string,
      location: locationRef?.current?.value! as string,
      websiteURL: (websiteUrlRef?.current?.value! as string) ?? "",
      addedByUserID: context.humspotUser.userID,
      openTimes: (openTimesRef?.current?.value! as string) ?? null,
      latitude: mapPinLatLong ? mapPinLatLong[0] : null,
      longitude: mapPinLatLong ? mapPinLatLong[1] : null,
      organizer: context.humspotUser.username ?? "",
      tags: selectedTags,

      photoUrls: uploadedPhotoUrls,
    };

    const response = await handleSubmitAttractionForApproval(attraction);

    let color = "danger";
    if (response.success) {
      color = "success";
    }
    const t = Toast.create({
      message: response.message,
      duration: 2000,
      color: color,
    });
    t.present();

    dismiss();
  }

  const handleAddressValidation = async () => {
    if (!locationRef || !locationRef.current || !locationRef.current.value)
      return;
    setAddressValidating(true);
    let latLong = await getLatLong(locationRef.current.value as string);
    if (!latLong) {
      const t = Toast.create({
        message: "Address not found, place pin on map",
        duration: 2000,
        color: "warning",
      });
      t.present();
    } else {
      const t = Toast.create({
        message: "Address found, validate location on map",
        duration: 2000,
        color: "success",
      });
      t.present();
      setCenter([latLong.latitude, latLong.longitude]);
      setMapPinLatLong([latLong.latitude, latLong.longitude]);
    }
    setAddressValidating(false);
  };

  useIonViewWillEnter(() => {
    context.setShowTabs(false);
  }, []);

  useEffect(() => {
    const eventListener: any = (ev: CustomEvent<any>) => {
      ev.detail.register(20, () => {
        navigateBack(router, false);
      });
    };

    document.addEventListener("ionBackButton", eventListener);

    return () => {
      document.removeEventListener("ionBackButton", eventListener);
    };
  }, [router]);

  return (
    <IonPage>
      <IonContent>
        <GoBackHeader title="Submit Attraction" />

        {context.humspotUser?.accountType !== "user" ? (
          <>
            <div
              style={{
                background: "var(--ion-background-color)",
                padding: "5px",
              }}
            >
              <IonItem
                style={{ "--background": "var(--ion-background-color)" }}
                lines="full"
              >
                <IonLabel position="stacked">Name</IonLabel>
                <IonInput
                  aria-label="Name"
                  style={{ marginTop: "5px" }}
                  ref={nameRef}
                  placeholder="Humboldt Redwoods State Park"
                />
              </IonItem>
              <br />
              <IonItem
                style={{ "--background": "var(--ion-background-color)" }}
                lines="full"
              >
                <IonLabel position="stacked">Description</IonLabel>
                <IonTextarea
                  maxlength={500}
                  rows={3}
                  ref={descRef}
                  placeholder="Humboldt Redwoods State Park is a state park of California"
                />
              </IonItem>
              <br />
              <IonItem
                style={{ "--background": "var(--ion-background-color)" }}
                lines="full"
              >
                <IonLabel position="stacked">Website</IonLabel>
                <IonInput
                  aria-label="Website"
                  style={{ marginTop: "5px" }}
                  ref={websiteUrlRef}
                  placeholder="https://www.parks.ca.gov/?page_id=425"
                />
              </IonItem>
              <br />
              <IonItem
                lines="full"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "stretch",
                  "--background": "var(--ion-background-color)",
                }}
              >
                <IonLabel position="stacked">Location / Address</IonLabel>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <IonInput
                    aria-label="Location / Address"
                    ref={locationRef}
                    placeholder="1 Harpst St, Arcata CA"
                    onIonInput={(e) => {
                      setLocation(e.detail.value ?? "");
                    }}
                    style={{
                      flexGrow: 1,
                      marginRight: "10px",
                      marginTop: "5px",
                    }}
                  />
                  <IonButton
                    color="secondary"
                    id="address-verification"
                    disabled={!location}
                  >
                    <IonIcon icon={mapOutline} />
                  </IonButton>
                </div>
              </IonItem>
              <br />
              <IonItem
                style={{ "--background": "var(--ion-background-color)" }}
                lines="full"
              >
                <IonLabel position="stacked">Open Times</IonLabel>
                <IonInput
                  aria-label="Open Time"
                  style={{ marginTop: "5px" }}
                  ref={openTimesRef}
                  placeholder="9AM - 5PM"
                />
              </IonItem>
              <br />
              <IonItem
                style={{ "--background": "var(--ion-background-color)" }}
                lines="full"
              >
                <IonLabel position="stacked">Photos</IonLabel>
                <div style={{ height: "1vh" }} />
                {photos &&
                  photos.length > 0 &&
                  photos.map((url: string, index: number) => {
                    return (
                      <div key={index}>
                        <IonCard className="ion-no-margin">
                          <img src={url} />
                        </IonCard>
                        <br />
                      </div>
                    );
                  })}
                <IonCard
                  button
                  onClick={handleSelectImages}
                  style={{
                    position: "relative",
                    textAlign: "center",
                    height: "100px",
                    width: "100px",
                    marginLeft: "-1.5px",
                  }}
                >
                  <br />
                  <IonCardContent>
                    <IonIcon
                      icon={cameraOutline}
                      style={{
                        fontSize: "40px",
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                      }}
                    />
                  </IonCardContent>
                  <IonCardHeader>
                    <p
                      className="ion-no-padding ion-no-margin"
                      style={{ fontSize: "1rem" }}
                    >
                      {photos && photos.length > 0 ? "Change" : "Add"}
                    </p>
                  </IonCardHeader>
                </IonCard>
              </IonItem>
              <br />
              <IonItem
                style={{ "--background": "var(--ion-background-color)" }}
                lines="full"
              >
                <IonLabel position="stacked">Tags</IonLabel>
              </IonItem>
              <div style={{ paddingRight: "5px", paddingLeft: "5px" }}>
                {visibleTags.map((tag) => (
                  <IonChip
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    color={selectedTags.includes(tag) ? "secondary" : "light"}
                  >
                    <IonLabel>{tag}</IonLabel>
                  </IonChip>
                ))}
                {visibleTags.length < attractionTags.length && (
                  <div
                    style={{
                      display: "flex",
                      marginLeft: "25vw",
                      marginRight: "25vw",
                    }}
                  >
                    <IonButton
                      color="secondry"
                      fill="clear"
                      onClick={showMoreTags}
                    >
                      {" "}
                      &nbsp;&nbsp;Show More &nbsp;
                      <IonIcon icon={chevronDownOutline} />
                    </IonButton>
                  </div>
                )}
              </div>

              <IonButton
                color="secondary"
                expand="block"
                style={{ padding: "10px" }}
                onClick={async () => await handleSubmit()}
              >
                Submit
              </IonButton>
              <br />
            </div>
          </>
        ) : (
          <div className="ion-text-center access-denied-message">
            You must be an admin or organizer to submit an event or
            attraction!
          </div>
        )}

        <IonModal
          ref={mapModalRef}
          canDismiss={canDismiss}
          onIonModalWillPresent={handleAddressValidation}
          trigger="address-verification"
          handle={false}
        >
          <IonContent fullscreen>
            <IonLoading isOpen={addressValidating} />
            <IonHeader className="ion-no-border">
              <IonToolbar style={{ "--background": "black" }}>
                <IonButtons>
                  <IonButton
                    style={{ fontSize: "1.25em", marginLeft: "5px" }}
                    onClick={() => {
                      mapModalRef &&
                        mapModalRef.current &&
                        mapModalRef.current.dismiss();
                    }}
                  >
                    <IonIcon icon={chevronBackOutline} />
                  </IonButton>
                  <IonTitle>Map Pin Selection</IonTitle>
                </IonButtons>
              </IonToolbar>
            </IonHeader>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
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
                  {mapPinLatLong && (
                    <Marker
                      width={40}
                      anchor={[mapPinLatLong[0], mapPinLatLong[1]]}
                    ></Marker>
                  )}
                </Map>
              </div>
              {!addressValidating && locationRef?.current?.value && (
                <div
                  style={{
                    margin: "10px",
                    width: "100%",
                    textAlign: "center",
                  }}
                >
                  <p style={{ fontSize: "16px", fontWeight: "500" }}>
                    Address Entered: {locationRef.current.value}
                  </p>
                </div>
              )}
              <IonButton
                expand="block"
                color="danger"
                style={{ padding: "5px" }}
                onClick={() => {
                  setMapPinLatLong(null);
                  mapModalRef?.current?.dismiss();
                }}
              >
                Do Not Use Precise Location
              </IonButton>
              <IonButton
                expand="block"
                style={{ padding: "5px" }}
                onClick={() => {
                  mapModalRef?.current?.dismiss();
                }}
              >
                Save Location
              </IonButton>
            </div>
          </IonContent>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default SubmitAttractionPage; 