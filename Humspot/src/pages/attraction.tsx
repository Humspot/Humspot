import {
  IonAvatar,
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonChip,
  IonContent,
  IonHeader,
  IonIcon,
  IonImg,
  IonLabel,
  IonNote,
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
  pinOutline,
  star,
  starOutline,
  time,
  trailSign,
  trailSignOutline,
  walkOutline,
} from "ionicons/icons";
import { useCallback, useEffect, useState } from "react";
import { handleGetEvent } from "../server";
import { useContext } from "../my-context";
import Timestamp from "react-timestamp";
import avatar from "../elements/avatar.svg";

export function LocationMap(props: any) {
  console.log(props);
  return (
    <Map
      defaultCenter={[parseFloat(props.latitude), parseFloat(props.longitude)]}
      defaultZoom={12}
      minZoom={12}
      maxZoom={12}
      height={120}
      width={120}
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
            <IonIcon slot="icon-only" icon={walkOutline}></IonIcon>
          </IonButton>
          <IonImg
            alt="Attraction Image"
            src="https://source.unsplash.com/random/?forest,day"
            className="MainCarouselEntryHeaderImage"
            style={imgStyle as any}
          ></IonImg>
          <IonCard color={"primary"} className="headercard">
            <IonCardHeader>
              <IonCardTitle>
                {activity && <h1>{activity.name}</h1>}
              </IonCardTitle>
            </IonCardHeader>
          </IonCard>
          <div>
            <IonChip color={"secondary"}>{activity?.tags}</IonChip>
          </div>
          <IonCard>
            <IonCardContent className="locationcard">
              <IonText color={"dark"}>
                <div className="locationlabel">
                  <IonIcon icon={compass} size="small"></IonIcon>
                  <h2>{activity?.location ?? ""}</h2>
                </div>
                <div className="locationlabel">
                  <IonIcon icon={time} size="small"></IonIcon>
                  <h2>
                    <Timestamp
                      date={activity?.date ?? ""}
                      options={{ includeDay: true }}
                    ></Timestamp>
                  </h2>
                </div>
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
              <IonText color={"dark"}>
                <p>{activity?.description ?? ""}</p>
              </IonText>
            </IonCardContent>
          </IonCard>
          {/* Comments Section */}
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>Comments</IonCardTitle>
            </IonCardHeader>
            {activity?.comments?.map((comment: any, index: any) => (
              <IonCard className="commentbox" key={index}>
                <IonAvatar className="commentavatar">
                  <IonImg
                    alt="Silhouette of a person's head"
                    src={avatar}
                  ></IonImg>
                </IonAvatar>
                <IonCardContent className="commentcontents">
                  <h2>{comment.userID}</h2>
                  {comment.commentText}
                  <IonNote>
                    <Timestamp date={comment.commentDate}></Timestamp>
                  </IonNote>
                </IonCardContent>
              </IonCard>
            ))}
          </IonCard>
        </IonContent>
      </IonPage>
    </>
  );
}

export default AttractionPage;
