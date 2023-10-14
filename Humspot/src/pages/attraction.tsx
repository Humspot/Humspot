import {
  IonAvatar,
  IonContent,
  IonHeader,
  IonIcon,
  IonPage,
} from "@ionic/react";
import { RouteComponentProps } from "react-router-dom";
import { useParams } from "react-router-dom";

function AttractionPage() {
  const { id } = useParams();
  return (
    <>
      <IonPage>
        <IonContent>
          <h1>ATTRACTION PAGE</h1>
          <p>{id}</p>
        </IonContent>
      </IonPage>
    </>
  );
}

export default AttractionPage;
