import {
  IonAlert,
  IonAvatar,
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonCheckbox,
  IonContent,
  IonHeader,
  IonIcon,
  IonImg,
  IonItem,
  IonLabel,
  IonList,
  IonNote,
  IonPage,
  IonSegment,
  IonSegmentButton,
  IonTitle,
  IonToggle,
  IonToolbar,
  useIonRouter,
} from "@ionic/react";
import "./profile.css";
import { useCallback, useEffect, useState } from "react";
import { map, pin, star } from "ionicons/icons";
import { guestUser, useContext } from "../my-context";
import avatar from "../elements/avatar.svg";
import {
  handleGetFavoritesGivenUserID,
  handleGetVisitedGivenUserID,
  handleLogout,
} from "../server";
function ProfilePage() {
  const context = useContext();
  const [visited, setVisited] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [selectedSegment, setSelectedSegment] = useState("favorites");
  const router = useIonRouter();

  const handleGetFavorites = useCallback(async () => {
    const res = await handleGetFavoritesGivenUserID(
      1,
      context.humspotUser?.userID ?? ""
    );
    if ("favorites" in res && res.favorites) setFavorites(res.favorites);
  }, []);
  const handleGetVisited = useCallback(async () => {
    const res = await handleGetVisitedGivenUserID(
      1,
      context.humspotUser?.userID ?? ""
    );
    if ("visited" in res && res.visited) setVisited(res.visited);
  }, []);
  useEffect(() => {
    if (context.humspotUser && context.humspotUser.userID) {
      handleGetFavorites();
    }
  }, [context.humspotUser]);
  useEffect(() => {
    if (context.humspotUser) {
      handleGetVisited();
    }
  }, [context.humspotUser]);
  function handleRoute(item: any) {
    if (item.activityType === "event")
      router.push("/attraction/" + item.eventID);
    else if (item.activityType === "attraction")
      router.push("/attraction/" + item.attractionID);
  }

  return (
    <>
      <IonPage>
        <IonContent>
          {/* Top Bio */}
          <IonCard>
            <IonCardHeader>
              <IonAvatar>
                <IonImg
                  src={context.humspotUser?.profilePicURL ?? avatar}
                  alt="User Profile Picture"
                ></IonImg>
              </IonAvatar>
              <IonCardTitle>{context.humspotUser?.username ?? ""}</IonCardTitle>
              <IonCardSubtitle>
                Member since {context.humspotUser?.dateCreated ?? ""}
              </IonCardSubtitle>
            </IonCardHeader>
          </IonCard>
          {/* Middle Segmented Area */}
          <IonSegment
            value={selectedSegment}
            onIonChange={(e) => setSelectedSegment(e.detail.value)}
          >
            <IonSegmentButton value="favorites">
              <div className="segmentbutton">
                <IonIcon icon={star} style={{ marginRight: "5px" }}></IonIcon>
                <IonLabel>Favorites</IonLabel>
              </div>
            </IonSegmentButton>
            <IonSegmentButton value="visited" className="segmentbutton">
              <div className="segmentbutton">
                <IonIcon icon={map} style={{ marginRight: "5px" }}></IonIcon>
                <IonLabel>Visited</IonLabel>
              </div>
            </IonSegmentButton>
            {/* FAVORITES */}
          </IonSegment>
          {selectedSegment === "favorites" ? (
            <IonCard>
              <IonCardContent>
                <IonList>
                  {favorites.map((item: any, index) => (
                    <IonItem
                      key={index}
                      onClick={() => {
                        handleRoute(item);
                      }}
                    >
                      <IonLabel>{item.name}</IonLabel>
                    </IonItem>
                  ))}
                </IonList>
              </IonCardContent>
            </IonCard>
          ) : (
            // VISITED
            <IonCard>
              <IonCardContent>
                <IonList>
                  {visited.map((item: any, index) => (
                    <IonItem key={index}>
                      <IonLabel>{item.name}</IonLabel>
                    </IonItem>
                  ))}
                </IonList>
              </IonCardContent>
            </IonCard>
          )}
          {/* Settings Section */}
          <IonCard>
            <IonCardHeader color={"primary"}>Settings</IonCardHeader>
            <IonCardContent>
              <IonItem>
                <IonToggle>
                  <IonLabel>Allow Notifications</IonLabel>
                  <IonNote color="medium" className="ion-text-wrap">
                    Recieve push notifications about upcoming events.
                  </IonNote>
                </IonToggle>
              </IonItem>
              <IonItem>
                <IonToggle>
                  <IonLabel>Show Comments</IonLabel>
                  <IonNote color="medium">
                    Display comments left by other users.
                  </IonNote>
                </IonToggle>
              </IonItem>
              <IonButton
                color="warning"
                expand="block"
                fill="outline"
                id="logout"
              >
                Log out
              </IonButton>
              <IonAlert
                header="Log Out?"
                trigger="logout"
                buttons={[
                  {
                    text: "Stay Signed In",
                    role: "cancel",
                    handler: () => {
                      console.log("Alert canceled");
                    },
                  },
                  {
                    text: "Log Out",
                    role: "confirm",
                    handler: async () => {
                      await handleLogout();
                    },
                  },
                ]}
                onDidDismiss={({ detail }) =>
                  console.log(`Dismissed with role: ${detail.role}`)
                }
              ></IonAlert>
              <IonButton
                color="danger"
                expand="block"
                fill="clear"
                id="deleteAccount"
              >
                Delete Account
              </IonButton>
              <IonAlert
                header="Delete Account?"
                message="Pressing YES will delete your account, saved favorites, visit history, and any comments you have posted."
                trigger="deleteAccount"
                buttons={[
                  {
                    text: "NO",
                    role: "cancel",
                    handler: () => {
                      console.log("Alert canceled");
                    },
                  },
                  {
                    text: "YES",
                    role: "confirm",
                    handler: () => {
                      console.log("Alert confirmed");
                    },
                  },
                ]}
                onDidDismiss={({ detail }) =>
                  console.log(`Dismissed with role: ${detail.role}`)
                }
              ></IonAlert>
            </IonCardContent>
          </IonCard>
        </IonContent>
      </IonPage>
    </>
  );
}

export default ProfilePage;
