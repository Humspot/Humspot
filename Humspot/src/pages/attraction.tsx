import {
  IonAvatar,
  IonBackButton,
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
import { handleGetEvent } from "../utils/server";
import { useContext } from "../utils/my-context";
import avatar from "../elements/avatar.svg";
import placeholder from '../elements/placeholder.png';
import { formatDate } from "../utils/formatDate";
import { useToast } from "@agney/ir-toast";
import { timeout } from "../utils/timeout";


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
  const Toast = useToast();
  const imgStyle = {
    width: "100%", // Ensure the image takes up the full width of the container
    height: "30vh", // Ensure the image takes up the full height of the container
    objectFit: "cover", // Crop and fit the image within the container
    position: "absolute",
    opacity: "0.85"
  };
  const [activity, setActivity] = useState<any>(null);
  
  const handleGetEventCallback = useCallback(async (id: string) => {
    const res = await handleGetEvent(id);
    if ("event" in res && res.event) setActivity(res.event);
  }, []);
  useEffect(() => {
    if (id) handleGetEventCallback(id);
  }, [id]);

  const testFavorite = () => {
    timeout(500).then(() => {
      const t = Toast.create({ message: "Favorite added!", duration: 2000, color: "dark" });
      t.present();
    });
  }

  const testVisited = () => {
    timeout(500).then(() => {
      const t = Toast.create({ message: "You've added this to Visited!", duration: 2000, color: "dark" });
      t.present();
    });
  }

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
            onClick={() => testFavorite()}
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
          onClick={() => testVisited()}
        >
          <IonIcon slot="icon-only" icon={walkOutline}></IonIcon>
        </IonButton>
        <IonImg
          alt="Attraction Image"
          src={activity?.photoUrl || placeholder}
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
          {activity && "tags" in activity && activity.tags.split(',').map((tag: string, index: number) => {
            return (
              <IonChip key={tag + index} color={"secondary"}>{tag}</IonChip>
            )
          })}
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
                  {formatDate(activity?.date ?? "")}
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
                  {formatDate(comment.commentDate ?? "")}
                </IonNote>
              </IonCardContent>
            </IonCard>
          ))}
        </IonCard>
      </IonContent>
    </IonPage >
    </>
  );
}

export default AttractionPage;
