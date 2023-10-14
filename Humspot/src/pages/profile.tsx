import { IonAvatar, IonContent, IonHeader, IonIcon, IonPage } from "@ionic/react";

function ProfilePage() {
    return(
        <>
        <IonPage>
            
            <IonContent>
            <div className="Bio">
                <h1>NAME</h1>
                <IonAvatar>
        <img alt="Silhouette of a person's head" src="https://ionicframework.com/docs/img/demos/avatar.svg" />
      </IonAvatar>
      </div>
            </IonContent>
            
        </IonPage>
        </>
    )
}

export default ProfilePage;