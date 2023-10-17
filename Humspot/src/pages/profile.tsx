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
} from "@ionic/react";
import "./profile.css";
import { useState } from "react";
import { map, pin, star } from "ionicons/icons";

function ProfilePage() {
  const user = {
    name: "John Doe",
    signUpDate: "October 10, 2023",
    photoUrl: "https://ionicframework.com/docs/img/demos/avatar.svg",
  };
  const visited = [
    "Location 1",
    "Location 2",
    "Location 3",
    "Location 4",
    "Location 5",
  ];
  const favorites = ["Location 1", "Location 2", "Location 3"];
  const [selectedSegment, setSelectedSegment] = useState("favorites");
  return (
    <>
      <IonPage>
        <IonContent>
          {/* Top Bio */}
          <IonCard>
            <IonCardHeader>
              <IonAvatar>
                <img src={user.photoUrl} alt="User Profile" />
              </IonAvatar>
              <IonCardTitle>{user.name}</IonCardTitle>
              <IonCardSubtitle>Member since {user.signUpDate}</IonCardSubtitle>
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
          </IonSegment>
          {selectedSegment === "favorites" ? (
            <IonCard>
              <IonCardContent>
                <IonList>
                  {favorites.map((item, index) => (
                    <IonItem key={index}>
                      <IonLabel>{item}</IonLabel>
                    </IonItem>
                  ))}
                </IonList>
              </IonCardContent>
            </IonCard>
          ) : (
            <IonCard>
              <IonCardContent>
                <IonList>
                  {visited.map((item, index) => (
                    <IonItem key={index}>
                      <IonLabel>{item}</IonLabel>
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
                    handler: () => {
                      console.log("Alert confirmed");
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
