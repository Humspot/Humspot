import {
  IonAvatar,
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonChip,
  IonContent,
  IonHeader,
  IonIcon,
  IonImg,
  IonLabel,
  IonPage,
  IonText,
} from "@ionic/react";
import { RouteComponentProps } from "react-router-dom";
import { useParams } from "react-router-dom";
import "./attraction.css";
import { Map, Marker } from "pigeon-maps";
import {
  compass,
  mapOutline,
  pin,
  star,
  starOutline,
  time,
} from "ionicons/icons";
import { useCallback, useEffect, useState } from "react";
import { handleGetEvent } from "../server";
import { useContext } from "../my-context";

export function LocationMap(props: any) {
  console.log(props);
  return (
    <Map
      defaultCenter={[parseFloat(props.latitude), parseFloat(props.longitude)]}
      defaultZoom={12}
      minZoom={12}
      maxZoom={12}
      height={150}
      width={150}
      attribution={false}
      mouseEvents={false}
      touchEvents={false}
    >
      <Marker
        width={30}
        height={30}
        anchor={[parseFloat(props.latitude), parseFloat(props.longitude)]}
      />
    </Map>
  );
}

function AttractionPage() {
  const { id, imgsrc }: any = useParams();
  const context = useContext();
  const imgStyle = {
    width: "100%", // Ensure the image takes up the full width of the container
    height: "30vh", // Ensure the image takes up the full height of the container
    objectFit: "cover", // Crop and fit the image within the container
    position: "absolute",
  };
  const [activity, setActivity] = useState<any>(null);
  const handleGetEventCallback = useCallback(async (id: string) => {
    const res = await handleGetEvent(id);
    if ("event" in res && res.event) setActivity(res.event);
  }, []);
  useEffect(() => {
    if (id) handleGetEventCallback(id);
  }, [id]);
  return (
    <>
      <IonPage>
        <IonContent>
          {/* Favorites Button */}
          <IonButton
            className="FavoritesButton"
            fill="clear"
            color={"secondary"}
            size="large"
            id="FavoritesButton"
          >
            <IonIcon slot="icon-only" icon={starOutline}></IonIcon>
          </IonButton>
          {/* Visited Button for Locations */}
          <IonButton
            className="VisitedButton"
            fill="clear"
            color={"secondary"}
            size="large"
            id="VisitedButton"
          >
            <IonIcon slot="icon-only" icon={mapOutline}></IonIcon>
          </IonButton>
          <IonImg
            alt="Attraction Image"
            src="https://source.unsplash.com/random/?forest,day"
            className="MainCarouselEntryHeaderImage"
            style={imgStyle as any}
          ></IonImg>
          <IonCard color={"primary"} className="headercard">
            <IonCardHeader>
              {activity && <h1>{activity.name}</h1>}
            </IonCardHeader>
          </IonCard>
          <IonChip color={"secondary"}>Campus</IonChip>
          <IonChip color={"secondary"}>Hike</IonChip>
          <IonChip color={"secondary"}>Forest</IonChip>
          <IonCard>
            <IonCardContent className="locationcard">
              <IonText className="locationlabel">
                <IonIcon icon={compass} size="small"></IonIcon>
                <h2>{activity?.location ?? ""}</h2>

                <IonIcon icon={time} size="small"></IonIcon>

                <h3>{activity?.date ?? ""}</h3>
                <h3>{activity?.time ?? ""}</h3>
              </IonText>

              <div className="locationmap">
                {activity && (
                  <LocationMap
                    latitude={activity.latitude}
                    longitude={activity.longitude}
                  />
                )}
              </div>
            </IonCardContent>
          </IonCard>
          <IonCard>
            <IonCardContent>
              <p>{activity?.description ?? ""}</p>
            </IonCardContent>
          </IonCard>
          {/* Comments Section */}
          <IonCard>
            <IonCardHeader>
              <h3>Comments</h3>
            </IonCardHeader>
            <IonCard className="commentbox">
              <IonAvatar>
                <img
                  alt="Silhouette of a person's head"
                  src="https://ionicframework.com/docs/img/demos/avatar.svg"
                />
              </IonAvatar>
              <IonCardContent>This place is SO FUN!!!</IonCardContent>
            </IonCard>
            <IonCard className="commentbox">
              <IonAvatar>
                <img
                  alt="Silhouette of a person's head"
                  src="https://ionicframework.com/docs/img/demos/avatar.svg"
                />
              </IonAvatar>
              <IonCardContent>This place SUCKS!!!</IonCardContent>
            </IonCard>
            <IonCard className="commentbox">
              <IonAvatar>
                <img
                  alt="Silhouette of a person's head"
                  src="https://ionicframework.com/docs/img/demos/avatar.svg"
                />
              </IonAvatar>
              <IonCardContent>
                I have no strong feelings one way or the other.
              </IonCardContent>
            </IonCard>
          </IonCard>
        </IonContent>
      </IonPage>
    </>
  );
}

export default AttractionPage;
