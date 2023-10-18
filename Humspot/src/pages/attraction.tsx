import {
  IonAvatar,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonChip,
  IonContent,
  IonHeader,
  IonIcon,
  IonPage,
} from "@ionic/react";
import { RouteComponentProps } from "react-router-dom";
import { useParams } from "react-router-dom";
import "./attraction.css";
import { Map, Marker } from "pigeon-maps";

export function LocationMap() {
  return (
    <Map
      defaultCenter={[40.87649434150835, -124.07918370203882]}
      defaultZoom={15}
      minZoom={15}
      maxZoom={15}
      height={150}
      width={150}
      attribution={false}
      mouseEvents={false}
      touchEvents={false}
    >
      <Marker
        width={30}
        height={30}
        anchor={[40.87649434150835, -124.07918370203882]}
      />
    </Map>
  );
}

function AttractionPage() {
  const { id, imgsrc }: any = useParams();
  const imgStyle = {
    width: "100%", // Ensure the image takes up the full width of the container
    height: "30vh", // Ensure the image takes up the full height of the container
    objectFit: "cover", // Crop and fit the image within the container
    position: "absolute",
  };
  return (
    <>
      <IonPage>
        <IonContent>
          <img
            alt="Attraction Image"
            src="https://source.unsplash.com/random/?forest,day"
            className="MainCarouselEntryHeaderImage"
            style={imgStyle as any} // Apply the custom styles to the image
          />
          <IonCard color={"primary"} className="headercard">
            <IonCardHeader>
              <h1>Name</h1>
            </IonCardHeader>
          </IonCard>
          <IonChip color={"secondary"}>Campus</IonChip>
          <IonChip color={"secondary"}>Hike</IonChip>
          <IonChip color={"secondary"}>Forest</IonChip>
          <IonCard>
            <IonCardContent className="locationcard">
              <p>Location</p>
              <div className="locationmap">
                <LocationMap />
              </div>
            </IonCardContent>
          </IonCard>
          <IonCard>
            <IonCardContent>
              <p>IF EVENT: Date & Time</p>
            </IonCardContent>
          </IonCard>
          <IonCard>
            <IonCardContent>
              <p>Description</p>
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
