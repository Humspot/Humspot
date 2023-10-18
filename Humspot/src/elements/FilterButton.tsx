import {
  IonContent,
  IonFab,
  IonFabButton,
  IonIcon,
  IonPage,
} from "@ionic/react";
import { filter } from "ionicons/icons";

function FilterButton() {
  return (
    <IonFab slot="fixed" vertical="bottom" horizontal="end">
      <IonFabButton color={"tertiary"}>
        <IonIcon icon={filter}></IonIcon>
      </IonFabButton>
    </IonFab>
  );
}

export default FilterButton;
