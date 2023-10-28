import { IonButton, IonContent, IonIcon, IonPage } from "@ionic/react";
import { walk, walkOutline } from "ionicons/icons";
import clickOnVisited from "../../pages/ActivityPage";

function ActivityVisitedButton() {
  return (
    <IonButton
      className="VisitedButton"
      fill="clear"
      color={"secondary"}
      size="large"
      id="VisitedButton"
      onClick={() => clickOnVisited()}
    >
      <IonIcon slot="icon-only" icon={walkOutline}></IonIcon>
    </IonButton>
  );
}

export default ActivityVisitedButton;
